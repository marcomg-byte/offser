import type { ErrorInfo } from './error.js';

/**
 * Information about a CertificateNotFoundError, including paths to the missing certificate and key files.
 */
interface CertificateNotFoundErrorInfo extends ErrorInfo {
  /** Path to the certificate file. */
  certPath: string;
  /** Path to the key file. */
  keyPath: string;
}

export type { CertificateNotFoundErrorInfo };
