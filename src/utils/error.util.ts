import type { ErrorInfo } from '../errors/types/index.js';
import { prettifyError, ZodError } from 'zod';

/**
 * Represents a normalized error info object returned by extractErrorInfo.
 *
 * Extends ErrorInfo with any additional custom properties found on the error instance.
 * This allows for flexible error logging and API responses that include both standard
 * and custom error fields.
 */
interface ExtractedInfo extends ErrorInfo {
  [key: string]: unknown;
}

/**
 * Extracts the base error information from a standard Error object.
 *
 * Returns a normalized ErrorInfo object containing the cause, message, name, and stack trace.
 * Used as a foundation for building more specific error info structures for logging and API responses.
 *
 * @param error - The Error instance to extract info from.
 * @returns {ErrorInfo} The normalized error info object.
 */
const extractBaseProps = (error: unknown): ErrorInfo => {
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

/**
 * Extracts custom (non-standard) properties from an Error instance.
 *
 * Iterates over the error's own enumerable properties and filters out standard Error properties
 * (name, message, stack, cause). Returns an object containing only custom properties added by
 * error subclasses.
 *
 * @param error - The Error instance to extract custom properties from.
 * @returns {Record<string, unknown>} An object containing only custom properties.
 */
const extractCustomProps = (error: Error): Record<string, unknown> => {
  const baseProps = new Set(['name', 'message', 'stack', 'cause']);
  const customProps: Record<string, unknown> = {};

  for (const key of Object.keys(error)) {
    if (!baseProps.has(key)) {
      customProps[key] = Reflect.get(error, key);
    }
  }

  return customProps;
};

/**
 * Extracts and normalizes error information from various error types.
 *
 * Inspects the error instance and returns a standardized error info object
 * (ExtractedInfo) with relevant properties for logging and API responses.
 *
 * Handles:
 * - Zod validation errors (returns prettified error string)
 * - Custom error classes (automatically extracts custom properties)
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
  if (error instanceof ZodError) {
    return {
      message: prettifyError(error),
      name: 'ZodError',
    };
  }

  const baseProps: ErrorInfo = extractBaseProps(error);

  if (!(error instanceof Error)) {
    return baseProps as ExtractedInfo;
  }

  const customProps = extractCustomProps(error);

  return {
    ...baseProps,
    ...customProps,
  };
};

export { extractErrorInfo };
export type { ExtractedInfo };
