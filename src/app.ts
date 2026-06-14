import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { xss } from 'express-xss-sanitizer'
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from '#/middlewares/errorHandler.js';
import { OperationalError } from '#/utils/OperationalError.js';
import { asyncHandler } from '#/utils/asyncHandler.js';
import { env } from '#/config/env.js';

const app = express();

// app.set('trust proxy', 1);

// use cors, allow all origins in development and limit to frontend url in production
app.use(cors({
  origin: env.NODE_ENV === 'development' ? '*' : env.FRONTEND_URL,
}));
app.use(helmet());
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const globalLimiter = rateLimit({
  max: Number(env.RATE_LIMIT_MAX),
  windowMs: Number(env.RATE_LIMIT_WINDOW_MS),
  message: `Too many requests from this IP, please try again in ${Number(env.RATE_LIMIT_WINDOW_MS) / 1000 / 60} ${Number(env.RATE_LIMIT_WINDOW_MS) / 1000 / 60 > 1 ? 'minutes' : 'minute'}!`,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', globalLimiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Express 4.19+ made req.query getter-only to prevent prototype pollution.
// This redefines it as a writable data property so mongoSanitize can clean it.
app.use((req: Request, res: Response, next: NextFunction) => {
  Object.defineProperty(req, 'query', {
    value: req.query,
    writable: true,
    enumerable: true,
    configurable: true,
  });
  next();
});

app.use(mongoSanitize());
app.use(xss());


app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

app.get('/test-error', asyncHandler(async (req: Request, res: Response) => {
  throw new OperationalError(400, 'This is a simulated validation failure.');
}));


app.all('/{*splat}', (req: Request, res: Response, next: NextFunction) => {
  next(new OperationalError(404, `The route ${req.originalUrl} does not exist on this server.`));
});

app.use(errorHandler);

export default app;