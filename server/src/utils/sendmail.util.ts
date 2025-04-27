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

// New Beautiful Email Template
const otpEmailTemplate = (otp: string,name:string) => `
<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;background-color:#f9fafb;font-family:'Inter',sans-serif;">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>OTP Verification</title>
  <style>
    .container {
      max-width: 600px;
      margin: 50px auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      color: #1f2937; /* gray-900 */
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 24px;
    }
    .otp-box {
      background: #fef3c7; /* amber-100 */
      padding: 20px 30px;
      border-radius: 10px;
      font-size: 36px;
      font-weight: bold;
      color: #92400e; /* amber-700 */
      text-align: center;
      letter-spacing: 8px;
      margin: 30px 0;
    }
    .message {
      font-size: 18px;
      color: #4b5563; /* gray-700 */
      text-align: center;
      margin-top: 20px;
      line-height: 1.6;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 14px;
      color: #9ca3af; /* gray-400 */
    }
    .button {
      display: inline-block;
      margin-top: 30px;
      padding: 12px 24px;
      background-color: #f59e0b; /* amber-500 */
      color: #ffffff;
      font-weight: 600;
      text-decoration: none;
      border-radius: 8px;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Verify Your OTP</div>

    <div class="message">
      Hi ${name},<br><br>
      Use the following OTP to complete your verification. It is valid for <strong>10 minutes</strong>.
    </div>

    <div class="otp-box">${otp}</div>

    <div class="message">
      If you didn’t request this, you can safely ignore this email.<br><br>
      Thanks for trusting us! 🎉
    </div>

    <div class="footer">
      © 2025 Your Company. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const sendMail = async (to: string, otp: string,name:string): Promise<boolean> => {
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
        rejectUnauthorized: false
      },
      connectionTimeout: 10000,
      socketTimeout: 10000
    });

    await transporter.verify();

    const htmlContent = otpEmailTemplate(otp,name);

    const mailOptions = {
      from: `"Your Service" <${MAIL_USERNAME}>`,
      to,
      subject: 'Your OTP Code',
      html: htmlContent
    };

    logger.info(`Attempting to send OTP to: ${to}`);
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return true;

  } catch (error) {
    logger.error('Failed to send OTP Email:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      to
    });
    return false;
  }
};
