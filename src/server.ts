import { createApp } from './app';
import { connectDb } from './config/db';
import { logger } from './config/logger';
import { env } from './config/env';

const app = createApp();

const PORT = env.PORT;

const start = async (): Promise<void> => {
  await connectDb().then(() => {
    console.log('Database connected successfully');
  }).catch((err: unknown) => {
    console.error('Database connection failed', err);
    process.exit(1);
  });

  app.listen(PORT, () => {
     console.log(`Server listening on port ${PORT}`);
  });
};

start().catch((err: unknown) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
