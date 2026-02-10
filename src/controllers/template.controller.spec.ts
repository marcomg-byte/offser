import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { templateHandler } from './template.controller.js';
import { compileTemplate } from '../services/index.js';
import {
  renderTemplateParamsSchema,
  offersTemplateSchema,
  salesTemplateSchema,
  shipmentTemplateSchema,
} from '../schemas/index.js';
import { logger } from '../utils/index.js';

vi.mock('../schemas/index.js');
vi.mock('../services/index.js');
vi.mock('../utils/index.js');

describe('templateHandler', () => {
  let next: NextFunction;
  let req: Partial<Request>;
  let res: Partial<Response>;

  const mockTemplateBody = {
    offers: [
      {
        image: 'http://example.com/image.jpg',
        name: 'John Doe',
        price: 100,
        description: 'A great sneaker',
      },
    ],
    ctaUrl: 'https://example.com/offers',
  };
  const mockTemplateParams = { templateName: 'sales' };

  let paramsTemplateSpy: Mock;
  let salesTemplateSpy: Mock;

  beforeEach(() => {
    paramsTemplateSpy = vi.spyOn(renderTemplateParamsSchema, 'parse');
    salesTemplateSpy = vi
      .spyOn(salesTemplateSchema, 'parse')
      .mockReturnValue(mockTemplateBody);

    vi.mocked(paramsTemplateSpy).mockReturnValue(mockTemplateParams);
    vi.mocked(salesTemplateSpy).mockReturnValue(mockTemplateBody);

    req = {
      params: {},
      body: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    next = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render a "sales" template and return status 200', () => {
    req.params = mockTemplateParams;
    req.body = mockTemplateBody;
    const expectedHtml = '<h1>Sales</h1><p>Hello John Doe</p>';

    vi.mocked(compileTemplate).mockReturnValue(expectedHtml);

    templateHandler(req as Request, res as Response, next);

    expect(salesTemplateSpy).toHaveBeenCalledWith(req.body);
    expect(compileTemplate).toHaveBeenCalledWith('sales', req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(expectedHtml);
    expect(logger.info).toHaveBeenCalledWith(
      '✅ Template "sales" rendered successfully.',
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should render a "offers" template and return status 200', () => {
    const offersTemplateParams = { templateName: 'offers' };
    const offersTemplateBody = {
      customerName: 'Jane Smith',
      offers: [
        {
          title: 'Summer Sale',
          description: 'Up to 50% off on selected items',
        },
      ],
      ctaUrl: 'https://example.com/summer-sale',
    };
    const expectedHtml = '<h1>Offers</h1><p>Summer Sale</p>';

    const offersTemplateSpy = vi
      .spyOn(offersTemplateSchema, 'parse')
      .mockReturnValue(offersTemplateBody);

    req.params = offersTemplateParams;
    req.body = offersTemplateBody;

    vi.mocked(paramsTemplateSpy).mockReturnValue(offersTemplateParams);
    vi.mocked(offersTemplateSpy).mockReturnValue(offersTemplateBody);
    vi.mocked(compileTemplate).mockReturnValue(expectedHtml);

    templateHandler(req as Request, res as Response, next);

    expect(offersTemplateSpy).toHaveBeenCalledWith(req.body);
    expect(compileTemplate).toHaveBeenCalledWith('offers', req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(expectedHtml);
    expect(logger.info).toHaveBeenCalledWith(
      '✅ Template "offers" rendered successfully.',
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should render a "shipment" template and return status 200', () => {
    const shipmentTemplateParams = { templateName: 'shipment' };
    const shipmentTemplateBody = {
      customerName: 'Jane Smith',
      orderNumber: 'ORD123456',
      shippingAddress: '123 Main St, City, Country',
      estimatedDelivery: '25/12/2024',
      items: [
        {
          name: 'Sneakers',
          quantity: 2,
          image: 'http://example.com/sneakers.jpg',
        },
      ],
      trackingUrl: 'https://example.com/shipment-tracking',
    };
    const expectedHtml = '<h1>Shipment</h1><p>Order ORD123456 </p>';

    const shipmentTemplateSpy = vi
      .spyOn(shipmentTemplateSchema, 'parse')
      .mockReturnValue(shipmentTemplateBody);

    req.params = shipmentTemplateParams;
    req.body = shipmentTemplateBody;

    vi.mocked(paramsTemplateSpy).mockReturnValue(shipmentTemplateParams);
    vi.mocked(shipmentTemplateSpy).mockReturnValue(shipmentTemplateBody);
    vi.mocked(compileTemplate).mockReturnValue(expectedHtml);

    templateHandler(req as Request, res as Response, next);

    expect(shipmentTemplateSpy).toHaveBeenCalledWith(req.body);
    expect(compileTemplate).toHaveBeenCalledWith('shipment', req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(expectedHtml);
    expect(logger.info).toHaveBeenCalledWith(
      '✅ Template "shipment" rendered successfully.',
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with a ZodError if params are invalid', () => {
    const error = new ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        path: ['templateName'],
        message: 'Required',
      },
    ]);

    vi.mocked(paramsTemplateSpy).mockImplementation(() => {
      throw error;
    });

    req.params = {};
    req.body = mockTemplateBody;

    templateHandler(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(compileTemplate).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should call next with a ZodError if body is invalid for the given template schema', () => {
    const error = new ZodError([
      {
        code: 'invalid_type',
        expected: 'array',
        path: ['offers'],
        message: 'Required',
      },
    ]);
    vi.mocked(salesTemplateSpy).mockImplementation(() => {
      throw error;
    });

    req.params = mockTemplateParams;
    req.body = { wrong: 'body' };

    templateHandler(req as Request, res as Response, next);

    expect(salesTemplateSpy).toHaveBeenCalledWith(req.body);
    expect(next).toHaveBeenCalledWith(error);
    expect(compileTemplate).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should handle templates without specific schema', () => {
    const unknownTemplateParams = { templateName: 'unknown' };
    const unknownTemplateBody = { message: 'This is a test' };
    const expectedHtml = `<h1>${unknownTemplateBody.message}</h1>`;

    vi.mocked(paramsTemplateSpy).mockReturnValue(unknownTemplateParams);
    vi.mocked(compileTemplate).mockReturnValue(expectedHtml);

    req.params = unknownTemplateParams;
    req.body = unknownTemplateBody;

    templateHandler(req as Request, res as Response, next);

    expect(paramsTemplateSpy).toHaveBeenCalledWith(unknownTemplateParams);
    expect(salesTemplateSpy).not.toHaveBeenCalled();
    expect(compileTemplate).toHaveBeenCalledWith(
      'unknown',
      unknownTemplateBody,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(expectedHtml);
    expect(next).not.toHaveBeenCalled();
  });

  it('should log a truncated html string if it is too long', () => {
    req.params = mockTemplateParams;
    req.body = mockTemplateBody;
    const longHtml = 'a'.repeat(400);
    const truncatedHtml = 'a'.repeat(300) + '... [truncated]';

    vi.mocked(compileTemplate).mockReturnValue(longHtml);

    templateHandler(req as Request, res as Response, next);

    expect(logger.info).toHaveBeenCalledWith(
      '✅ Template "sales" rendered successfully.',
    );
    expect(logger.info).toHaveBeenCalledWith(truncatedHtml);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(longHtml);
  });

  it('should call next with an error if compile template fails', () => {
    const compileError = new Error('Failed to compile template');
    vi.mocked(compileTemplate).mockImplementation(() => {
      throw compileError;
    });

    req.params = mockTemplateParams;
    req.body = mockTemplateBody;

    templateHandler(req as Request, res as Response, next);

    expect(compileTemplate).toHaveBeenCalledWith('sales', req.body);
    expect(next).toHaveBeenCalledWith(compileError);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
