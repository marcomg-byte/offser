import { describe, it, expect } from 'vitest';
import { mailRequestSchema } from './mail.schema.js';

describe('mail.schema.ts', () => {
  describe('mailRequestSchema', () => {
    describe('success', () => {
      it('should validate a minimal correct request', () => {
        const data = {
          to: 'test@example.com',
          subject: 'Test Subject',
        };

        const result = mailRequestSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should validate a request with text body', () => {
        const data = {
          to: 'test@example.com',
          subject: 'Test Subject',
          text: 'This is a plain text email.',
        };

        const result = mailRequestSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should validate a request with an HTML body', () => {
        const data = {
          to: 'test@example.com',
          subject: 'Test Subject',
          html: '<p>This is an HTML email.</p>',
        };

        const result = mailRequestSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should validate a request with a template', () => {
        const data = {
          to: 'test@example.com',
          subject: 'Test Subject',
          templateName: 'welcome-template',
          templateData: {
            name: 'John',
            activationLink: 'https://example.com/activate',
          },
        };

        const result = mailRequestSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('should validate a request with all optional fields', () => {
        const data = {
          to: 'test@example.com',
          subject: 'Complete Email',
          text: 'Plain text version.',
          html: '<p>HTML version.</p>',
          templateName: 'full-template',
          templateData: { user: 'Jane' },
        };
        const result = mailRequestSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    describe('failure', () => {
      it('should fail if "to" is missing', () => {
        const data = {
          subject: 'Test Subject',
        };

        const result = mailRequestSchema.safeParse(data);
        expect(result.success).toBe(false);

        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(['to']);
          expect(result.error.issues[0].message).toBe(
            'Invalid input: expected string, received undefined',
          );
        }
      });

      it('should fail if "to" is not a valid email', () => {
        const data = { to: 'invalid-email', subject: 'Test Subject' };
        const result = mailRequestSchema.safeParse(data);

        expect(result.success).toBe(false);

        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(['to']);
          expect(result.error.issues[0].message).toBe('Invalid email address');
        }
      });

      it('should fail if "subject" is missing', () => {
        const data = { to: 'test@example.com' };
        const result = mailRequestSchema.safeParse(data);

        expect(result.success).toBe(false);

        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(['subject']);
          expect(result.error.issues[0].message).toBe(
            'Invalid input: expected string, received undefined',
          );
        }
      });

      it('should fail if "subject" is an empty string', () => {
        const data = { to: 'test@example.com', subject: '' };
        const result = mailRequestSchema.safeParse(data);

        expect(result.success).toBe(false);

        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(['subject']);
          expect(result.error.issues[0].message).toBe(
            'Subject cannot be empty',
          );
        }
      });

      it('should fail if "subject" contains only whitespace', () => {
        const data = { to: 'test@example.com', subject: '   ' };
        const result = mailRequestSchema.safeParse(data);

        expect(result.success).toBe(false);

        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(['subject']);
          expect(result.error.issues[0].message).toBe(
            'Subject cannot be empty',
          );
        }
      });

      it('should fail if "templateData" is not an object', () => {
        const data = {
          to: 'test@example.com',
          subject: 'Invalid Template Data',
          templateName: 'test',
          templateData: 'not-an-object',
        };

        const result = mailRequestSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(['templateData']);
          expect(result.error.issues[0].message).toBe(
            'Invalid input: expected record, received string',
          );
        }
      });
    });
  });
});
