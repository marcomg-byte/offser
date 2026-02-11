# Offser

A TypeScript-based Express.js server for sending emails via SMTP, with template rendering, robust validation, error handling, modular architecture, and advanced logging.

## Features

- Express.js API with modular routing
- TypeScript for type safety
- Zod schema validation for all request payloads
- Nodemailer integration for SMTP email delivery
- Handlebars template rendering with production caching
- Centralized error handling middleware
- Environment variable configuration with validation
- Rate limiting for mail and render endpoints
- Utility functions for string formatting and error extraction
- **Advanced logging with [Pino](https://github.com/pinojs/pino) and multistream:**
  - Pretty terminal output
  - Structured JSON logs per level (error, info, warn, debug)
  - Automatic log file creation
- Comprehensive error logging and debugging

## Project Structure

```
.
├── src/
│   ├── index.ts                 # Application entry point
│   ├── config/
│   │   └── env.ts               # Environment variables configuration & validation
│   ├── controllers/
│   │   ├── index.ts
│   │   ├── mail.controller.ts   # Email request handler
│   │   └── template.controller.ts # Template rendering handler
│   ├── errors/
│   │   ├── index.ts
│   │   ├── mail.error.ts
│   │   ├── template.error.ts
│   │   └── types/               # Error info types
│   ├── middleware/
│   │   ├── index.ts
│   │   └── error.middleware.ts  # Centralized error handling
│   ├── routes/
│   │   ├── index.ts
│   │   ├── mail.routes.ts       # Email API routes
│   │   └── template.routes.ts   # Template rendering API routes
│   ├── schemas/
│   │   ├── index.ts
│   │   ├── mail.schema.ts       # Email validation schema (Zod)
│   │   └── template.schema.ts   # Template data validation schemas (Zod)
│   ├── services/
│   │   ├── index.ts
│   │   ├── mail.service.ts      # Email sending service (Nodemailer)
│   │   └── template.service.ts  # Template rendering & caching
│   ├── templates/               # Handlebars templates
│   └── utils/
│       ├── index.ts
│       ├── error.util.ts        # Error extraction utilities
│       ├── format.util.ts       # String formatting utilities
│       └── logger.util.ts       # Pino logger with multistream
├── .env                         # Environment variables (local)
├── .gitignore                   # Git ignore rules
├── .prettierrc                  # Prettier code formatting config
├── eslint.config.js             # ESLint configuration
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- SMTP server credentials (e.g., Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository**
    ```sh
    git clone https://github.com/your-username/offensive-server.git
    cd offensive-server
    ```

2. **Install dependencies**
    ```sh
    npm install
    ```

3. **Configure environment variables**

    Create or edit the `.env` file with your SMTP configuration:
    ```env
    NODE_ENV=development
    PORT=8080
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your-email@gmail.com
    SMTP_PASS=your-app-password
    MAIL_FROM=your-email@gmail.com
    MAIL_SERVICE_RATE_LIMIT=10
    MAIL_SERVICE_RATE_WINDOW=15
    RENDER_SERVICE_RATE_LIMIT=20
    RENDER_SERVICE_RATE_WINDOW=10
    ```

4. **Build the project**
    ```sh
    npm run build
    ```

5. **Start the server**
    ```sh
    npm start
    ```

    The server will run on the port specified in `.env` (default: 3000).

### Development

For development with automatic reloads:

```sh
npm run dev
```

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Start development server with hot reload (Nodemon + tsx)
- `npm start` - Run the production build
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm test` - Run unit and integration tests with Vitest
- `npm run coverage` - Generate a test coverage report

## Logging

This project uses [Pino](https://github.com/pinojs/pino) with multistream for advanced logging:

- **Terminal output:** Pretty-printed, colored logs for development.
- **Log files:** Structured JSON logs per level (`logs/error.log`, `logs/info.log`, `logs/warn.log`, `logs/debug.log`).
- **Automatic log directory creation:** No manual setup required.
- **Custom timestamp and uppercase log levels for consistency.**

See [`logger`](src/utils/logger.util.ts) for implementation details.

## Architecture

### Modular Structure

- **Controllers** - Handle HTTP requests and responses
- **Services** - Business logic (email sending, template rendering)
- **Routes** - Define API endpoints and rate limiting
- **Schemas** - Data validation rules (Zod)
- **Middleware** - Cross-cutting concerns (error handling)
- **Utils** - Reusable utility functions (including logging)
- **Config** - Application configuration and environment validation
- **Templates** - Handlebars templates for dynamic emails

### Error Handling

Centralized error handling middleware catches and processes:
- **Zod Validation Errors** → 400 Bad Request with validation details
- **Mail/Template Errors** → 500 Internal Server Error with context
- **Unknown Errors** → 500 Internal Server Error with fallback message

All errors are logged with detailed information including stack traces and error context.

## API Endpoints

### Health Check

- **Endpoint**: `GET /health`
- **Description**: Check the server's operational status, uptime, and current timestamp. Useful for monitoring and load balancer health checks.

**Success Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2023-10-27T10:00:00.000Z",
  "localDate": "10-27-2023 10:00:00",
  "uptime": 120.5
}
```

### Send Email

- **Endpoint**: `POST /mail/send`
- **Description**: Send an email through the SMTP server

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "text": "Plain text content",
  "html": "<p>HTML content</p>",
  "templateName": "offers",
  "templateData": { "customerName": "John", ... }
}
```

**Request Fields:**
- `to` (required, string) - Recipient email address (must be valid email format)
- `subject` (required, string) - Email subject line
- `text` (optional, string) - Plain text email body
- `html` (optional, string) - HTML email body
- `templateName` (optional, string) - Name of Handlebars template to use
- `templateData` (optional, object) - Data for template variables

**Success Response (200):**
```json
{
  "title": "Email Sent Successfully!",
  "data": { ... },
  "mailResponse": { "messageId": "<message-id@example.com>", ... }
}
```

**Validation Error Response (400):**
```json
{
  "title": "Request Validation Error",
  "error": "Prettified validation error message"
}
```

**Server Error Response (500):**
```json
{
  "title": "Mail Service Error",
  "name": "MailDeliveryError",
  "message": "...",
  "stack": "...",
  "cause": { ... }
}
```

### Render Template

- **Endpoint**: `GET /render/:templateName`
- **Description**: Render a Handlebars template with provided data (in request body)

**Request Example:**
```http
GET /render/offers
Content-Type: application/json

{
  "customerName": "John",
  "offers": [
    { "title": "Discount", "description": "10% off" }
  ],
  "ctaUrl": "https://example.com/offer"
}
```

**Success Response (200):**
- Returns rendered HTML string.

**Validation Error Response (400):**
```json
{
  "title": "Request Validation Error",
  "error": "Prettified validation error message"
}
```

**Server Error Response (500):**
```json
{
  "title": "Template Compilation Error",
  "name": "TemplateCompileError",
  "message": "...",
  "stack": "...",
  "cause": { ... }
}
```

## Key Utilities

- [`capitalizeWord(word)`](src/utils/format.util.ts) - Capitalize the first letter of a word.
- [`capitalizeString(value)`](src/utils/format.util.ts) - Capitalize the first letter of each word in a string.
- [`formatDate(date)`](src/utils/format.util.ts) - Formats a Date object into `MM-DD-YYYY HH:mm:ss`.
- [`logger`](src/utils/logger.util.ts) - Advanced logging with Pino multistream.
- [`extractErrorInfo(error)`](src/utils/error.util.ts) - Normalized error extraction for consistent logging.
- [`gracefulShutdown(server, signal)`](src/utils/shutdown.util.ts) - Handles graceful server shutdown.

## Environment Configuration

- [`required(name)`](src/config/env.ts) - Retrieve required environment variables with validation.
- [`env`](src/config/env.ts) - Application configuration object with all environment settings

## Code Quality

- **ESLint** - Code linting with TypeScript support ([`eslint.config.js`](eslint.config.js))
- **Prettier** - Code formatting ([`.prettierrc`](.prettierrc))

## Testing

This project uses [Vitest](https://vitest.dev/) for unit and integration testing.

- **Configuration**: Test settings are defined in [`vitest.config.ts`](vitest.config.ts).
- **Test Files**: Tests are located alongside the source files with a `.spec.ts` or `.test.ts` extension.
- **Mocks**: Mocks for modules like `nodemailer`, `fs`, and internal utilities are located in `__mocks__` directories to isolate tests.
- **Coverage**: Code coverage is generated using `v8` and can be viewed in the `coverage/` directory after running `npm run coverage`.

To run all tests:
```sh
npm test
```

## Development Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Run linting: `npm run lint:fix`
4. Build the project: `npm run build`
5. Test your changes: `npm run dev`
6. Commit your changes: `git commit -am 'Add new feature'`
7. Push to the branch: `git push origin feature/my-feature`
8. Open a pull request

## CLI Usage (Global Install)

You can use Offser as a command-line tool by installing it globally with npm:

```sh
npm install -g offser
```

This will make the `offser` command available anywhere on your system.

### Example Usage

Start the server from the CLI:

```sh
offser
```

You can also pass environment variables or use a `.env` file for configuration. The CLI will use the same entry point and options as described above.

**Note:** Ensure you have built the project (`npm run build`) before publishing or installing globally, so the `dist/index.js` file exists and is executable.

---
## Troubleshooting

### SMTP Connection Issues

- Verify your SMTP credentials in `.env`
- Check firewall settings (port 587 or 465)
- Enable "Less secure app access" if using Gmail
- Use app-specific passwords instead of account password

### TypeScript Compilation Issues

- Ensure `tsconfig.json` is properly configured
- Run `npm run build` to check for type errors
- Use `npm run lint:fix` to fix formatting issues

### Port Already in Use

- Change `PORT` in `.env` to an available port
- Or kill the process using the port: `lsof -i :8080`

### Logging Issues

- Log files are created automatically in the `logs/` directory.
- If logs are missing, check directory permissions and ensure the process has write access.

---

Feel free to open issues or submit pull requests for improvements!