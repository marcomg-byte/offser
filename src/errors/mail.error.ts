import { Transporter } from 'nodemailer';

/**
 * Custom error for mail service failures.
 *
 * Thrown when an error occurs during mail transport or SMTP operations.
 * Captures SMTP configuration and the original error for debugging.
 */
class MailError extends Error {
  /**
   * The original error that caused the mail failure, if available.
   */
  public rootError?: unknown;

  /**
   * The nodemailer transporter instance used, if available.
   */
  public transporter?: Transporter;

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
   * Whether the SMTP connection is secure (TLS/SSL).
   */
  public secure: boolean;

  /**
   * Constructs a new MailError.
   * @param smtpHost - The SMTP host address.
   * @param smtpPort - The SMTP port number.
   * @param smtpUser - The SMTP username.
   * @param secure - Whether the SMTP connection is secure.
   * @param rootError - The original error that caused the failure (optional).
   * @param transporter - The nodemailer transporter instance (optional).
   */
  constructor(
    smtpHost: string,
    smtpPort: number,
    smtpUser: string,
    secure: boolean,
    rootError?: unknown,
    transporter?: Transporter,
  ) {
    super('Mail Service Error');
    this.name = 'MailError';
    this.smtpHost = smtpHost;
    this.smtpPort = smtpPort;
    this.smtpUser = smtpUser;
    this.secure = secure;
    this.rootError = rootError;
    this.transporter = transporter;
  }
}

export { MailError };
