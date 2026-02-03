/**
 * Error thrown when the HTTPS server cannot be created due to missing certificate or key files.
 * Contains paths to the missing files and the original error, if available.
 */
class CertificateNotFoundError extends Error {
  /**
   * The original error thrown when certificate or key is not found.
   */
  public originalError?: unknown;

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
   * @param originalError The original error thrown, if any.
   */
  constructor(certPath: string, keyPath: string, originalError?: unknown) {
    super('Certificate or Key Not Found When Creating HTTPS Server');
    this.name = 'CertificateNotFoundError';
    this.certPath = certPath;
    this.keyPath = keyPath;
    this.originalError = originalError;
  }
}

export { CertificateNotFoundError };
