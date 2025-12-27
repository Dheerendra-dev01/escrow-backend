import winston from 'winston';

import { env } from './env';

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  env.NODE_ENV === 'production'
    ? winston.format.json()
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
);

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format,
  transports: [
   // new winston.transports.Console(),
  ],
});

// Optional: add file transports in prod if you want
if (env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  );
}
