import nodemailer from 'nodemailer';
import { env } from '../config/env';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = env;


function createTransporter() {
    try {
        return nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: false,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            }
        });
    } catch (err: Error | unknown) {
        const error = err as Error;
        console.error('❌ Failed to create mail transporter:', error.message);
        return null;
    }
};

const transporter = createTransporter();

type SendMailOptions = {
    to: string;
    subject: string;
    text?: string;
    html?: string;
};

async function verifyConnection() {
    try {
        return transporter.verify();
    } catch (err: Error | unknown) {
        const error = err as Error;
        console.error('❌ Connection to mail server failed:', error.message);
        return false;
    }
};

async function sendMail(options: SendMailOptions) {
    const { to, subject, text, html } = options;

    return transporter.sendMail({
        from: MAIL_FROM,
        to,
        subject,
        text,
        html
    });
}

export { sendMail, verifyConnection };
export type { SendMailOptions };