import { vi } from 'vitest';

/**
 * Mock logger object for testing.
 * Each method is a Vitest mock function (vi.fn()).
 * Methods correspond to typical logger levels used in production code.
 */
const logger = {
  debug: vi.fn(),
  error: vi.fn(),
  flush: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
};

/**
 * Mock implementation of extractErrorInfo for testing.
 *
 * @param error - The error object to extract info from.
 * @returns An object containing error details.
 */
const extractErrorInfo = vi.fn((error: Error) => ({
  cause: error?.cause,
  message: error.message,
  name: error.name,
  stack: error?.stack,
}));

export { logger, extractErrorInfo };
