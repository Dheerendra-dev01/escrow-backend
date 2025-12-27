import nodemailer from 'nodemailer';

import { logger } from '../config/logger';
import { env } from '../config/env';

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendEmail = async (options: {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: env.SMTP_FROM,
      ...options,
    });

   // logger.info('Email sent:', info.messageId);
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw error;
  }
};

// Optional: verify connection on startup
transporter.verify((error: Error | null) => {
  if (error) {
    logger.error('SMTP connection error:', error);
  } else {
    //logger.info('SMTP server is ready to take our messages');
  }
});
