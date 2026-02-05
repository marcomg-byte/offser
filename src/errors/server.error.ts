/**
 * Error thrown when the HTTPS server cannot be created due to missing certificate or key files.
 *
 * Properties:
 * - certPath: Path to the certificate file.
 * - keyPath: Path to the key file.
 */
class CertificateNotFoundError extends Error {
  /**
   * Path to the certificate file.
   */
  public certPath: string;
  /**
   * Path to the key file.
   */
  public keyPath: string;
  /**
   * Creates a new CertificateNotFoundError instance.
   * @param certPath Path to the certificate file.
   * @param keyPath Path to the key file.
   * @param cause The original error thrown, if any.
   */
  constructor(certPath: string, keyPath: string, cause?: unknown) {
    super('Certificate or Key Not Found When Creating HTTPS Server', { cause });
    this.name = 'CertificateNotFoundError';
    this.certPath = certPath;
    this.keyPath = keyPath;
  }
}

export { CertificateNotFoundError };
