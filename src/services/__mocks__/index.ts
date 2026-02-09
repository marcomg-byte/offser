import { vi } from 'vitest';
/**
 * @constant compileTemplate - Mock function to simulate template compilation.
 * This function is used in unit tests to verify that the template compilation logic is called correctly without actually compiling templates.
 */
const compileTemplate = vi.fn();
/**
 * @constant sendMail - Mock function to simulate sending an email.
 *  This function is used in unit tests to verify that the mail sending logic is called correctly without actually sending emails.
 */
const sendMail = vi.fn();

export { compileTemplate, sendMail };
