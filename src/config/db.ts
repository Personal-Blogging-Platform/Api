import mongoose from 'mongoose';
import { env } from '#/config/env.js';
import { logger } from '#/utils/logger.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(env.MONGO_URI);
    logger.system(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    logger.error(`Database connection error: ${(error as Error).message}`);
    process.exit(1);
  }
};

// Handle connection lifecycle events
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB connection lost.');
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection pool error: ${err}`);
});