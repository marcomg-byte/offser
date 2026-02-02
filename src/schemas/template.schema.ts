import { z as zod } from 'zod';

/**
 * Zod schema for validating template rendering parameters.
 *
 * Ensures that the request contains a valid template name for rendering.
 *
 * Fields:
 * - templateName: Required string, must match /^[a-zA-Z0-9_-]+$/
 */
const renderTemplateParamsSchema = zod.object({
  /** The name of the template to render (alphanumeric, dash, underscore). */
  templateName: zod.string().regex(/^[a-zA-Z0-9_-]+$/),
});

/**
 * Zod schema for validating data used in the offers (offers) email template.
 *
 * Ensures that the request contains an array of offer objects (each with a title and description)
 * and a valid call-to-action URL.
 *
 * Fields:
 * - offers: Array of objects with 'title' (string) and 'description' (string)
 * - ctaUrl: Required URL string for the call-to-action
 */
const offersTemplateSchema = zod.object({
  /** The recipient's name. */
  customerName: zod.string(),
  /** Array of offer objects, each with a title and description. */
  offers: zod.array(
    zod.object({
      /** The title of the offer. */
      title: zod.string(),
      /** The description of the offer. */
      description: zod.string(),
    }),
  ),
  /** The call-to-action URL for the offers email. */
  ctaUrl: zod.url(),
});

/**
 * Zod schema for validating data used in the order (shipment confirmation) email template.
 *
 * Ensures that the request contains all required order and shipping details, including a properly formatted delivery date and tracking URL.
 *
 * Fields:
 * - customerName: Required string, the recipient's name
 * - orderNumber: Required string, the order identifier
 * - shippingAddress: Required string, the delivery address
 * - estimatedDelivery: Required date, formatted as DD/MM/YYYY (es-MX)
 * - trackingUrl: Required URL string for the tracking link
 */
const shipmentTemplateSchema = zod.object({
  /** The recipient's name. */
  customerName: zod.string(),
  /** The order identifier. */
  orderNumber: zod.string(),
  /** The delivery address. */
  shippingAddress: zod.string(),
  /** The estimated delivery date, formatted as DD/MM/YYYY (es-MX). */
  estimatedDelivery: zod.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
  items: zod.array(
    zod.object({
      /** The name of the item. */
      name: zod.string(),
      /** The quantity of the item. */
      quantity: zod.number().min(1),
      /** The image URL of the item. */
      image: zod.url(),
    }),
  ),
  /** The tracking URL for the shipment. */
  trackingUrl: zod.url(),
});

/**
 * Zod schema for validating data used in the sales (sneaker offers) email template.
 *
 * Ensures that the request contains an array of sneaker offer objects (each with image, name, description, and price)
 * and a valid call-to-action URL.
 *
 * Fields:
 * - offers: Array of objects with 'image' (URL), 'name' (string), 'description' (string), 'price' (number >= 0)
 * - ctaUrl: Required URL string for the call-to-action
 */
const salesTemplateSchema = zod.object({
  /** Array of sneaker offer objects, each with image, name, description, and price. */
  offers: zod.array(
    zod.object({
      /** The image URL of the sneaker. */
      image: zod.url(),
      /** The name of the sneaker. */
      name: zod.string(),
      /** The description of the sneaker. */
      description: zod.string(),
      /** The price of the sneaker (must be >= 0). */
      price: zod.number().min(0),
    }),
  ),
  /** The call-to-action URL for the sales email. */
  ctaUrl: zod.url(),
});

export {
  renderTemplateParamsSchema,
  offersTemplateSchema,
  shipmentTemplateSchema,
  salesTemplateSchema,
};
