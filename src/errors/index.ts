import {
  TemplateCompileError,
  TemplatePreloadError,
  UnknownTemplateError,
} from './template.error.js';
import {
  MailDeliveryError,
  ConnectionVerificationError,
  TransporterCreationError,
} from './mail.error.js';
import { CertificateNotFoundError } from './server.error.js';
import {
  DBConnectionVerificationError,
  DBPoolCreationError,
  DBQueryExecutionError,
} from './db.error.js';

export {
  CertificateNotFoundError,
  DBConnectionVerificationError,
  DBPoolCreationError,
  DBQueryExecutionError,
  MailDeliveryError,
  ConnectionVerificationError,
  TransporterCreationError,
  TemplateCompileError,
  TemplatePreloadError,
  UnknownTemplateError,
};
