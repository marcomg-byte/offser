import { verifyConnection, sendMail } from './mail.service.js';
import type { SendMailOptions } from './mail.service.js';
import {
  compileTemplate,
  preloadTemplates,
  clearTemplateCache,
} from './template.service.js';

export {
  verifyConnection,
  sendMail,
  compileTemplate,
  preloadTemplates,
  clearTemplateCache,
};
export type { SendMailOptions };
