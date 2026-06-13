export class OperationalError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Capture the stack trace, keeping the constructor call out of it
    Error.captureStackTrace(this, this.constructor);
  }
}