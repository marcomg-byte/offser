/**
 * Structure for standardized Zod validation error information.
 *
 * Used to represent prettified validation errors from Zod schema checks
 * for consistent API responses and error handling.
 *
 * @property error The prettified validation error message.
 */
interface ZodErrorInfo {
  /** The prettified validation error message. */
  error: string;
}

export type { ZodErrorInfo };
