import { vi } from 'vitest';

/**
 * @constant mailRequestSchema - Mock object to simulate the mail request schema.
 * This mock is used in unit tests to verify that the schema validation logic is called correctly without actually validating data.
 */
const mailRequestSchema = {
  parse: vi.fn(() => ({})),
};

/**
 * @constant offersTemplateSchema - Mock object to simulate the offers template schema.
 * This mock is used in unit tests to verify that the schema validation logic is called correctly without actually validating data.
 */
const offersTemplateSchema = {
  parse: vi.fn(() => ({})),
};

/**
 * @constant renderTemplateParamsSchema - Mock object to simulate the render template params schema.
 * This mock is used in unit tests to verify that the schema validation logic is called correctly without actually validating data.
 */
const renderTemplateParamsSchema = {
  parse: vi.fn(() => ({})),
};

/**
 * @constant salesTemplateSchema - Mock object to simulate the sales template schema.
 * This mock is used in unit tests to verify that the schema validation logic is called correctly without actually validating data.
 */
const salesTemplateSchema = {
  parse: vi.fn(() => ({})),
};

/**
 * @constant shipmentTemplateSchema - Mock object to simulate the shipment template schema.
 * This mock is used in unit tests to verify that the schema validation logic is called correctly without actually validating data.
 */
const shipmentTemplateSchema = {
  parse: vi.fn(() => ({})),
};

export {
  mailRequestSchema,
  offersTemplateSchema,
  renderTemplateParamsSchema,
  salesTemplateSchema,
  shipmentTemplateSchema,
};
