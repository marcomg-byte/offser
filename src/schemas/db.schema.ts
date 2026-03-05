import { z as zod } from 'zod';

/**
 * Zod schema for validating insert operations on the database.
 * Requires a valid email address for 'mail' and a non-empty string for 'password'.
 *
 * @type {zod.ZodObject}
 *
 * @property {string} mail - The email address to be inserted. Must be a valid email format.
 * @property {string} password - The password associated with the email. Must be a non-empty string.
 *
 * @example
 * // Validate a database insert request
 * const result = dbInsertSchema.safeParse({
 *   mail: 'example@example.com',
 *   password: 'securePassword123'
 * });
 */
const dbInsertSchema = zod.object({
  mail: zod.email(),
  password: zod.string().min(1),
});

/**
 * Zod schema for validating read operations on the database with range limits.
 * Accepts an optional 'lowerLimit' and a required 'upperLimit', both must be positive integers >= 1.
 *
 * @type {zod.ZodObject}
 *
 * @property {number} [lowerLimit] - The optional lower bound for the read operation. Must be a positive integer >= 1.
 * @property {number} upperLimit - The required upper bound for the read operation. Must be a positive integer >= 1.
 *
 * @example
 * // Validate a database read request with range
 * const result = dbReadSchema.safeParse({
 *   lowerLimit: 5,
 *   upperLimit: 20
 * });
 */
const dbReadSchema = zod.object({
  lowerLimit: zod.number().int().positive().min(1).optional(),
  upperLimit: zod.number().int().positive().min(1),
});

/**
 * Zod schema for validating delete operations on the database.
 * Requires a positive integer 'id' greater than or equal to 1.
 *
 * @type {zod.ZodObject}
 *
 * @property {number} id - The ID of the record to be deleted. Must be a positive integer greater than or equal to 1.
 *
 * @example
 * // Validate a database delete request
 * const result = dbDeleteSchema.safeParse({
 *   id: 5
 * });
 */
const dbDeleteSchema = zod.object({
  lowerLimit: zod.number().int().positive().min(1),
  upperLimit: zod.number().int().positive().min(1).optional(),
});

export { dbInsertSchema, dbReadSchema, dbDeleteSchema };
