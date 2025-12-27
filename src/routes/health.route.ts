import { Application, Request, Response } from 'express';

export const registerHealthRoutes = (app: Application): void => {
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });
};
