import {
  CertificateNotFoundError,
  ConnectionVerificationError,
  MailDeliveryError,
  TemplateCompileError,
  TemplatePreloadError,
  TransporterCreationError,
} from '../errors/index.js';
import type {
  CertificateNotFoundErrorInfo,
  ConnectionVerificationErrorInfo,
  ErrorInfo,
  MailDeliveryErrorInfo,
  TemplateCompileErrorInfo,
  TemplatePreloadErrorInfo,
  TransporterCreationErrorInfo,
  ZodErrorInfo,
} from '../errors/types/index.js';
import { prettifyError, ZodError } from 'zod';

/**
 * Union type representing all possible normalized error info structures returned by extractErrorInfo.
 *
 * This type includes all supported error info interfaces for template, mail, validation, and HTTPS certificate errors.
 * It ensures type safety and consistency for error handling and API responses throughout the application,
 * covering every error type that can be processed by extractErrorInfo.
 */
type ExtractedInfo =
  | ErrorInfo
  | CertificateNotFoundErrorInfo
  | ConnectionVerificationErrorInfo
  | TemplateCompileErrorInfo
  | TemplatePreloadErrorInfo
  | MailDeliveryErrorInfo
  | TransporterCreationErrorInfo
  | ZodErrorInfo;

/**
 * Extracts the base error information from a standard Error object.
 *
 * Returns a normalized ErrorInfo object containing the cause, message, name, and stack trace.
 * Used as a foundation for building more specific error info structures for logging and API responses.
 *
 * @param error - The Error instance to extract info from.
 * @returns {ErrorInfo} The normalized error info object.
 */
const extractBaseInfo = (error: Error): ErrorInfo => ({
  cause: error?.cause,
  message: error.message,
  name: error.name,
  stack: error?.stack,
});

/**
 * Extracts and normalizes error information from various error types.
 *
 * Inspects the error instance and returns a standardized error info object
 * (ExtractedInfo) with relevant properties for logging and API responses.
 *
 * Handles:
 * - Zod validation errors (returns prettified error string)
 * - Template compilation and preload errors (includes template context)
 * - Mail service errors (includes mail context)
 * - Generic errors (returns base error info)
 * - Unknown error types (returns a generic error info object)
 *
 * @param error - The error object to extract info from (can be any type).
 * @returns {ExtractedInfo} A normalized error info object with relevant properties for the error type.
 *
 * @example
 * const info = extractErrorInfo(new ZodError(...));
 * // info: { error: 'prettified validation error' }
 *
 * const info = extractErrorInfo(new TemplateCompileError(...));
 * // info: { message, name, rootError, templateData, templateName, ... }
 *
 * const info = extractErrorInfo(new Error('Something went wrong'));
 * // info: { message: 'Something went wrong', name: 'Error', ... }
 */
const extractErrorInfo = (error: unknown): ExtractedInfo => {
  let baseInfo: ErrorInfo;

  if (error instanceof ZodError) {
    return {
      error: prettifyError(error),
    };
  }

  if (error instanceof Error) {
    baseInfo = extractBaseInfo(error);
  }

  if (error instanceof CertificateNotFoundError) {
    return {
      ...baseInfo,
      certPath: error.certPath,
      keyPath: error.keyPath,
    };
  }

  if (error instanceof ConnectionVerificationError) {
    return {
      ...baseInfo,
      rootError: error?.rootError,
      transporter: error.transporter,
    };
  }

  if (error instanceof MailDeliveryError) {
    return {
      ...baseInfo,
      rootError: error?.rootError,
      to: error.to,
      subject: error.subject,
      text: error.text,
      html: error.html,
      transporter: error.transporter,
    };
  }

  if (error instanceof TemplateCompileError) {
    return {
      ...baseInfo,
      rootError: error?.rootError,
      templateData: error.templateData,
      templateName: error.templateName,
    };
  }

  if (error instanceof TemplatePreloadError) {
    return {
      ...baseInfo,
      rootError: error?.rootError,
    };
  }

  if (error instanceof TransporterCreationError) {
    return {
      ...baseInfo,
      rootError: error?.rootError,
      smtpHost: error.smtpHost,
      smtpPort: error.smtpPort,
      smtpUser: error.smtpUser,
      secure: error.secure,
    };
  }

  if (error instanceof Error) {
    return baseInfo;
  }

  baseInfo = {
    cause: undefined,
    message: 'An Unknown Error Occurred',
    name: 'UnknownError',
    stack: undefined,
  };

  return baseInfo;
};

export { extractErrorInfo };
export type { ExtractedInfo as ErrorInfo };
