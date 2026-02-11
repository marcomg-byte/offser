import { describe, it, afterEach, beforeEach, expect, vi, Mock } from 'vitest';
import { createTransport } from 'nodemailer';
import {
  ConnectionVerificationError,
  MailDeliveryError,
} from '../errors/index.js';
import { createMockTransporter } from '../__mocks__/index.js';
import { sendMail, verifyConnection } from './index.js';

vi.mock('nodemailer', () => ({
  createTransport: vi.fn(),
}));
vi.mock('./index.js');
vi.mock('../config/env.ts');

describe('mail.service', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createTransporter', () => {
    let env: {
      SMTP_PORT: number;
      SMTP_SECURE: boolean;
    };

    beforeEach(async () => {
      const { env: importedEnv } = await import('../config/env.js');
      env = importedEnv;
    });

    it('should throw TransporterCreationError if createTransport fails', async () => {
      const error = new Error('Transporter creation failed');
      (createTransport as Mock).mockImplementation(() => {
        throw error;
      });

      await expect(import('./mail.service.js')).rejects.toMatchObject({
        name: 'TransporterCreationError',
      });
    });

    it('should throw TransporterCreation error for secure=true and port!==465', async () => {
      env.SMTP_SECURE = true;
      env.SMTP_PORT = 587;

      await expect(import('./mail.service.js')).rejects.toMatchObject({
        name: 'TransporterCreationError',
      });
    });

    it('should throw TransporterCreationError for secure=false and port!==567', async () => {
      env.SMTP_SECURE = false;
      env.SMTP_PORT = 567;

      await expect(import('./mail.service.js')).rejects.toMatchObject({
        name: 'TransporterCreationError',
      });
    });
  });

  describe('verifyConnection', () => {
    it('should resolve to trrue when the connection is successful', async () => {
      vi.mocked(verifyConnection).mockResolvedValue(true);

      const result = await verifyConnection();

      await expect(verifyConnection()).resolves.toBe(true);
      expect(result).toBe(true);
      expect(verifyConnection).toHaveBeenCalledTimes(2);
    });

    it('should throw ConnectionVerificationError when the connection verification fails', async () => {
      const mockTransporter = createMockTransporter();
      const mockError = new ConnectionVerificationError(
        mockTransporter,
        new Error('Connection failed'),
      );
      vi.mocked(verifyConnection).mockRejectedValue(mockError);

      await expect(verifyConnection()).rejects.toThrow(
        ConnectionVerificationError,
      );
      expect(verifyConnection).toHaveBeenCalledTimes(1);
    });

    it('should throw ConnectionVerificationError when transporter.verify throws', async () => {
      const mockTransporter = {
        verify: vi.fn(() => {
          throw new Error('Verification failed');
        }),
        sendMail: vi.fn(),
      };
      (createTransport as Mock).mockReturnValue(mockTransporter);

      const { verifyConnection } = await import('./mail.service.js');

      await expect(verifyConnection()).rejects.toMatchObject({
        name: 'ConnectionVerificationError',
      });
    });
  });

  describe('sendMail', () => {
    const mailOptions = {
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test text body',
      html: '<p>Test HTML body</p>',
    };

    it('should send an email with the correct parameters', async () => {
      const expectedResponse = { messageId: '123-abc' };

      vi.mocked(sendMail).mockResolvedValue(expectedResponse);

      const result = await sendMail(mailOptions);

      expect(result).toBe(expectedResponse);
      expect(sendMail).toHaveBeenCalledWith(mailOptions);
      expect(sendMail).toHaveBeenCalledTimes(1);
    });

    it('should throw MailDeliveryError when sending fails', async () => {
      const mockTransporter = createMockTransporter();
      const deliveryError = new MailDeliveryError(
        mockTransporter,
        mailOptions.to,
        mailOptions.subject,
        mailOptions.text,
        mailOptions.html,
        new Error('Delivery failed'),
      );

      vi.mocked(sendMail).mockRejectedValue(deliveryError);

      await expect(sendMail(mailOptions)).rejects.toThrow(MailDeliveryError);
      expect(sendMail).toHaveBeenCalledWith(mailOptions);
      expect(sendMail).toHaveBeenCalledTimes(1);
    });

    it('should handle emails with only a text body', async () => {
      const textOnlyOptions = {
        to: 'text@example.com',
        subject: 'Text Only',
        text: 'This is a text-only email.',
      };
      const expectedResponse = { messageId: 'text-only-123' };
      vi.mocked(sendMail).mockResolvedValue(expectedResponse);

      const result = await sendMail(textOnlyOptions);

      expect(result).toBe(expectedResponse);
      expect(sendMail).toHaveBeenCalledWith(textOnlyOptions);
      expect(sendMail).toHaveBeenCalledTimes(1);
    });

    it('should handle emails with only an HTML body', async () => {
      const htmlOnlyOptions = {
        to: 'html@example.com',
        subject: 'HTML Only',
        html: '<p>This is an HTML-only email.</p>',
      };
      const expectedResponse = { messageId: 'html-only-123' };
      vi.mocked(sendMail).mockResolvedValue(expectedResponse);

      const result = await sendMail(htmlOnlyOptions);
      expect(result).toBe(expectedResponse);
      expect(sendMail).toHaveBeenCalledWith(htmlOnlyOptions);
      expect(sendMail).toHaveBeenCalledTimes(1);
    });

    it('should throw MailDeliveryError when transporter.sendMail throws', async () => {
      const mockTransporter = {
        sendMail: vi.fn(() => {
          throw new Error('SMTP error');
        }),
        verify: vi.fn(),
      };
      (createTransport as Mock).mockReturnValue(mockTransporter);

      const { sendMail } = await import('./mail.service.js');

      await expect(sendMail(mailOptions)).rejects.toMatchObject({
        name: 'MailDeliveryError',
      });
    });
  });
});
