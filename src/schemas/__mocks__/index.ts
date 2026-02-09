import { vi } from 'vitest';

/**
 * @constant mailRequestSchema - Mock object to simulate the mail request schema.
 * This mock is used in unit tests to verify that the schema validation logic is called correctly without actually validating data.
 */
const mailRequestSchema = {
  parse: vi.fn(() => ({})),
};

export { mailRequestSchema };
