import { z as zod } from 'zod';

/**
 * Zod schema for validating an array of dashboard user objects.
 * Each object in the array must contain:
 *   - mail: a valid email address (string)
 *   - password: a non-empty string
 *
 * @type {zod.ZodArray<zod.ZodObject>}
 *
 * @property {number} id - The ID of the user. Must be a positive integer.
 * @property {string} mail - The email address to be validated. Must be in a valid email format.
 * @property {string} password - The password to be validated. Must be a non-empty string.
 */
const dashboardSchema = zod.array(
  zod.object({
    id: zod
      .number()
      .int()
      .positive({ message: 'ID must be a positive integer' }),
    mail: zod.string().min(1, { message: 'Invalid email address' }),
    password: zod.string().min(1, { message: 'Password cannot be empty' }),
  }),
);

export { dashboardSchema };
