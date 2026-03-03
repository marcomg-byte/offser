import { verifyConnection, sendMail } from './mail.service.js';
import type { SendMailOptions } from './mail.service.js';
import {
  compileTemplate,
  preloadTemplates,
  clearTemplateCache,
} from './template.service.js';
import { pool, verifyConnection as verifyDBConnection } from './db.service.js';

export {
  verifyConnection,
  verifyDBConnection,
  sendMail,
  compileTemplate,
  preloadTemplates,
  clearTemplateCache,
  pool,
};
export type { SendMailOptions };
