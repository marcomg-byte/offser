import type { ErrorInfo } from './error.js';
import type {
  ConnectionVerificationErrorInfo,
  MailDeliveryErrorInfo,
  TransporterCreationErrorInfo,
} from './mail.error.js';
import type { CertificateNotFoundErrorInfo } from './server.error.js';
import type {
  TemplateCompileErrorInfo,
  UnknownTemplateErrorInfo,
} from './template.error.js';
import type { ZodErrorInfo } from './zod.error.js';

export type {
  CertificateNotFoundErrorInfo,
  ConnectionVerificationErrorInfo,
  ErrorInfo,
  MailDeliveryErrorInfo,
  TransporterCreationErrorInfo,
  TemplateCompileErrorInfo,
  UnknownTemplateErrorInfo,
  ZodErrorInfo,
};
