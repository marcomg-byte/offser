import { describe, it, expect } from 'vitest';
import {
  renderTemplateParamsSchema,
  offersTemplateSchema,
  shipmentTemplateSchema,
  salesTemplateSchema,
} from './template.schema.js';

describe('template.schema.ts', () => {
  describe('renderTemplateParamsSchema', () => {
    it('should validate correct params', () => {
      const data = { templateName: 'valid-template_name123' };
      const result = renderTemplateParamsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should fail validation for invalid templateName', () => {
      const data = { templateName: 'invalid/template@name' };
      const result = renderTemplateParamsSchema.safeParse(data);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'Invalid string: must match pattern /^[a-zA-Z0-9_-]+$/',
      );
    });

    it('should fail if templateName is not a string', () => {
      const data = { templateName: 123 };
      const result = renderTemplateParamsSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('offersTemplateSchema', () => {
    const validData = {
      customerName: 'John Doe',
      offers: [
        { title: 'Offer 1', description: 'Description for offer 1' },
        { title: 'Offer 2', description: 'Description for offer 2' },
      ],
      ctaUrl: 'https://example.com/offers',
    };

    it('should validate correct offers data', () => {
      const result = offersTemplateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail if customerName is missing', () => {
      const data = { ...validData, customerName: undefined as unknown };
      const result = offersTemplateSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should fail if offers array is invalid', () => {
      const data = {
        ...validData,
        offers: [{ title: 'Only title' }], // Missing description
      };
      const result = offersTemplateSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should fail if ctaUrl is not a valid URL', () => {
      const data = { ...validData, ctaUrl: 'not-a-url' };
      const result = offersTemplateSchema.safeParse(data);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Invalid URL');
    });
  });

  describe('shipmentTemplateSchema', () => {
    const validData = {
      customerName: 'Jane Doe',
      orderNumber: 'ORD-12345',
      shippingAddress: '123 Main St, Anytown, USA',
      estimatedDelivery: '25/12/2024',
      items: [
        {
          name: 'Product A',
          quantity: 1,
          image: 'https://example.com/image.png',
        },
        {
          name: 'Product B',
          quantity: 2,
          image: 'https://example.com/image2.png',
        },
      ],
      trackingUrl: 'https://example.com/track/123',
    };

    it('should validate correct shipment data', () => {
      const result = shipmentTemplateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail for incorrectly formatted estimatedDelivery date', () => {
      const data = { ...validData, estimatedDelivery: '2024-12-25' };
      const result = shipmentTemplateSchema.safeParse(data);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'Invalid string: must match pattern /^\\d{2}\\/\\d{2}\\/\\d{4}$/',
      );
    });

    it('should fail if an item quantity is less than 1', () => {
      const data = {
        ...validData,
        items: [
          {
            name: 'Product C',
            quantity: 0,
            image: 'https://example.com/image3.png',
          },
        ],
      };
      const result = shipmentTemplateSchema.safeParse(data);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'Too small: expected number to be >=1',
      );
    });

    it('should fail if trackingUrl is not a valid URL', () => {
      const data = { ...validData, trackingUrl: 'invalid-url' };
      const result = shipmentTemplateSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should fail if a required field is missing', () => {
      const data = { ...validData, orderNumber: undefined as unknown };
      const result = shipmentTemplateSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('salesTemplateSchema', () => {
    const validData = {
      offers: [
        {
          image: 'https://example.com/sneaker1.jpg',
          name: 'Cool Sneaker 1',
          description: 'A very cool sneaker.',
          price: 99.99,
        },
        {
          image: 'https://example.com/sneaker2.jpg',
          name: 'Cool Sneaker 2',
          description: 'Another very cool sneaker.',
          price: 120.0,
        },
      ],
      ctaUrl: 'https://example.com/sale',
    };

    it('should validate correct sales data', () => {
      const result = salesTemplateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail if an offer has a negative price', () => {
      const invalidOffers = [...validData.offers];
      invalidOffers[0] = { ...invalidOffers[0], price: -10 };
      const data = { ...validData, offers: invalidOffers };
      const result = salesTemplateSchema.safeParse(data);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        'Too small: expected number to be >=0',
      );
    });

    it('should fail if an offer image is not a valid URL', () => {
      const invalidOffers = [...validData.offers];
      invalidOffers[0] = { ...invalidOffers[0], image: 'not-a-url' };
      const data = { ...validData, offers: invalidOffers };
      const result = salesTemplateSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should fail if ctaUrl is missing', () => {
      const data = { ...validData, ctaUrl: undefined as unknown };
      const result = salesTemplateSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
