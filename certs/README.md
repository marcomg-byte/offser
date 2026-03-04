# SSL Certificate Handling

This application supports secure HTTPS and MySQL connections using SSL/TLS certificates. Proper certificate management is essential for production deployments to ensure encrypted communication and data security.

## HTTPS Server Certificates

To enable HTTPS for the Express server:

1. **Generate or Obtain Certificates**  
   - You need a valid SSL certificate (`.pem` or `.crt`) and a private key (`.pem` or `.key`).  
   - For development, you can generate self-signed certificates using OpenSSL:
     ```sh
     openssl req -nodes -new -x509 -keyout key.pem -out cert.pem
     ```
   - For production, use certificates from a trusted Certificate Authority (CA).

2. **Place Certificates**  
   - Place your certificate and key files in a secure directory (e.g., [certs/server](http://_vscodecontentref_/0)).
   - Do **not** commit private keys or certificates to version control.

3. **Configure Environment Variables**  
   - In your [.env](http://_vscodecontentref_/1) file, set:
     ```env
     HTTPS_ENABLED=true
     HTTPS_KEY_PATH=certs/server/key.pem
     HTTPS_CERT_PATH=certs/server/cert.pem
     ```
   - The application will use these paths to load the certificate and key.

4. **Startup Behavior**  
   - On startup, the app checks for the existence of the certificate and key files.
   - If either file is missing, a [CertificateNotFoundError](http://_vscodecontentref_/2) is thrown and the server will not start.

## MySQL SSL Certificates

To enable SSL for MySQL connections:

1. **Obtain Database SSL Files**  
   - You need the CA certificate, client certificate, and client key from your database provider or administrator.

2. **Place Certificates**  
   - Place these files in a secure directory (e.g., [certs/db](http://_vscodecontentref_/3)).
   - Example:
     - [ca.pem](http://_vscodecontentref_/4) (CA certificate)
     - `client-cert.pem` (Client certificate)
     - `client-key.pem` (Client key)

3. **Configure Environment Variables**  
   - In your [.env](http://_vscodecontentref_/5) file, set:
     ```env
     DB_SSL_ENABLED=true
     DB_SSL_CA=certs/db/ca.pem
     DB_SSL_CERT=certs/db/client-cert.pem
     DB_SSL_KEY=certs/db/client-key.pem
     ```
   - Optionally, set [DB_SSL_REJECT_UNAUTHORIZED=true](http://_vscodecontentref_/6) to enforce strict certificate validation.

4. **Startup Behavior**  
   - If [DB_SSL_ENABLED=true](http://_vscodecontentref_/7), the app requires all three files.
   - If any file is missing, a [DBSSLConfigError](http://_vscodecontentref_/8) is thrown and the server will not start.

## Security Best Practices

- **Never commit certificate or key files to version control.**
- Restrict file permissions so only the application process can read the certificates.
- Rotate certificates regularly and update the paths in your [.env](http://_vscodecontentref_/9) file as needed.
- For production, always use certificates from a trusted CA.

## Troubleshooting

- If the server fails to start with a certificate error, check that all paths in [.env](http://_vscodecontentref_/10) are correct and files are readable.
- For local development, self-signed certificates are acceptable, but browsers and MySQL clients may show warnings.

---

For more details, see:
- [CertificateNotFoundError](http://_vscodecontentref_/11)
- [DBSSLConfigError](http://_vscodecontentref_/12)
- HTTPS server creation logic
- MySQL SSL pool creation