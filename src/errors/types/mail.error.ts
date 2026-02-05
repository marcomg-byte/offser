import { ErrorInfo } from './error.js';
import { Transporter } from 'nodemailer';

/**
 * Extended error information for SMTP connection verification failures.
 *
 * Captures the underlying error and transporter instance when SMTP connection verification fails.
 * Used for consistent error handling and logging during mail service startup or health checks.
 */
interface ConnectionVerificationErrorInfo extends ErrorInfo {
  /** The nodemailer transporter instance used during verification. */
  transporter: Transporter;
}

/**
 * Extended error information for mail delivery failures.
 *
 * Captures details about the attempted email delivery, including recipient, subject, content, transporter, and the underlying error.
 * Used for consistent error handling and logging when sending an email fails.
 */
interface MailDeliveryErrorInfo extends ErrorInfo {
  /** The recipient email address. */
  to: string;
  /** The subject of the email. */
  subject: string;
  /** The plain text content of the email, if provided. */
  text?: string;
  /** The HTML content of the email, if provided. */
  html?: string;
  /** The nodemailer transporter instance used to send the email. */
  transporter: Transporter;
}

/**
 * Extended error information for mail transporter creation failures.
 *
 * Captures details about the attempted transporter configuration and the underlying error.
 * Used for consistent error handling and logging when creating a nodemailer transporter fails.
 */
interface TransporterCreationErrorInfo extends ErrorInfo {
  /** The SMTP host address used for the transporter. */
  smtpHost: string;
  /** The SMTP port number used for the transporter. */
  smtpPort: number;
  /** The SMTP username used for authentication. */
  smtpUser: string;
  /** Whether the SMTP connection is secure (TLS/SSL). */
  secure: boolean;
}

export type {
  ConnectionVerificationErrorInfo,
  MailDeliveryErrorInfo,
  TransporterCreationErrorInfo,
};
