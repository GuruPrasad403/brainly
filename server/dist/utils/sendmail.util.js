"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const winston_1 = __importDefault(require("winston"));
const env_1 = require("../config/env");
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [new winston_1.default.transports.Console()]
});
const sendMail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!env_1.MAIL_HOST || !env_1.MAIL_USERNAME || !env_1.MAIL_PASSWORD) {
            throw new Error('Missing email configuration');
        }
        const transporter = nodemailer_1.default.createTransport({
            host: env_1.MAIL_HOST,
            port: env_1.MAIL_PORT ? parseInt(env_1.MAIL_PORT) : 587,
            secure: env_1.MAIL_SECURE === 'true',
            auth: {
                user: env_1.MAIL_USERNAME,
                pass: env_1.MAIL_PASSWORD
            },
            tls: {
                // Solution for self-signed certificate error
                rejectUnauthorized: false // ⚠️ Only for development/testing!
            },
            connectionTimeout: 10000,
            socketTimeout: 10000
        });
        yield transporter.verify();
        const mailOptions = {
            from: `"Your Service" <${env_1.MAIL_USERNAME}>`,
            to,
            subject,
            html
        };
        logger.info(`Attempting to send to: ${to}`);
        const info = yield transporter.sendMail(mailOptions);
        logger.info(`Email sent: ${info.messageId}`);
        return true;
    }
    catch (error) {
        logger.error('Mail failed:', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            to,
            subject
        });
        return false;
    }
});
exports.sendMail = sendMail;
