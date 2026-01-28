import { TemplateCompileError, MailError } from '../errors/index.js';
import { z as zod } from 'zod';
import { Transporter } from 'nodemailer';

/**
 * Standardized structure for parsed error objects.
 *
 * Represents the essential properties extracted from any error instance
 * for consistent error handling and logging throughout the application.
 *
 * @property cause - The underlying cause of the error, if available.
 * @property message - The error message.
 * @property name - The error class or type name.
 * @property stack - The stack trace, if available.
 */
interface ParsedError {
  /** The underlying cause of the error, if available. */
  cause?: unknown;
  /** The error message. */
  message: string;
  /** The error class or type name. */
  name: string;
  /** The stack trace, if available. */
  stack?: string;
}

/**
 * Parsed error structure for Zod validation errors.
 *
 * Extends ParsedError with Zod-specific properties for detailed validation diagnostics.
 *
 * @property issues - Array of Zod validation issues.
 * @property type - The Zod error type (e.g., 'object', 'string', etc.).
 */
interface ZodParsedError extends ParsedError {
  /** Array of Zod validation issues. */
  issues: zod.core.$ZodIssue[];
  /** The Zod error type (e.g., 'object', 'string', etc.). */
  type: unknown;
}

/**
 * Parsed error structure for template compilation errors.
 *
 * Extends ParsedError with properties specific to template compilation failures.
 *
 * @property rootError - The original error thrown during template compilation (optional).
 * @property templateName - The name of the template that failed to compile.
 * @property templateData - The data provided to the template during compilation.
 */
interface TemplateCompileParsedError extends ParsedError {
  /** The original error thrown during template compilation (optional). */
  rootError?: unknown;
  /** The name of the template that failed to compile. */
  templateName: string;
  /** The data provided to the template during compilation. */
  templateData: Record<string, unknown>;
}

/**
 * Parsed error structure for mail service errors.
 *
 * Extends ParsedError with properties specific to mail transport and SMTP failures.
 *
 * @property rootError - The original error that caused the mail failure (optional).
 * @property secure - Whether the SMTP connection is secure (TLS/SSL).
 * @property smtpHost - SMTP host address.
 * @property smtpPort - SMTP port number.
 * @property smtpUser - SMTP username.
 * @property transporter - The nodemailer transporter instance used (optional).
 */
interface MailParsedError extends ParsedError {
  /** The original error that caused the mail failure (optional). */
  rootError?: unknown;
  /** Whether the SMTP connection is secure (TLS/SSL). */
  secure: boolean;
  /** SMTP host address. */
  smtpHost: string;
  /** SMTP port number. */
  smtpPort: number;
  /** SMTP username. */
  smtpUser: string;
  /** The nodemailer transporter instance used (optional). */
  transporter?: Transporter;
}

/**
 * Union type representing all possible parsed error structures handled by extractErrorInfo.
 *
 * Can be a parsed mail error, template compilation error, Zod validation error, or a generic error.
 */
type ErrorInfo =
  | MailParsedError
  | ParsedError
  | TemplateCompileParsedError
  | ZodParsedError;

/**
 * Extracts and normalizes error information from various error types.
 *
 * Inspects the error instance and returns a standardized error info object
 * (ErrorInfo) with relevant properties for logging and API responses.
 *
 * Handles:
 * - Zod validation errors (ZodParsedError)
 * - Template compilation errors (TemplateCompileParsedError)
 * - Mail service errors (MailParsedError)
 * - Generic errors (ParsedError)
 * - Unknown error types (returns a generic ParsedError)
 *
 * @param error - The error object to extract info from (can be any type).
 * @returns {ErrorInfo} A normalized error info object with relevant properties for the error type.
 *
 * @example
 * const info = extractErrorInfo(new ZodError(...));
 * // info: { name, message, issues, type, ... }
 */
const extractErrorInfo = (error: unknown): ErrorInfo => {
  if (error instanceof zod.ZodError) {
    return {
      cause: error?.cause,
      issues: error.issues,
      message: error.message,
      name: error.name,
      stack: error?.stack,
      type: error.type,
    };
  }

  if (error instanceof TemplateCompileError) {
    return {
      cause: error?.cause,
      message: error.message,
      name: error.name,
      stack: error?.stack,
      rootError: error?.rootError,
      templateData: error.templateData,
      templateName: error.templateName,
    };
  }

  if (error instanceof MailError) {
    return {
      cause: error?.cause,
      message: error.message,
      name: error.name,
      rootError: error?.rootError,
      secure: error.secure,
      smtpHost: error.smtpHost,
      smtpPort: error.smtpPort,
      smtpUser: error.smtpUser,
      stack: error?.stack,
      transporter: error?.transporter,
    };
  }

  if (error instanceof Error) {
    return {
      cause: error?.cause,
      message: error.message,
      name: error.name,
      stack: error?.stack,
    };
  }

  return {
    cause: undefined,
    message: 'An Unknown Error Occurred',
    name: 'UnknownError',
    stack: undefined,
  };
};

export { extractErrorInfo };
