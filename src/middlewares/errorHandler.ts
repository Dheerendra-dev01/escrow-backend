import { NextFunction, Request, Response } from 'express';

import { logger } from '../config/logger';

// Basic centralized error handler
// In production you might expand this to handle custom error types
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  logger.error('Unhandled error:', err);

  res.status(500).json({
    message: 'Internal server error',
  });
};
