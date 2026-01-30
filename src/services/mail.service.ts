import { createTransport, Transporter } from 'nodemailer';
import { env } from '../config/env.js';
import {
  MailDeliveryError,
  TransporterCreationError,
  ConnectionVerificationError,
} from '../errors/index.js';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = env;

/**
 * Creates and configures a Nodemailer transporter for SMTP email delivery.
 *
 * Initializes a transporter with SMTP settings from environment variables
 * (host, port, user credentials). Uses a non-secure connection (SSL/TLS disabled).
 *
 * @returns {Transporter | null} A configured Nodemailer transporter instance, or null if initialization fails.
 *
 * @throws {TransporterCreationError} If transporter creation fails due to invalid configuration or other errors.
 *
 * @example
 * const transporter = createTransporter();
 * if (transporter) {
 *   await transporter.verify();
 * }
 */
function createTransporter(): Transporter | null {
  try {
    return createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  } catch (error: unknown) {
    throw new TransporterCreationError(
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      false,
      error,
    );
  }
}

const transporter = createTransporter();

/**
 * Options for sending an email using the mail service.
 *
 * @property to - Recipient email address.
 * @property subject - Email subject line.
 * @property text - Plain text email body (optional).
 * @property html - HTML email body (optional).
 */
type SendMailOptions = {
  /** Recipient email address. */
  to: string;
  /** Email subject line. */
  subject: string;
  /** Plain text email body (optional). */
  text?: string;
  /** HTML email body (optional). */
  html?: string;
};

/**
 * Verifies the SMTP transporter connection.
 *
 * Attempts to establish a connection with the configured SMTP server to ensure
 * that the transporter is ready to send emails. Throws a ConnectionVerificationError
 * if verification fails.
 *
 * @returns {Promise<boolean>} Resolves to true if the connection is verified successfully.
 * @throws {ConnectionVerificationError} If the SMTP connection verification fails.
 */
async function verifyConnection(): Promise<boolean> {
  try {
    return transporter.verify();
  } catch (error: unknown) {
    throw new ConnectionVerificationError(transporter, error);
  }
}

/**
 * Sends an email through the configured SMTP transporter.
 *
 * Composes and sends an email using the provided recipient, subject, and content (plain text or HTML).
 * The sender address is set from the MAIL_FROM environment variable.
 *
 * @async
 * @param options - The email configuration object.
 * @param options.to - Recipient email address.
 * @param options.subject - Email subject line.
 * @param options.text - Plain text email body (optional).
 * @param options.html - HTML email body (optional).
 *
 * @returns A promise that resolves with the SMTP response and message ID if successful.
 *
 * @throws {MailError} If the transporter is unavailable or SMTP communication fails.
 *         Ensure verifyConnection() passes before calling this function.
 *
 * @example
 * // Send a basic HTML email
 * await sendMail({
 *   to: 'user@example.com',
 *   subject: 'Welcome',
 *   html: '<p>Hello User!</p>'
 * });
 *
 * @example
 * // Send a plain text email
 * await sendMail({
 *   to: 'user@example.com',
 *   subject: 'Greetings',
 *   text: 'Hello User!'
 * });
 */
async function sendMail(options: SendMailOptions): Promise<unknown> {
  const { to, subject, text, html } = options;
  try {
    return transporter.sendMail({
      from: MAIL_FROM,
      to,
      subject,
      text,
      html,
    });
  } catch (error: unknown) {
    throw new MailDeliveryError(transporter, to, subject, text, html, error);
  }
}

export { sendMail, verifyConnection };
export type { SendMailOptions };
