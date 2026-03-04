import { mailRequestSchema } from './mail.schema.js';
import {
  renderTemplateParamsSchema,
  salesTemplateSchema,
  offersTemplateSchema,
  shipmentTemplateSchema,
} from './template.schema.js';
import { dbDeleteSchema, dbInsertSchema, dbReadSchema } from './db.schema.js';
import { dashboardSchema } from './app.schema.js';

export {
  dashboardSchema,
  dbDeleteSchema,
  dbInsertSchema,
  dbReadSchema,
  mailRequestSchema,
  offersTemplateSchema,
  renderTemplateParamsSchema,
  salesTemplateSchema,
  shipmentTemplateSchema,
};
