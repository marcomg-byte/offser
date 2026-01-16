import { z as zod } from 'zod';

const mailRequestSchema = zod.object({
    to: zod.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
    subject: zod.string().regex(/([\w.\-_,/\\|Á-ÿ]+\s*)+/, 'Subject cannot be empty'),
    text: zod.string().optional(),
    html: zod.string().optional()
});

export { mailRequestSchema };