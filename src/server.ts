import app from '#/app.js';
import { connectDatabase } from '#/config/db.js';
import { env } from '#/config/env.js';
import { logger } from '#/utils/logger.js';

// 1. UNCAUGHT EXCEPTIONS
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down immediately...', err.message);
  process.exit(1);
});

const startServer = async () => {
  logger.system('Booting up application services...');

  // Connect to MongoDB
  await connectDatabase();

  // Start HTTP server
  const server = app.listen(env.PORT, () => {
    logger.info(`Environment : ${env.NODE_ENV.toUpperCase()}`);
    logger.success(`API Server  : http://localhost:${env.PORT}`);
  });

  // 2. UNHANDLED REJECTIONS
  process.on('unhandledRejection', (err: Error) => {
    logger.error('UNHANDLED REJECTION! Shutting down gracefully...', err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  // 3. SIGTERM HANDLER
  process.on('SIGTERM', () => {
    logger.system('SIGTERM RECEIVED. Shutting down gracefully...');
    server.close(() => {
      logger.success('Process terminated cleanly.');
    });
  });
};

startServer();