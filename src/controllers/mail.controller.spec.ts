import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Mock } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendMailHandler } from './mail.controller.js';
import { mailRequestSchema } from '../schemas/index.js';
import { compileTemplate, sendMail } from '../services/index.js';
import { logger } from '../utils/index.js';

vi.mock('../schemas/index.js');
vi.mock('../services/index.js');
vi.mock('../utils/index.js');

describe('sendMailHandler', () => {
  let next: NextFunction;
  let req: Partial<Request>;
  let res: Partial<Response>;

  let jsonMock: Mock;
  let statusMock: Mock;

  let mailSchemaParseSpy: Mock;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn(() => ({ json: jsonMock }));
    mailSchemaParseSpy = vi.spyOn(mailRequestSchema, 'parse');
    req = {
      body: {},
    };
    res = {
      status: statusMock,
    };
    next = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should send an email with HTML content successfully', async () => {
    const mockBody = {
      to: 'test,@example.com',
      subject: 'Test Subject',
      html: '<p>Hello World</p>',
    };

    const mockMailResponse = { messageId: '12345' };
    req.body = mockBody;

    vi.mocked(mailSchemaParseSpy).mockReturnValue(mockBody);
    vi.mocked(sendMail).mockResolvedValue(mockMailResponse);

    await sendMailHandler(req as Request, res as Response, next);

    expect(mailSchemaParseSpy).toHaveBeenCalledWith(mockBody);
    expect(sendMail).toHaveBeenCalledWith({
      to: mockBody.to,
      subject: mockBody.subject,
      text: undefined,
      html: mockBody.html,
    });
    expect(compileTemplate).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('✅ Email Sent Successfully!:');
    expect(logger.info).toHaveBeenCalledWith(mockMailResponse);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      title: 'Email Sent Successfully!',
      data: mockBody,
      mailResponse: mockMailResponse,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should send an email using a template successfully', async () => {
    const mockBody = {
      to: 'test@example.com',
      subject: 'Template Test',
      templateName: 'welcome',
      templateData: { name: 'John' },
    };
    const compiledHtml = '<p>Welcome, John!</p>';
    const mockMailResponse = { messageId: '67890' };
    req.body = mockBody;

    vi.mocked(mailSchemaParseSpy).mockReturnValue(mockBody);
    vi.mocked(compileTemplate).mockReturnValue(compiledHtml);
    vi.mocked(sendMail).mockResolvedValue(mockMailResponse);

    await sendMailHandler(req as Request, res as Response, next);

    expect(mailSchemaParseSpy).toHaveBeenCalledWith(mockBody);
    expect(compileTemplate).toHaveBeenCalledWith('welcome', { name: 'John' });
    expect(sendMail).toHaveBeenCalledWith({
      to: mockBody.to,
      subject: mockBody.subject,
      text: undefined,
      html: compiledHtml,
    });
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(logger.info).toHaveBeenCalledWith('✅ Email Sent Successfully!:');
    expect(jsonMock).toHaveBeenCalledWith({
      title: 'Email Sent Successfully!',
      data: mockBody,
      mailResponse: mockMailResponse,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with a ZodError on invalid request body', async () => {
    const mockError = new ZodError([]);
    req.body = { to: 'invalid' };
    vi.mocked(mailSchemaParseSpy).mockImplementation(() => {
      throw mockError;
    });

    await sendMailHandler(req as Request, res as Response, next);

    expect(mailSchemaParseSpy).toHaveBeenCalledWith(req.body);
    expect(sendMail).not.toHaveBeenCalled();
    expect(compileTemplate).not.toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(mockError);
  });

  it('should call next with an error if sendMail fails', async () => {
    const mockBody = {
      to: 'test@example.com',
      subject: 'Failure Test',
      text: 'This will fail',
    };
    const mockError = new Error('SMTP Error');
    req.body = mockBody;

    vi.mocked(mailSchemaParseSpy).mockReturnValue(mockBody);
    vi.mocked(sendMail).mockRejectedValue(mockError);

    await sendMailHandler(req as Request, res as Response, next);

    expect(sendMail).toHaveBeenCalled();
    expect(compileTemplate).not.toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(mockError);
  });

  it('should call next with an error if compileTemplate fails', async () => {
    const mockBody = {
      to: 'test@example.com',
      subject: 'Template Failure',
      templateName: 'non-existent-template',
    };
    const mockError = new Error('Template not found');
    req.body = mockBody;

    vi.mocked(mailSchemaParseSpy).mockReturnValue(mockBody);
    vi.mocked(compileTemplate).mockImplementation(() => {
      throw mockError;
    });

    await sendMailHandler(req as Request, res as Response, next);

    expect(compileTemplate).toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(mockError);
  });
});
