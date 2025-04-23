import nodemailer from 'nodemailer';
import winston from 'winston';
import { MAIL_HOST, MAIL_PASSWORD, MAIL_USERNAME, MAIL_SECURE, MAIL_PORT } from '../config/env';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()]
});

export const sendMail = async (to: string, subject: string, html: string): Promise<boolean> => {
  try {
    if (!MAIL_HOST || !MAIL_USERNAME || !MAIL_PASSWORD) {
      throw new Error('Missing email configuration');
    }

    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT ? parseInt(MAIL_PORT) : 587,
      secure: MAIL_SECURE === 'true',
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD
      },
      tls: {
        // Solution for self-signed certificate error
        rejectUnauthorized: false // ⚠️ Only for development/testing!
      },
      connectionTimeout: 10000,
      socketTimeout: 10000
    });

    await transporter.verify();

    const mailOptions = {
      from: `"Your Service" <${MAIL_USERNAME}>`,
      to,
      subject,
      html
    };

    logger.info(`Attempting to send to: ${to}`);
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return true;

  } catch (error) {
    logger.error('Mail failed:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      to,
      subject
    });
    return false;
  }
};