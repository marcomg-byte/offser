import { verifyConnection, sendMail } from './mail.service.js';
import type { SendMailOptions } from './mail.service.js';
import { compileTemplate } from './template.service.js';

export { verifyConnection, sendMail, compileTemplate };
export type { SendMailOptions };
