import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(getEnv('PORT', '4000')),
  MONGODB_URI: getEnv('MONGODB_URI', 'mongodb://127.0.0.1:27017/freelance_escrow'),
  SMTP_HOST: getEnv('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: Number(getEnv('SMTP_PORT', '587')),
  SMTP_SECURE: getEnv('SMTP_SECURE', 'false') === 'true',
  SMTP_USER: getEnv('SMTP_USER', ''),
  SMTP_PASS: getEnv('SMTP_PASS', ''),
  SMTP_FROM: getEnv('SMTP_FROM', 'noreply@freelance-escrow.com'),
  JWT_SECRET: getEnv('JWT_SECRET', 'your_jwt_secret'),
  RPC_URL: getEnv('RPC_URL', 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'),
};
