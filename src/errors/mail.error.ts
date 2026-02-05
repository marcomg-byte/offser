import { Transporter } from 'nodemailer';

/**
 * Custom error for mail service failures.
 *
 * Thrown when an error occurs during mail transport or SMTP operations.
 * Captures SMTP configuration and the original error for debugging.
 *
 * Properties:
 * - smtpHost: The SMTP host address.
 * - smtpPort: The SMTP port number.
 * - smtpUser: The SMTP username.
 * - secure: Whether the SMTP connection is secure (TLS/SSL).
 */
class TransporterCreationError extends Error {
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
   */
  constructor(
    smtpHost: string,
    smtpPort: number,
    smtpUser: string,
    secure: boolean,
    cause?: unknown,
  ) {
    super('Mail Service Error', { cause });
    this.name = 'MailError';
    this.smtpHost = smtpHost;
    this.smtpPort = smtpPort;
    this.smtpUser = smtpUser;
    this.secure = secure;
  }
}

/**
 * Custom error for SMTP connection verification failures.
 *
 * Thrown when the application fails to verify the SMTP connection during startup or health checks.
 * Captures the original error for debugging purposes.
 *
 * Properties:
 * - transporter: The nodemailer transporter instance used.
 */
class ConnectionVerificationError extends Error {
  /**
   * The nodemailer transporter instance used, if available.
   */
  public transporter: Transporter;

  /**
   * Constructs a new ConnectionVerificationError.
   * @param cause - The original error that caused the verification failure (optional).
   * @param transporter - The nodemailer transporter instance (optional).
   */
  constructor(transporter: Transporter, cause?: unknown) {
    super('SMTP Connection Verification Failed', { cause });
    this.name = 'ConnectionVerificationError';
    this.transporter = transporter;
  }
}

/**
 * Custom error for mail delivery failures.
 *
 * Thrown when an error occurs while sending an email message.
 * Captures recipient, subject, content, transporter, and the original error for debugging.
 *
 * Properties:
 * - to: The recipient email address.
 * - subject: The subject of the email.
 * - text: The plain text content of the email (if provided).
 * - html: The HTML content of the email (if provided).
 * - transporter: The nodemailer transporter instance used to send the email.
 */
class MailDeliveryError extends Error {
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
   * @param cause - The original error that caused the failure (optional).
   */
  constructor(
    transporter: Transporter,
    to: string,
    subject: string,
    text?: string,
    html?: string,
    cause?: unknown,
  ) {
    super('Failed to Send Mail', { cause });
    this.name = 'MailDeliveryError';
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
