import dotenv from 'dotenv';
import { z } from 'zod';
import { logger } from '#/utils/logger.js';

// Load environmental variables from the .env file
dotenv.config();

// Define the precise schema for our environment variables
const envSchema = z.object({
  PORT: z.string().transform((val) => parseInt(val, 10)).default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(1, { message: 'JWT_SECRET is required to secure routes' }),
  MONGO_URI: z.string().url({ message: 'MONGO_URI must be a valid connection string' }),
  FRONTEND_URL: z.string().url({ message: 'FRONTEND_URL must be a valid URL, if you running the app in development mode just add a dummy url to .env file' }),
  RATE_LIMIT_MAX: z.string().transform((val) => parseInt(val, 10)).default(100),
  RATE_LIMIT_WINDOW_MS: z.string().transform((val) => parseInt(val, 10)).default(60 * 60 * 1000),
});

// Run the validation against process.env
const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  logger.error('Invalid environment configuration:');
  logger.error(JSON.stringify(envServer.error.format(), null, 2));
  process.exit(1);
}

// Export the validated, strongly-typed object
export const env = envServer.data;