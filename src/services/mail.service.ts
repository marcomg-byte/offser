import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logError } from '../utils/index.js';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = env;

/**
 * Creates and configures a Nodemailer transporter for SMTP email delivery.
 *
 * Initializes a transporter with SMTP settings from environment variables
 * (host, port, user credentials). Uses a non-secure connection (SSL/TLS disabled).
 *
 * @returns {nodemailer.Transporter | null} A configured Nodemailer transporter instance,
 *         or null if initialization fails.
 *
 * @throws Does not throw - errors are caught and logged internally.
 *
 * @example
 * const transporter = createTransporter();
 * if (transporter) {
 *   await transporter.verify();
 * }
 */
function createTransporter(): nodemailer.Transporter | null {
  try {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  } catch (error: unknown) {
    logError(error, 'Failed To Create Mail Transporter');
    return null;
  }
}

const transporter = createTransporter();

type SendMailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

/**
 * Verifies the SMTP transporter connection to the mail server.
 *
 * Attempts to establish a connection with the configured SMTP server
 * to validate that email delivery is possible. This should be called
 * during application startup or before attempting to send emails.
 *
 * @async
 * @returns {Promise<boolean>} True if the connection is valid and verified,
 *         false if verification fails or an error occurs.
 *
 * @throws Does not throw - errors are caught and logged internally.
 *
 * @example
 * const isConnected = await verifyConnection();
 * if (isConnected) {
 *   console.log('Mail service ready');
 * }
 */
async function verifyConnection() {
  try {
    return transporter.verify();
  } catch (error: unknown) {
    logError(error, 'Mail Transporter Connection Verification Failed');
    return false;
  }
}

/**
 * Sends an email through the configured SMTP transporter.
 *
 * Sends an email with the provided recipient, subject, and content (plain text or HTML).
 * The sender address is set from the MAIL_FROM environment variable.
 *
 * @async
 * @param {SendMailOptions} options - The email configuration object.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Email subject line.
 * @param {string} [options.text] - Plain text email body (optional).
 * @param {string} [options.html] - HTML email body (optional).
 *
 * @returns {Promise<unknown>} A promise that resolves with the SMTP response and message ID
 *         if successful, or rejects if the transporter is unavailable or SMTP fails.
 *
 * @throws {Error} May throw if the transporter is null or SMTP communication fails.
 *         Ensure verifyConnection() passes before calling this function.
 *
 * @example
 * await sendMail({
 *   to: 'user@example.com',
 *   subject: 'Welcome',
 *   html: '<p>Hello User!</p>'
 * });
 */
async function sendMail(options: SendMailOptions): Promise<unknown> {
  const { to, subject, text, html } = options;

  return transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject,
    text,
    html,
  });
}

export { sendMail, verifyConnection };
export type { SendMailOptions };
