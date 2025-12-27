import mongoose from 'mongoose';

import { env } from './env';

export const connectDb = async (): Promise<void> => {
 // console.log('Connecting to database...',mongoose.connection.readyState);
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(env.MONGODB_URI);
};
