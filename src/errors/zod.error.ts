import { z as zod } from 'zod';

const CustomZodError = new zod.ZodError([
  {
    code: 'invalid_type',
    expected: 'string',
    message: 'Expected a string value',
    path: ['text', 'html', 'templateName'],
  },
  {
    code: 'invalid_type',
    expected: 'string',
    message: 'Invalid email address',
    path: ['to'],
  },
  {
    code: 'invalid_type',
    expected: 'string',
    message: 'Subject cannot be empty',
    path: ['subject'],
  },
  {
    code: 'invalid_type',
    expected: 'object',
    message: 'Template data must be an object',
    path: ['templateData'],
  },
]);

export { CustomZodError };
