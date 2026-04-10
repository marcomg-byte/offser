# Offser

A TypeScript-based Express.js server for sending emails via SMTP, rendering templates, managing database records with MySQL, robust validation, error handling, modular architecture, and advanced logging.

## Features

- Express.js API with modular routing
- TypeScript for type safety
- Zod schema validation for all request payloads
- Nodemailer integration for SMTP email delivery
- Handlebars template rendering with production caching
- **MySQL database integration with connection pooling**
- **SSL/TLS support for secure database and SMTP connections**
- Centralized error handling middleware
- Environment variable configuration with validation
- Rate limiting for mail and render endpoints
- Utility functions for string formatting and error extraction
- **Advanced logging with [Pino](https://github.com/pinojs/pino) and multistream:**
  - Pretty terminal output with colorization
  - Structured JSON logs per level (error, info, warn, debug)
  - Automatic log file creation in `logs/` directory
  - Custom timestamp format (MM-DD-YYYY HH:mm:ss)
- Comprehensive error logging and debugging
- **HTTPS server support with SSL/TLS certificates**
- **Graceful shutdown handling with signal interception**
- **Matrix-themed UI components (dashboard and 404 page)**

## Legal Disclaimer

This tool is intended **exclusively for authorized penetration testing, red team operations, and security research** on systems you own or have explicit written permission to test.

Unauthorized use of this tool against systems without prior consent is illegal and may violate computer crime laws including but not limited to the Computer Fraud and Abuse Act (CFAA), the UK Computer Misuse Act, and equivalent legislation in your jurisdiction.

The author(s) assume **no liability** for any misuse, damage, or illegal activity conducted with this tool. By using this software, you agree that you are solely responsible for compliance with all applicable local, state, national, and international laws.

**Use responsibly and ethically.**

## Project Structure

```
.
├── assets/
│   ├── facebook.ico
│   └── matrix.ico
├── backup/
│   └── logs/                # (if present at runtime)
├── certs/
│   ├── db/
│   │   ├── ca-cert.pem
│   │   ├── client-cert.pem
│   │   └── client-key.pem
│   ├── server/
│   │   ├── cert.pem
│   │   └── key.pem
│   └── README.md
├── db/
│   ├── offser_passwords.sql
│   ├── offser_routines.sql
│   └── README.md
├── src/
│   ├── __mocks__/
│   │   ├── index.ts
│   │   ├── nodemailer.ts
│   │   └── server.ts
│   ├── config/
│   │   ├── __mocks__/
│   │   │   └── env.ts
│   │   ├── env.spec.ts
│   │   └── env.ts
│   ├── controllers/
│   │   ├── app.controller.ts
│   │   ├── db.controller.ts
│   │   ├── index.ts
│   │   ├── mail.controller.spec.ts
│   │   ├── mail.controller.ts
│   │   ├── template.controller.spec.ts
│   │   └── template.controller.ts
│   ├── errors/
│   │   ├── db.error.ts
│   │   ├── index.ts
│   │   ├── mail.error.ts
│   │   ├── server.error.ts
│   │   ├── template.error.ts
│   │   └── types/
│   │       ├── error.ts
│   │       └── index.ts
│   ├── index.ts
│   ├── middleware/
│   │   ├── error.middleware.spec.ts
│   │   ├── error.middleware.ts
│   │   ├── index.ts
│   │   ├── not-found.middleware.spec.ts
│   │   └── not-found.middleware.ts
│   ├── routes/
│   │   ├── app.routes.ts
│   │   ├── db.routes.ts
│   │   ├── health.routes.spec.ts
│   │   ├── health.routes.ts
│   │   ├── index.ts
│   │   ├── mail.routes.ts
│   │   └── template.routes.ts
│   ├── schemas/
│   │   ├── __mocks__/
│   │   │   └── index.ts
│   │   ├── app.schema.ts
│   │   ├── db.schema.ts
│   │   ├── index.ts
│   │   ├── mail.schema.spec.ts
│   │   ├── mail.schema.ts
│   │   ├── template.schema.spec.ts
│   │   └── template.schema.ts
│   ├── services/
│   │   ├── __mocks__/
│   │   │   └── index.ts
│   │   ├── db.service.spec.ts
│   │   ├── db.service.ts
│   │   ├── index.ts
│   │   ├── mail.service.spec.ts
│   │   ├── mail.service.ts
│   │   ├── template.service.spec.ts
│   │   └── template.service.ts
│   ├── templates/
│   │   ├── dashboard.hbs
│   │   ├── facebook-login.hbs
│   │   ├── not-found.hbs
│   │   ├── offers.hbs
│   │   ├── sales.hbs
│   │   └── shipment.hbs
│   └── utils/
│       ├── __mocks__/
│       │   └── (if present)
│       ├── error.util.spec.ts
│       ├── error.util.ts
│       ├── format.util.spec.ts
│       ├── format.util.ts
│       ├── index.ts
│       ├── logger.util.spec.ts
│       ├── logger.util.ts
│       ├── shutdown.util.spec.ts
│       └── shutdown.util.ts
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── container.yml
│       ├── publish.yml
│       └── release.yml
├── .dockerignore
├── .env
├── .env.container
├── .env.example
├── .gitignore
├── .prettierrc
├── .nvmrc
├── Dockerfile
├── LICENSE
├── README.md
├── esbuild.cli.mjs
├── esbuild.container.mjs
├── eslint.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.test.json
├── vitest.config.ts
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- SMTP server credentials (e.g., Gmail with App Password, SendGrid, etc.)
- **MySQL database** (v8.0+ recommended)
- **(Optional) SSL/TLS certificates for HTTPS server and secure MySQL connections**

## Docker Usage

You can build and run Offser in a Docker container for easy deployment.

### Build the Docker Image

From the project root, run:

```sh
docker build -t offser .
```

### Run the Container

```sh
docker run --env-file .env -p 8080:8080 -v $(pwd)/certs:/app/certs offser
```

- `--env-file .env` loads environment variables (see `.env.example` for required values)
- `-p 8080:8080` maps the container port to your host
- `-v $(pwd)/certs:/app/certs` mounts your local `certs` directory for SSL/DB certificates

#### Database Host for Docker

If your MySQL database is running on your host machine (not in Docker), set in your `.env`:

```env
DB_HOST=host.docker.internal
```

This allows the container to connect to your host's MySQL instance. If your database is in another container, use the Docker network service name.

#### .dockerignore

The build uses a multi-stage Dockerfile and a `.dockerignore` file to exclude unnecessary files (e.g., `node_modules`, `logs`, `dist`, local `.env`).

For more details, see the Dockerfile and `.dockerignore` in the project root.

### Installation

1. **Clone the repository**
    ```sh
    git clone https://github.com/marcomg-byte/offser.git
    cd offser
    ```

2. **Install dependencies**
    ```sh
    npm install
    ```

3. **Configure environment variables**

    Create a `.env` file based on `.env.example`:
    ```env
    # Server Configuration
    NODE_ENV=development
    PORT=8080

    # SMTP Configuration
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_SECURE=false
    SMTP_USER=your-email@gmail.com
    SMTP_PASS=your-app-password
    MAIL_FROM=your-email@gmail.com

    # Rate Limiting
    MAIL_SERVICE_RATE_LIMIT=10
    MAIL_SERVICE_RATE_WINDOW=15
    RENDER_SERVICE_RATE_LIMIT=20
    RENDER_SERVICE_RATE_WINDOW=10

    # Database Configuration
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=your_db_user
    DB_PASS=your_db_password
    DB_NAME=your_database_name
    DB_CONNECTION_LIMIT=10
    DB_QUEUE_LIMIT=0
    DB_WAIT_FOR_CONNECTIONS=true
    DB_KEEP_ALIVE=true
    DB_KEEP_ALIVE_INITIAL_DELAY=0

    # Database SSL (Optional)
    DB_SSL_ENABLED=false
    # DB_SSL_CA=certs/db/ca.pem
    # DB_SSL_CERT=certs/db/client-cert.pem
    # DB_SSL_KEY=certs/db/client-key.pem
    # DB_SSL_REJECT_UNAUTHORIZED=true

    # HTTPS Configuration (Optional)
    HTTPS_ENABLED=false
    # HTTPS_KEY_PATH=certs/server/key.pem
    # HTTPS_CERT_PATH=certs/server/cert.pem
    ```

4. **Set up the database**

    Run the SQL scripts from the `db/` directory:
    ```sh
    # Create the passwords table
    mysql -u your_db_user -p your_database_name < db/offser_passwords.sql
    
    # Create stored procedures
    mysql -u your_db_user -p your_database_name < db/offser_routines.sql
    ```

    Or manually execute the scripts in your MySQL client. See [db/README.md](db/README.md) for detailed setup instructions.

5. **Build the project**
    ```sh
    npm run build
    ```

6. **Start the server**
    ```sh
    npm start
    ```

    The server will run on the port specified in `.env` (default: 3000).

### Development

For development with automatic reloads and template watching:

```sh
npm run dev
```

This runs both the TypeScript compiler and template watcher simultaneously using `concurrently`.

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript and copy templates to dist
- `npm run build:templates` - Copy Handlebars templates to dist directory
- `npm run dev` - Start development server with hot reload (Nodemon + tsx)
- `npm start` - Run the production build
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm test` - Run unit and integration tests with Vitest (watch mode)
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Generate test coverage report
- `npm run test:ui` - Open Vitest UI for interactive testing
- `npm run clean` - Remove dist folder
- `npm run clean:logs` - Remove logs folder
- `npm run backup:logs` - Archive log files to backup/logs directory
- `npm run watch:templates` - Watch templates directory for changes
- `npm run prepare` - Clean and build (runs before publishing)

## Logging

This project uses [Pino](https://github.com/pinojs/pino) with multistream for advanced logging:

- **Terminal output:** Pretty-printed, colored logs with [pino-pretty](https://github.com/pinojs/pino-pretty) for development.
- **Log files:** Structured JSON logs per level in the `logs/` directory:
  - `error.log` - Error-level messages
  - `info.log` - Info-level messages
  - `warn.log` - Warning-level messages
  - `debug.log` - Debug-level messages
- **Automatic log directory creation:** No manual setup required.
- **Custom timestamp format:** `MM-DD-YYYY HH:mm:ss` for easy readability.
- **Uppercase log levels:** Consistent formatting across all log outputs.
- **Log archiving:** Use `npm run backup:logs` to archive logs to `backup/logs/` before cleaning.

All log files are automatically created in the `logs/` directory. The logger is configured in [`logger.util.ts`](src/utils/logger.util.ts).

## Architecture

### Modular Structure

- **Controllers** - Handle HTTP requests and responses, coordinate between services
- **Services** - Business logic (email sending, template rendering, database operations)
- **Routes** - Define API endpoints, apply rate limiting, and middleware
- **Schemas** - Zod-based data validation rules for requests and responses
- **Middleware** - Cross-cutting concerns (error handling, 404 pages, request logging)
- **Utils** - Reusable utility functions (logging, formatting, error extraction, shutdown)
- **Config** - Application configuration and environment variable validation
- **Templates** - Handlebars templates for dynamic HTML emails and pages
- **Errors** - Custom error classes for different failure scenarios with context

### Error Handling

Centralized error handling middleware in [`error.middleware.ts`](src/middleware/error.middleware.ts) catches and processes:

- **Zod Validation Errors** → 400 Bad Request with prettified validation details
- **Database Errors** (connection, query, SSL config, transporter creation) → 500 Internal Server Error with context
- **Mail/Template Errors** → 500 Internal Server Error with detailed context
- **SSL/Certificate Errors** (missing files, invalid paths) → 500 Internal Server Error with file information
- **Unknown Errors** → 500 Internal Server Error with fallback message

All errors are logged using the Pino logger with:
- Complete stack traces
- Error context (query parameters, request body excerpts)
- Custom error properties (cause, transporter info, template data)
- Timestamps and log levels

See [`extractErrorInfo`](src/utils/error.util.ts) for error normalization logic.

### Database Architecture

The database layer uses MySQL 2 with connection pooling:

- **Connection Pooling**: Configurable MySQL connection pool for efficient resource usage
- **SSL/TLS Support**: Optional encrypted database connections with certificate validation
- **Stored Procedures**: All database operations use MySQL stored procedures:
  - `INSERT_PASSWORD(mail, password)` - Insert new password record
  - `READ_PASSWORDS(upperLimit, lowerLimit)` - Read password records with range
  - `DELETE_ENTRY(lowerLimit, upperLimit)` - Delete password records by ID range
- **Transaction Support**: Automatic transaction handling with BEGIN, COMMIT, and ROLLBACK on errors
- **Connection Verification**: Startup verification ensures database connectivity before accepting requests
- **Error Handling**: Database errors are wrapped in custom error classes with query context

Configuration is managed in [`db.service.ts`](src/services/db.service.ts). See [db/README.md](db/README.md) and [certs/README.md](certs/README.md) for setup details.

### Template System

Handlebars templates with production caching:

- **Development Mode**: Templates are reloaded on every request for immediate feedback
- **Production Mode**: Templates are preloaded and cached in memory for performance
- **Custom Helpers**: `toCSV` helper converts password records to CSV format for export
- **Template Compilation**: Handlebars compiles templates with data injection
- **Error Handling**: Template compilation errors include template name and data context

See [`template.service.ts`](src/services/template.service.ts) for implementation.

## API Endpoints

### Health Check

- **Endpoint**: `GET /health`
- **Description**: Check server operational status, uptime, and current timestamp

**Success Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-02-05T09:07:03.000Z",
  "localDate": "02-05-2024 09:07:03",
  "uptime": 120.47
}
```

### Database Operations

#### Insert Data

- **Endpoint**: `POST /records/insert`
- **Description**: Insert a new password record into the database
- **Rate Limiting**: No rate limit

**Request Body:**
```json
{
  "mail": "user@example.com",
  "password": "securePassword123"
}
```

**Validation:**
- `mail`: Must be a valid email address
- `password`: Must be a non-empty string

**Success Response (200):**
```json
{
  "title": "Data Inserted Successfully!",
  "data": {
    "mail": "user@example.com",
    "password": "securePassword123"
  }
}
```

#### Read Data

- **Endpoint**: `GET /records/read`
- **Description**: Retrieve password records within a specified ID range
- **Rate Limiting**: No rate limit

**Request Body:**
```json
{
  "lowerLimit": 1,
  "upperLimit": 10
}
```

**Validation:**
- `lowerLimit`: Optional positive integer >= 1
- `upperLimit`: Required positive integer >= 1

**Success Response (200):**
```json
{
  "title": "Data Read Successfully!",
  "data": [
    {
      "ID": 1,
      "MAIL": "user@example.com",
      "PASSWORD": "securePassword123"
    }
  ]
}
```

#### Delete Data

- **Endpoint**: `DELETE /records/delete`
- **Description**: Delete password records by ID or ID range
- **Rate Limiting**: No rate limit

**Request Body:**
```json
{
  "lowerLimit": 5,
  "upperLimit": 10
}
```

**Validation:**
- `lowerLimit`: Required positive integer >= 1
- `upperLimit`: Optional positive integer >= 1

**Success Response (200):**
```json
{
  "title": "Data Deleted Successfully!",
  "lowerLimit": 5,
  "upperLimit": 10
}
```

#### Database Health Check

- **Endpoint**: `GET /records/health`
- **Description**: Verify database connectivity and return connection status
- **Rate Limiting**: No rate limit

**Success Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-02-05T09:07:03.000Z",
  "localDate": "02-05-2024 09:07:03",
  "uptime": 120.47
}
```

**Error Response (503):**
```json
{
  "status": "ERROR",
  "timestamp": "2024-02-05T09:07:03.000Z",
  "localDate": "02-05-2024 09:07:03",
  "uptime": 120.47
}
```

### Application Routes

#### Render Dashboard

- **Endpoint**: `GET /app/dashboard?lowerLimit=1&upperLimit=100`
- **Description**: Render a Matrix-themed dashboard displaying password records with CSV export functionality
- **Rate Limiting**: Configurable via `RENDER_SERVICE_RATE_LIMIT` and `RENDER_SERVICE_RATE_WINDOW`

**Query Parameters:**
- `lowerLimit` (optional, number) - Starting ID for records
- `upperLimit` (required, number) - Ending ID for records

**Success Response (200):**
- Returns rendered HTML page with:
  - Matrix-style green-on-black theme with falling code animation
  - Data grid displaying ID, email, and password for each record
  - CSV export button (appears only if data is present)
  - Responsive design for mobile devices
  - Empty state message when no data is available

**Features:**
- Client-side CSV export using the `toCSV` Handlebars helper
- Automatic download of `password_records.csv` file
- Matrix-themed UI with glow effects and animations

### Send Email

- **Endpoint**: `POST /mail/send`
- **Description**: Send an email through the configured SMTP server
- **Rate Limiting**: Configurable via `MAIL_SERVICE_RATE_LIMIT` and `MAIL_SERVICE_RATE_WINDOW`

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "text": "Plain text content",
  "html": "<p>HTML content</p>",
  "templateName": "offers",
  "templateData": {
    "customerName": "John",
    "offers": [
      { "title": "Discount", "description": "10% off" }
    ],
    "ctaUrl": "https://example.com/offer"
  }
}
```

**Request Fields:**
- `to` (required, string) - Recipient email address (valid email format)
- `subject` (required, string) - Email subject line (min 1 character)
- `text` (optional, string) - Plain text email body
- `html` (optional, string) - HTML email body
- `templateName` (optional, string) - Name of Handlebars template to use (without .hbs extension)
- `templateData` (optional, object) - Data object for template variables

**Success Response (200):**
```json
{
  "title": "Email Sent Successfully!",
  "data": {
    "to": "recipient@example.com",
    "subject": "Email Subject",
    "templateName": "offers"
  },
  "mailResponse": {
    "messageId": "<abc123@gmail.com>",
    "accepted": ["recipient@example.com"],
    "response": "250 Message accepted"
  }
}
```

**Validation Error Response (400):**
```json
{
  "title": "Request Validation Error",
  "error": "[Expected string at 'to', Expected string at 'subject']"
}
```

**Server Error Response (500):**
```json
{
  "title": "Mail Service Error",
  "name": "MailDeliveryError",
  "message": "Failed to send email to recipient@example.com",
  "stack": "...",
  "cause": {
    "code": "EAUTH",
    "message": "Invalid login credentials"
  }
}
```

### Render Template

- **Endpoint**: `GET /render/:templateName`
- **Description**: Render a Handlebars template with provided data
- **Rate Limiting**: Configurable via `RENDER_SERVICE_RATE_LIMIT` and `RENDER_SERVICE_RATE_WINDOW`

**Request Example:**
```http
GET /render/offers
Content-Type: application/json

{
  "customerName": "John",
  "offers": [
    { "title": "10% Discount", "description": "On all items" }
  ],
  "ctaUrl": "https://example.com/offer"
}
```

**Available Templates:**
- `sales` - Sales email with product offers (requires: offers[], ctaUrl)
- `offers` - Promotional offers email (requires: customerName, offers[], ctaUrl)
- `shipment` - Order shipment confirmation (requires: customerName, orderNumber, shippingAddress, estimatedDelivery, items[], trackingUrl)
- `dashboard` - Password records dashboard with Matrix theme (requires: data[])
- `not-found` - 404 error page with Matrix theme (no data required)

**Success Response (200):**
- Returns rendered HTML string

**Validation Error Response (400):**
```json
{
  "title": "Request Validation Error",
  "error": "[Expected string at 'customerName']"
}
```

**Template Not Found (500):**
```json
{
  "title": "Template Compilation Error",
  "name": "TemplateCompileError",
  "message": "Template 'invalid-template' not found",
  "stack": "..."
}
```

## Key Utilities

- [`capitalizeWord(word)`](src/utils/format.util.ts) - Capitalize first letter of a word, lowercase the rest
- [`capitalizeString(value)`](src/utils/format.util.ts) - Capitalize first letter of each word in a string
- [`formatDate(date)`](src/utils/format.util.ts) - Format Date object as `MM-DD-YYYY HH:mm:ss`
- [`logger`](src/utils/logger.util.ts) - Pino logger instance with multistream (terminal + files)
- [`extractErrorInfo(error)`](src/utils/error.util.ts) - Normalize error objects for consistent logging
- [`gracefulShutdown(server, signal)`](src/utils/shutdown.util.ts) - Handle graceful server shutdown on SIGTERM/SIGINT

**Error Extraction:**
The `extractErrorInfo` utility handles various error types:
- `ZodError` - Prettifies validation errors with field paths
- Custom errors (Mail, Template, Database) - Extracts name, message, stack, and custom properties
- Native errors - Standard error information
- Unknown types - Converts to string representation

## SSL/TLS Configuration

### HTTPS Server

To enable HTTPS for the Express server:

1. **Generate or obtain SSL certificates:**
   ```sh
   # For development (self-signed):
   openssl req -x509 -newkey rsa:4096 -keyout certs/server/key.pem -out certs/server/cert.pem -days 365 -nodes
   ```

2. **Place certificates in `certs/server/` directory**

3. **Update `.env` file:**
   ```env
   HTTPS_ENABLED=true
   HTTPS_KEY_PATH=certs/server/key.pem
   HTTPS_CERT_PATH=certs/server/cert.pem
   ```

4. **Application will:**
   - Start HTTPS server on configured port
   - Log certificate loading status
   - Throw `CertificateNotFoundError` if files are missing
   - Automatically verify certificate validity

See [certs/README.md](certs/README.md) for detailed certificate management instructions.

### MySQL SSL Connections

To enable SSL/TLS for encrypted database connections:

1. **Obtain SSL certificates from your database provider** (e.g., AWS RDS, Google Cloud SQL)

2. **Place certificates in `certs/db/` directory:**
   - `ca.pem` - Certificate Authority certificate
   - `client-cert.pem` - Client certificate
   - `client-key.pem` - Client private key

3. **Update `.env` file:**
   ```env
   DB_SSL_ENABLED=true
   DB_SSL_CA=certs/db/ca.pem
   DB_SSL_CERT=certs/db/client-cert.pem
   DB_SSL_KEY=certs/db/client-key.pem
   DB_SSL_REJECT_UNAUTHORIZED=true
   ```

4. **Configuration options:**
   - `DB_SSL_ENABLED=true` - Enables SSL for database connections
   - `DB_SSL_CA` - Path to CA certificate (required for SSL)
   - `DB_SSL_CERT` - Path to client certificate (optional, for mutual TLS)
   - `DB_SSL_KEY` - Path to client key (optional, for mutual TLS)
   - `DB_SSL_REJECT_UNAUTHORIZED=true` - Reject invalid certificates (recommended for production)

See [certs/README.md](certs/README.md) and [db/README.md](db/README.md) for more details.

## SMTP Security Configuration

### `SMTP_SECURE` and SSL/TLS

The `SMTP_SECURE` environment variable controls SSL/TLS encryption for SMTP connections:

**Secure Connection (SSL/TLS):**
```env
SMTP_SECURE=true
SMTP_PORT=465
```
- Full SSL/TLS encryption from the start
- Uses port 465 (standard for SMTPS)
- Recommended for production environments
- Application enforces port 465 when `SMTP_SECURE=true`

**STARTTLS Connection:**
```env
SMTP_SECURE=false
SMTP_PORT=587
```
- Connection starts unencrypted, upgrades to TLS
- Uses port 587 (standard for SMTP with STARTTLS)
- Supported by most email providers
- Application enforces port 587 when `SMTP_SECURE=false`

**Port Enforcement:**
The application validates SMTP configuration on startup and will throw an error if:
- `SMTP_SECURE=true` but `SMTP_PORT` is not 465
- `SMTP_SECURE=false` but `SMTP_PORT` is not 587

This prevents misconfiguration and ensures proper encryption is used.

**Gmail Configuration Example:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Use App Password, not account password
MAIL_FROM=your-email@gmail.com
```

See [`mail.service.ts`](src/services/mail.service.ts) for implementation details.

## Environment Configuration

All environment variables are validated on startup using Zod schemas in [`env.ts`](src/config/env.ts).

### Required Variables

**SMTP Configuration:**
- `SMTP_HOST` - SMTP server hostname (e.g., `smtp.gmail.com`)
- `SMTP_USER` - SMTP authentication username/email
- `SMTP_PASS` - SMTP authentication password
- `MAIL_FROM` - Default sender email address

**Rate Limiting:**
- `MAIL_SERVICE_RATE_LIMIT` - Max email requests per window (integer)
- `MAIL_SERVICE_RATE_WINDOW` - Rate limit window in minutes (integer)
- `RENDER_SERVICE_RATE_LIMIT` - Max render requests per window (integer)
- `RENDER_SERVICE_RATE_WINDOW` - Rate limit window in minutes (integer)

**Application Environment:**
- `NODE_ENV` - Environment mode (`development`, `production`, `test`)

**Database Configuration:**
- `DB_HOST` - MySQL server hostname
- `DB_PORT` - MySQL server port (typically 3306)
- `DB_USER` - Database username
- `DB_PASS` - Database password
- `DB_NAME` - Database name

### Optional Variables

**Server:**
- `PORT` - Server listening port (default: `3000`)

**SMTP:**
- `SMTP_PORT` - SMTP server port (default: `587`)
- `SMTP_SECURE` - Use SSL/TLS (default: `false`)

**Database Connection Pool:**
- `DB_CONNECTION_LIMIT` - Max pool connections (default: `10`)
- `DB_QUEUE_LIMIT` - Max queued connection requests (default: `0` = unlimited)
- `DB_WAIT_FOR_CONNECTIONS` - Wait for available connection (default: `true`)
- `DB_KEEP_ALIVE` - Enable TCP keep-alive (default: `true`)
- `DB_KEEP_ALIVE_INITIAL_DELAY` - Keep-alive initial delay in ms (default: `0`)

**Database SSL:**
- `DB_SSL_ENABLED` - Enable SSL for database (default: `false`)
- `DB_SSL_CA` - Path to CA certificate (optional)
- `DB_SSL_CERT` - Path to client certificate (optional)
- `DB_SSL_KEY` - Path to client key (optional)
- `DB_SSL_REJECT_UNAUTHORIZED` - Reject invalid certs (default: `true`)

**HTTPS Server:**
- `HTTPS_ENABLED` - Enable HTTPS server (default: `false`)
- `HTTPS_KEY_PATH` - Path to HTTPS private key (default: `./key.pem`)
- `HTTPS_CERT_PATH` - Path to HTTPS certificate (default: `./cert.pem`)

**Validation:**
Missing required variables will cause the application to fail during startup with a clear error message indicating which variable is missing.

See [`env.ts`](src/config/env.ts) for detailed documentation and validation logic.

## Code Quality

### Linting and Formatting

- **ESLint** - TypeScript-aware linting with recommended rules
  - Configuration: [`eslint.config.js`](eslint.config.js)
  - Uses `@typescript-eslint` for TypeScript support
  - Integrates with Prettier for consistent formatting
  - Max line length: 120 characters

- **Prettier** - Opinionated code formatting
  - Configuration: [`.prettierrc`](.prettierrc)
  - Automatically formats on save (if editor is configured)
  - Enforced through ESLint plugin

**Commands:**
```sh
npm run lint       # Check for linting issues
npm run lint:fix   # Auto-fix linting and formatting issues
```

### Type Safety

- **TypeScript** - Strict type checking enabled
  - Main config: [`tsconfig.json`](tsconfig.json)
  - Test config: [`tsconfig.test.json`](tsconfig.test.json)
  - Strict mode enabled for maximum type safety
  - No implicit `any` types allowed

## Testing

This project uses [Vitest](https://vitest.dev/) for unit and integration testing with comprehensive coverage.

### Test Structure

- **Configuration**: [`vitest.config.ts`](vitest.config.ts)
- **Test Files**: Co-located with source files (`.spec.ts` extension)
- **Mocks**: Located in `__mocks__` directories for module mocking
- **Coverage Provider**: V8 for accurate coverage reporting

### Running Tests

```sh
npm test              # Run tests in watch mode (interactive)
npm run test:run      # Run all tests once (CI mode)
npm run test:coverage # Generate coverage report
npm run test:ui       # Open Vitest UI (visual test runner)
npm run test:clean    # Remove coverage directory
```

### Test Coverage

Coverage reports are generated in the `coverage/` directory with:
- **Text report** - Console output
- **JSON report** - Machine-readable format
- **HTML report** - Interactive browser view (open `coverage/index.html`)

**Coverage Exclusions:**
- `node_modules/` - Third-party dependencies
- `dist/` - Compiled output
- `errors/` - Error class definitions
- `config/` - Configuration files
- `*.config.*` - All configuration files
- `*.d.ts` - TypeScript definition files
- `**/index.ts` - Re-export files
- `**/types/**` - Type definition directories

### Test Examples

**Service Tests:**
- [`mail.service.spec.ts`](src/services/mail.service.spec.ts) - Mail service and transporter
- [`template.service.spec.ts`](src/services/template.service.spec.ts) - Template compilation and caching

**Controller Tests:**
- [`mail.controller.spec.ts`](src/controllers/mail.controller.spec.ts) - Email sending endpoint

**Route Tests:**
- [`health.routes.spec.ts`](src/routes/health.routes.spec.ts) - Health check endpoint

**Utility Tests:**
- [`format.util.spec.ts`](src/utils/format.util.spec.ts) - String formatting utilities
- [`error.util.spec.ts`](src/utils/error.util.spec.ts) - Error extraction logic

**Config Tests:**
- [`env.spec.ts`](src/config/env.spec.ts) - Environment variable validation

### Mocking Strategy

- **Nodemailer** - Mocked transporter for email tests
- **Filesystem** - Mocked `fs` module for template tests
- **Environment** - Mocked config for different NODE_ENV scenarios
- **Database** - Connection pool mocked for controller tests

## Development Workflow

1. **Create a feature branch:**
   ```sh
   git checkout -b feature/my-feature
   ```

2. **Make your changes** to the codebase

3. **Run linting and fix issues:**
   ```sh
   npm run lint:fix
   ```

4. **Run tests and verify coverage:**
   ```sh
   npm test
   npm run test:coverage
   ```

5. **Build the project:**
   ```sh
   npm run build
   ```

6. **Test your changes locally:**
   ```sh
   npm run dev
   ```

7. **Commit your changes:**
   ```sh
   git add .
   git commit -m "Add new feature: description"
   ```

8. **Push to the branch:**
   ```sh
   git push origin feature/my-feature
   ```

9. **Open a pull request** on GitHub

### Development Tips

- **Hot Reload**: `npm run dev` watches TypeScript files and templates
- **Template Development**: Templates reload automatically in development mode
- **Log Monitoring**: Check `logs/` directory for detailed application logs
- **Database Testing**: Use transactions to test database operations safely
- **Environment Switching**: Create `.env.development` and `.env.production` for different configs

## CLI Usage (Global Install)

Install Offser globally to use as a command-line tool:

```sh
npm install -g offser
```

This makes the `offser` command available system-wide.

### Usage

Start the server from anywhere:

```sh
offser
```

The CLI will:
- Look for `.env` file in the current directory
- Start the server with the same configuration
- Use environment variables from the shell if `.env` is not found

**Requirements:**
- Project must be built (`npm run build`) before publishing or installing globally
- `dist/index.js` must exist and be executable
- `.env` file should be in the current working directory

### Publishing

To publish to npm:

```sh
npm run prepare  # Clean and build
npm publish      # Publish to npm registry
```

The `prepare` script automatically runs before publishing to ensure the build is up-to-date.

## Troubleshooting

### SMTP Connection Issues

**Symptoms:**
- Email sending fails with authentication errors
- Connection timeout errors

**Solutions:**
- Verify SMTP credentials in `.env` file
- Check firewall settings (allow ports 587 and 465)
- For Gmail:
  - Enable 2-factor authentication
  - Generate and use an [App Password](https://support.google.com/accounts/answer/185833)
  - Don't use your Google account password
- Verify `SMTP_SECURE` and `SMTP_PORT` match (587 for false, 465 for true)
- Test your credentials with a mail client (e.g., Thunderbird)

### Database Connection Issues

**Symptoms:**
- "Connection refused" errors
- Authentication failures
- SSL handshake errors

**Solutions:**
- Verify database credentials in `.env` file
- Ensure MySQL server is running:
  ```sh
  # Check MySQL status
  sudo systemctl status mysql  # Linux
  brew services list          # macOS with Homebrew
  ```
- Check firewall settings (allow port 3306)
- Verify database exists and user has proper permissions:
  ```sql
  SHOW DATABASES;
  SHOW GRANTS FOR 'your_user'@'localhost';
  ```
- If using SSL:
  - Ensure certificate paths in `.env` are correct
  - Verify certificate files exist and are readable
  - Check certificate expiration dates
  - Test SSL connection with MySQL client
- Check MySQL error logs for detailed error messages
- Verify connection pool configuration (limits, timeouts)

### TypeScript Compilation Issues

**Symptoms:**
- Build fails with type errors
- IDE shows red squiggles

**Solutions:**
- Ensure `tsconfig.json` is properly configured
- Run `npm run build` to see all type errors
- Check for missing type definitions:
  ```sh
  npm install --save-dev @types/node @types/express
  ```
- Use `npm run lint:fix` to fix formatting issues
- Clear TypeScript cache:
  ```sh
  rm -rf node_modules/.cache
  ```
- Verify TypeScript version matches project requirements

### Port Already in Use

**Symptoms:**
- "EADDRINUSE" error on startup
- Server fails to bind to port

**Solutions:**
- Change `PORT` in `.env` to an available port
- Kill the process using the port:
  ```sh
  # macOS/Linux
  lsof -ti:8080 | xargs kill -9
  
  # Windows
  netstat -ano | findstr :8080
  taskkill /PID <PID> /F
  ```
- Use a different port range for development (8000-9000)

### Logging Issues

**Symptoms:**
- Log files not created
- Missing log entries
- Permission errors

**Solutions:**
- Log files are created automatically in `logs/` directory
- Check directory permissions:
  ```sh
  ls -la logs/
  chmod 755 logs/  # If needed
  ```
- Ensure the application process has write access
- Verify sufficient disk space
- Use `npm run backup:logs` to archive logs before cleaning
- Check logger configuration in [`logger.util.ts`](src/utils/logger.util.ts)

### Certificate Issues

**Symptoms:**
- "Certificate not found" errors
- SSL handshake failures
- Browser security warnings

**Solutions:**
- Ensure certificate files exist at paths specified in `.env`:
  ```sh
  ls -la certs/server/
  ls -la certs/db/
  ```
- Check file permissions (must be readable by application):
  ```sh
  chmod 644 certs/server/*.pem
  ```
- For development, self-signed certificates are acceptable
- For production, use certificates from a trusted CA (Let's Encrypt, etc.)
- Verify certificate validity:
  ```sh
  openssl x509 -in certs/server/cert.pem -text -noout
  ```
- Check certificate expiration dates
- See [certs/README.md](certs/README.md) for detailed troubleshooting

### Template Issues

**Symptoms:**
- Template not found errors
- Handlebars compilation errors
- Missing template variables

**Solutions:**
- Templates are cached in production mode (`NODE_ENV=production`)
- In development mode, templates reload on each request
- Ensure template files exist in `src/templates/` directory:
  ```sh
  ls src/templates/
  ```
- Check template syntax for Handlebars errors
- Verify template data matches schema in [`template.schema.ts`](src/schemas/template.schema.ts)
- Clear template cache by restarting the server
- Use `npm run build:templates` to ensure templates are copied to `dist/`

### Rate Limiting Issues

**Symptoms:**
- "Too many requests" errors
- 429 status codes

**Solutions:**
- Adjust rate limits in `.env`:
  ```env
  MAIL_SERVICE_RATE_LIMIT=100
  MAIL_SERVICE_RATE_WINDOW=15
  RENDER_SERVICE_RATE_LIMIT=50
  RENDER_SERVICE_RATE_WINDOW=10
  ```
- Rate limits are per IP address
- Wait for the rate limit window to expire
- Use different IP addresses for testing (e.g., VPN, mobile network)

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Follow the code style** - Use ESLint and Prettier
3. **Write tests** for new features
4. **Update documentation** - Add JSDoc comments and update README
5. **Commit messages** - Use clear, descriptive commit messages
6. **Pull requests** - Provide a clear description of changes

**Code Standards:**
- Follow existing file structure and naming conventions
- Use TypeScript types for all function parameters and returns
- Add JSDoc comments for public APIs
- Write unit tests for utilities and services
- Write integration tests for controllers and routes
- Maintain test coverage above 80%

## Links

- **Repository**: [marcomg-byte/offser](https://github.com/marcomg-byte/offser)
- **Issues**: [GitHub Issues](https://github.com/marcomg-byte/offser/issues)
- **Pull Requests**: [GitHub PRs](https://github.com/marcomg-byte/offser/pulls)

## Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Zod](https://zod.dev/) - Schema validation
- [Nodemailer](https://nodemailer.com/) - Email sending
- [Handlebars](https://handlebarsjs.com/) - Template engine
- [Pino](https://github.com/pinojs/pino) - Fast logger
- [Vitest](https://vitest.dev/) - Testing framework
- [MySQL](https://www.mysql.com/) - Database system

## Release & npm Package

This project uses automated GitHub Actions workflows for versioned releases and npm publishing:

- **Release workflow**: When a pull request is merged into `main` with the label `patch`, `minor`, or `major`, the version is automatically bumped, a git tag is created, and a GitHub Release is published. The merged pull request also receives a `released` label.
- **Publish workflow**: When a new version tag (e.g., `v1.2.3`) is pushed, the package is built and published to the [npm registry](https://www.npmjs.com/package/offser) using the trusted publisher connection.

### How to trigger a release

1. Open a pull request to `main` with your changes.
2. Add one of the labels: `patch`, `minor`, or `major` to the PR (according to [semantic versioning](https://semver.org/)).
3. Merge the PR.
4. The workflows will:
   - Bump the version in `package.json` and create a git tag.
   - Publish a GitHub Release.
   - Build and publish the new version to npm.
   - Add the `released` label to the PR.

### npm Package

- **Current Version:** 1.1.5
- **Registry:** [https://www.npmjs.com/package/offser](https://www.npmjs.com/package/offser)
- **Install:**
  ```sh
  npm install -g offser
  ```
- **Usage:**
  ```sh
  offser --help
  ```


## GitHub Workflows

This project uses GitHub Actions for automated CI, container validation, release management, and npm publishing. The workflows are defined in `.github/workflows/`:

### 1. CI Workflow (`ci.yml`)
- **Trigger:** On every pull request to the `main` branch
- **Steps:**
  - Checks out the code
  - Sets up Node.js using the version in `.nvmrc`
  - Installs dependencies with `npm ci`
  - Runs all tests (`npm run test:run`)
  - Performs a dry run of `npm publish` to verify publishability

### 2. CD Workflow (`cd.yml`)
- **Trigger:** On every pull request to the `main` branch
- **Steps:**
  - Checks out the code
  - Sets up Node.js using `.nvmrc`
  - Installs dependencies (ignoring scripts)
  - Bundles the container (`npm run bundle:container`)
  - Builds the container image (`npm run build:container`)

### 3. Release Workflow (`release.yml`)
- **Trigger:** On pull request events (opened, synchronized, reopened, closed) to `main`
- **Steps:**
  - Checks out the code with full history
  - Determines the version bump type based on PR labels (`major`, `minor`, `patch`)
  - (Further steps may include version bumping, changelog generation, tagging, and release publishing)

### 4. Publish Workflow (`publish.yml`)
- **Trigger:**
  - On push of a tag matching the pattern `v*.*.*`
  - On pull request to `main` (dry run)
- **Steps:**
  - Checks out the code
  - Sets up Node.js using `.nvmrc`
  - Installs dependencies with `npm ci`
  - For PRs: Performs a dry run of `npm publish`
  - For tags: Publishes the package to npm with provenance using the `NODE_AUTH_TOKEN` secret

For more details, see the workflow files in `.github/workflows/`.