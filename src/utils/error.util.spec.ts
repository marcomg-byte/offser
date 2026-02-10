import { describe, it, expect } from 'vitest';
import { extractErrorInfo } from './error.util.js';
import {
  CertificateNotFoundError,
  ConnectionVerificationError,
  MailDeliveryError,
  TemplateCompileError,
  TemplatePreloadError,
  TransporterCreationError,
  UnknownTemplateError,
} from '../errors/index.js';
import { z as zod } from 'zod';
import { createMockTransporter } from '../__mocks__/nodemailer.js';

describe('extractErrorInfo', () => {
  const mockTransporter = createMockTransporter();

  describe('ZodError', () => {
    it('should return prettified error string', () => {
      const zodError = new zod.ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          path: ['email'],
          message: 'Expected string, received number',
        },
      ]);
      const result = extractErrorInfo(zodError);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('name', 'ZodError');
      expect(typeof result.message).toBe('string');
      expect(result.message).toContain('email');
    });

    it('should handle multiple validation errors', () => {
      const zodError = new zod.ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          path: ['name'],
          message: 'Expected string',
        },
        {
          code: 'invalid_type',
          expected: 'string',
          path: ['email'],
          message: 'Required',
        },
      ]);
      const result = extractErrorInfo(zodError);

      expect(result.message).toContain('name');
      expect(result.message).toContain('email');
    });
  });

  describe('CertificateNotFoundError', () => {
    const CERT_PATH = '/path/to/cert.key';
    const KEY_PATH = '/path/to/key.pem';

    it('should include base props and certificate paths', () => {
      const error = new CertificateNotFoundError(CERT_PATH, KEY_PATH);
      const result = extractErrorInfo(error);

      expect(result).toMatchObject({
        name: 'CertificateNotFoundError',
        message: 'Certificate or Key Not Found When Creating HTTPS Server',
        certPath: CERT_PATH,
        keyPath: KEY_PATH,
      });
    });
  });

  describe('ConnectionVerificationError', () => {
    it('should include base props and transporter info', () => {
      const error = new ConnectionVerificationError(
        mockTransporter,
        new Error('Connection failed'),
      );
      const result = extractErrorInfo(error);

      expect(result).toMatchObject({
        name: 'ConnectionVerificationError',
        message: 'SMTP Connection Verification Failed',
        transporter: mockTransporter,
      });
      expect(result).toHaveProperty('cause');
      expect(result).toHaveProperty('stack');
      expect(result.cause).toBeInstanceOf(Error);
    });
  });

  describe('MailDeliveryError', () => {
    it('should include base props and mail delivery details', () => {
      const error = new MailDeliveryError(
        mockTransporter,
        'recipient@example.com',
        'Test Subject',
        'Plain text content',
        '<p>HTML content</p>',
        new Error('Send failed'),
      );

      const result = extractErrorInfo(error);

      expect(result).toMatchObject({
        name: 'MailDeliveryError',
        message: 'Failed to Send Mail',
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Plain text content',
        html: '<p>HTML content</p>',
        transporter: mockTransporter,
      });
      expect(result).toHaveProperty('cause');
      expect(result).toHaveProperty('stack');
      expect(result.cause).toBeInstanceOf(Error);
    });

    it('should handle mail without text content', () => {
      const error = new MailDeliveryError(
        mockTransporter,
        'user@example.com',
        'HTML Only',
        undefined,
        '<p>HTML</p>',
        new Error('Failed'),
      );

      const result = extractErrorInfo(error);

      expect(result).toMatchObject({
        to: 'user@example.com',
        subject: 'HTML Only',
        text: undefined,
        html: '<p>HTML</p>',
      });
      expect(result).toHaveProperty('cause');
      expect(result).toHaveProperty('stack');
      expect(result.cause).toBeInstanceOf(Error);
    });

    it('should handle mail without HTML content', () => {
      const error = new MailDeliveryError(
        mockTransporter,
        'user@example.com',
        'Plain Text Only',
        'Plain text',
        undefined,
        new Error('Failed'),
      );
      const result = extractErrorInfo(error);

      expect(result).toMatchObject({
        to: 'user@example.com',
        subject: 'Plain Text Only',
        text: 'Plain text',
        html: undefined,
      });
      expect(result).toHaveProperty('cause');
      expect(result).toHaveProperty('stack');
      expect(result.cause).toBeInstanceOf(Error);
    });
  });

  describe('TemplateCompileError', () => {
    it('should include base props and template details', () => {
      const templateData = { name: 'John', email: 'john@example.com' };
      const templateName = 'welcome';
      const error = new TemplateCompileError(
        templateName,
        templateData,
        new Error('Compilation failed'),
      );
      const result = extractErrorInfo(error);

      expect(result).toMatchObject({
        name: 'TemplateCompileError',
        message: `Failed to compile template: ${templateName}`,
        templateName,
        templateData,
      });
      expect(result).toHaveProperty('cause');
      expect(result).toHaveProperty('stack');
      expect(result.cause).toBeInstanceOf(Error);
    });

    it('should handle empty template data', () => {
      const templateName = 'empty-template';
      const error = new TemplateCompileError(
        templateName,
        {},
        new Error('No data provided'),
      );
      const result = extractErrorInfo(error);

      expect(result).toMatchObject({
        name: 'TemplateCompileError',
        message: `Failed to compile template: ${templateName}`,
        templateName,
        templateData: {},
      });
      expect(result).toHaveProperty('cause');
      expect(result).toHaveProperty('stack');
      expect(result.cause).toBeInstanceOf(Error);
    });
  });

  describe('TemplatePreloadError', () => {
    it('should include base props only', () => {
      const error = new TemplatePreloadError(new Error('Preload failed'));
      const result = extractErrorInfo(error);

      expect(result).toMatchObject({
        name: 'TemplatePreloadError',
        message: 'Failed to preload templates',
      });
      expect(result).toHaveProperty('cause');
      expect(result).toHaveProperty('stack');
      expect(result.cause).toBeInstanceOf(Error);
    });
  });

  describe('TransporterCreationError', () => {
    it('should include base props and SMTP configuration', () => {
      const error = new TransporterCreationError(
        'smtp.example.com',
        587,
        'user@example.com',
        false,
        new Error('Connection failed'),
      );
      const result = extractErrorInfo(error);

      expect(result).toMatchObject({
        name: 'TransporterCreationError',
        message: 'Mail Service Error',
        smtpHost: 'smtp.example.com',
        smtpPort: 587,
        smtpUser: 'user@example.com',
        secure: false,
      });
      expect(result).toHaveProperty('cause');
      expect(result).toHaveProperty('stack');
      expect(result.cause).toBeInstanceOf(Error);
    });

    it('should handle secure SMTP connection', () => {
      const error = new TransporterCreationError(
        'smtp.example.com',
        465,
        'user@example.com',
        true,
        new Error('Connection failed'),
      );
      const result = extractErrorInfo(error);

      expect(result).toMatchObject({
        name: 'TransporterCreationError',
        message: 'Mail Service Error',
        smtpHost: 'smtp.example.com',
        smtpPort: 465,
        smtpUser: 'user@example.com',
        secure: true,
      });
      expect(result).toHaveProperty('cause');
      expect(result).toHaveProperty('stack');
      expect(result.cause).toBeInstanceOf(Error);
    });
  });

  describe('UnknownTemplateError', () => {
    it('should include base props and template name', () => {
      const templateName = 'nonexistent-template';
      const error = new UnknownTemplateError(
        templateName,
        new Error('Template not found'),
      );
      const result = extractErrorInfo(error);

      expect(result).toMatchObject({
        name: 'UnknownTemplateError',
        message: `Unknown template: ${templateName}`,
        templateName,
      });
      expect(result).toHaveProperty('cause');
      expect(result).toHaveProperty('stack');
      expect(result.cause).toBeInstanceOf(Error);
    });
  });

  describe('Generic Error', () => {
    it('should extract base error info without custom props', () => {
      const error = new Error('Something went wrong');
      const result = extractErrorInfo(error);

      expect(result).toMatchObject({
        name: 'Error',
        message: 'Something went wrong',
      });
      expect(result).toHaveProperty('stack');
    });

    it('should include cause if present', () => {
      const rootError = new Error('Root cause');
      const error = new Error('Something went wrong', { cause: rootError });
      const result = extractErrorInfo(error);

      expect(result).toMatchObject({
        name: 'Error',
        message: 'Something went wrong',
      });
      expect(result).toHaveProperty('stack');
      expect(result).toHaveProperty('cause');
      expect(result.cause).toBe(rootError);
    });

    it('should handle error without stack trace', () => {
      const error = new Error('No stack trace');
      delete error.stack;
      const result = extractErrorInfo(error);

      expect(result).toMatchObject({
        name: 'Error',
        message: 'No stack trace',
        stack: undefined,
        cause: undefined,
      });
    });
  });

  describe('Custom Error with additional properties', () => {
    it('should extract custom properties from an error', () => {
      class CustomError extends Error {
        public customProp: string;
        public customNumber: number;

        constructor(
          message: string,
          customProp: string,
          customNumber: number,
          cause?: unknown,
        ) {
          super(message, { cause });
          this.name = 'CustomError';
          this.customProp = customProp;
          this.customNumber = customNumber;
        }
      }

      const error = new CustomError(
        'Custom Error',
        'customValue',
        42,
        new Error('Root cause'),
      );
      const result = extractErrorInfo(error);

      expect(result).toMatchObject({
        name: 'CustomError',
        message: 'Custom Error',
        customProp: 'customValue',
        customNumber: 42,
      });
      expect(result).toHaveProperty('stack');
      expect(result).toHaveProperty('cause');
      expect(result.cause).toBeInstanceOf(Error);
    });
  });

  describe('Non-Error types', () => {
    it('should handle null', () => {
      const result = extractErrorInfo(null);

      expect(result).toMatchObject({
        name: 'UnknownError',
        message: 'An Unknown Error Occurred',
        cause: undefined,
        stack: undefined,
      });
    });

    it('should handle undefined', () => {
      const result = extractErrorInfo(undefined);

      expect(result).toMatchObject({
        name: 'UnknownError',
        message: 'An Unknown Error Occurred',
        cause: undefined,
        stack: undefined,
      });
    });

    it('should handle number', () => {
      const result = extractErrorInfo(404);

      expect(result).toMatchObject({
        name: 'UnknownError',
        message: 'An Unknown Error Occurred',
        cause: undefined,
        stack: undefined,
      });
    });

    it('should handle plain object', () => {
      const result = extractErrorInfo({ some: 'object' });

      expect(result).toMatchObject({
        name: 'UnknownError',
        message: 'An Unknown Error Occurred',
        cause: undefined,
        stack: undefined,
      });
    });
  });

  describe('Edge cases', () => {
    it('should not extract non-enumerable properties', () => {
      const error = new Error('Non-enumerable test');
      Object.defineProperty(error, 'hiddenProp', {
        value: 'hidden',
        enumerable: false,
      });
      const result = extractErrorInfo(error);

      expect(result).not.toHaveProperty('hiddenProp');
    });

    it('should handle errors with circular references', () => {
      const error: unknown = new Error('Circular reference test');
      (error as Record<string, unknown>).self = error;
      const result = extractErrorInfo(error);

      expect(result).toHaveProperty('self');
      expect(result.self).toBe(error);
    });
  });
});
