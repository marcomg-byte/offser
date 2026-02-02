import { Transporter } from 'nodemailer';

/**
 * Custom error for mail service failures.
 *
 * Thrown when an error occurs during mail transport or SMTP operations.
 * Captures SMTP configuration and the original error for debugging.
 */
class TransporterCreationError extends Error {
  /**
   * The original error that caused the mail failure, if available.
   */
  public rootError?: unknown;
  /**
   * Whether the SMTP connection is secure (TLS/SSL).
   */
  public secure: boolean;
  /**
   * SMTP host address.
   */
  public smtpHost: string;
  /**
   * SMTP port number.
   */
  public smtpPort: number;
  /**
   * SMTP username.
   */
  public smtpUser: string;

  /**
   * Constructs a new MailError.
   * @param smtpHost - The SMTP host address.
   * @param smtpPort - The SMTP port number.
   * @param smtpUser - The SMTP username.
   * @param secure - Whether the SMTP connection is secure.
   * @param rootError - The original error that caused the failure (optional).
   */
  constructor(
    smtpHost: string,
    smtpPort: number,
    smtpUser: string,
    secure: boolean,
    rootError?: unknown,
  ) {
    super('Mail Service Error');
    this.name = 'MailError';
    this.smtpHost = smtpHost;
    this.smtpPort = smtpPort;
    this.smtpUser = smtpUser;
    this.secure = secure;
    this.rootError = rootError;
  }
}

/**
 * Custom error for SMTP connection verification failures.
 *
 * Thrown when the application fails to verify the SMTP connection during startup or health checks.
 * Captures the original error for debugging purposes.
 */
class ConnectionVerificationError extends Error {
  /**
   * The original error that caused the connection verification failure, if available.
   */
  public rootError?: unknown;
  /**
   * The nodemailer transporter instance used, if available.
   */
  public transporter: Transporter;

  /**
   * Constructs a new ConnectionVerificationError.
   * @param rootError - The original error that caused the verification failure (optional).
   * @param transporter - The nodemailer transporter instance (optional).
   */
  constructor(transporter: Transporter, rootError?: unknown) {
    super('SMTP Connection Verification Failed');
    this.name = 'ConnectionVerificationError';
    this.rootError = rootError;
    this.transporter = transporter;
  }
}

/**
 * Custom error for mail delivery failures.
 *
 * Thrown when an error occurs while sending an email message.
 * Captures recipient, subject, content, transporter, and the original error for debugging.
 */
class MailDeliveryError extends Error {
  /**
   * The original error that caused the mail delivery failure, if available.
   */
  public rootError?: unknown;
  /**
   * The recipient email address.
   */
  public to: string;
  /**
   * The subject of the email.
   */
  public subject: string;
  /**
   * The plain text content of the email, if provided.
   */
  public text?: string;
  /**
   * The HTML content of the email, if provided.
   */
  public html?: string;
  /**
   * The nodemailer transporter instance used to send the email.
   */
  public transporter: Transporter;

  /**
   * Constructs a new MailDeliveryError.
   * @param transporter - The nodemailer transporter instance used.
   * @param to - The recipient email address.
   * @param subject - The subject of the email.
   * @param text - The plain text content of the email (optional).
   * @param html - The HTML content of the email (optional).
   * @param rootError - The original error that caused the failure (optional).
   */
  constructor(
    transporter: Transporter,
    to: string,
    subject: string,
    text?: string,
    html?: string,
    rootError?: unknown,
  ) {
    super('Failed to Send Mail');
    this.name = 'MailDeliveryError';
    this.rootError = rootError;
    this.transporter = transporter;
    this.to = to;
    this.subject = subject;
    this.text = text;
    this.html = html;
  }
}

export {
  TransporterCreationError,
  ConnectionVerificationError,
  MailDeliveryError,
};
