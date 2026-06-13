import { Request, Response, NextFunction } from 'express';
import { OperationalError } from '#/utils/OperationalError.js';
import { env } from '#/config/env.js';
import { ZodError } from 'zod';
import { logger } from '#/utils/logger.js'

// --- 1. Error Transformers ---

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new OperationalError(400, message);
};

const handleDuplicateFieldsDB = (err: any) => {
  // Extract the duplicated value from MongoDB's keyValue object
  const value = err.keyValue ? Object.values(err.keyValue)[0] : 'unknown value';
  const message = `Duplicate field value: '${value}'. Please use another value!`;
  return new OperationalError(400, message);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new OperationalError(400, message);
};

const handleJWTError = () =>
  new OperationalError(401, 'Invalid token. Please log in again!');

const handleJWTExpiredError = () =>
  new OperationalError(401, 'Your token has expired! Please log in again.');

// --- 2. Our Modern Stack Addition (Zod) ---
const handleZodError = (err: ZodError) => {
  const errors = err.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
  const message = `Validation Error: ${errors.join('. ')}`;
  return new OperationalError(400, message);
};


// --- 3. The Main Global Error Handler Middleware ---

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Start with a generic 500 status
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let isOperational = err.isOperational || false;

  // Let's create a shallow copy to manipulate, retaining the original name and code
  let error = { ...err, message: err.message, name: err.name, code: err.code };

  // --- Transform 3rd Party Errors into Operational Errors ---
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
  if (err instanceof ZodError) error = handleZodError(err); // Note: check original 'err' for instance

  // If we successfully transformed it, update our local variables
  if (error instanceof OperationalError) {
    statusCode = error.statusCode;
    message = error.message;
    isOperational = error.isOperational;
  }

  // --- 4. Send Response Based on Environment ---

  if (env.NODE_ENV === 'development') {
    // Development: Send everything, including the stack trace
    logger.error('ERROR: ', error);
    res.status(statusCode).json({
      success: false,
      error: error,
      message: message,
      stack: err.stack,
    });
  } else {
    // Production: Only send nice, operational messages to the client
    if (isOperational) {
      res.status(statusCode).json({
        success: false,
        message: message,
      });
    } else {
      // 1) Log the raw error so the DevOps/Backend team can fix it
      logger.error('ERROR: ', err);

      // 2) Send a generic message to the client so we don't leak details
      res.status(500).json({
        success: false,
        message: 'Something went very wrong!',
      });
    }
  }
};