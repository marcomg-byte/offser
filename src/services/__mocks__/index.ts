import { vi } from 'vitest';

/**
 * @constant clearTemplateCache - Mock function to simulate clearing the template cache.
 * This function is used in unit tests to verify that the template cache clearing logic is called correctly without actually clearing any cache.
 */
const clearTemplateCache = vi.fn();
/**
 * @constant compileTemplate - Mock function to simulate template compilation.
 * This function is used in unit tests to verify that the template compilation logic is called correctly without actually compiling templates.
 */
const compileTemplate = vi.fn();
/**
 * @constant preloadTemplates - Mock function to simulate preloading templates.
 * This function is used in unit tests to verify that the template preloading logic is called correctly without actually preloading any templates.
 */
const preloadTemplates = vi.fn();
/**
 * @constant sendMail - Mock function to simulate sending an email.
 *  This function is used in unit tests to verify that the mail sending logic is called correctly without actually sending emails.
 */
const sendMail = vi.fn();
/**
 * @constant verifyConnection - Mock function to simulate verifying a connection.
 * This function is used in unit tests to verify that the connection verification logic is called correctly without actually establishing a connection.
 */
const verifyConnection = vi.fn();

export {
  clearTemplateCache,
  compileTemplate,
  preloadTemplates,
  sendMail,
  verifyConnection,
};
