# Offser

A TypeScript-based Express.js server for sending emails via SMTP. Features validation, error handling, and a modular architecture.

## Features

- Express.js API with modular routing
- TypeScript for type safety
- Zod schema validation for email requests
- Nodemailer integration for SMTP email delivery
- Centralized error handling middleware
- Environment variable configuration
- Utility functions for string formatting and error logging
- Comprehensive error logging and debugging

## Project Structure

```
.
├── src/
│   ├── index.ts                 # Application entry point
│   ├── config/
│   │   └── env.ts               # Environment variables configuration
│   ├── controllers/
│   │   ├── index.ts             # Controller exports
│   │   └── mail.controller.ts   # Email request handler
│   ├── middleware/
│   │   ├── index.ts             # Middleware exports
│   │   └── error.middleware.ts  # Centralized error handling
│   ├── routes/
│   │   ├── index.ts             # Route exports
│   │   └── mail.routes.ts       # Email API routes
│   ├── schemas/
│   │   ├── index.ts             # Schema exports
│   │   └── mail.schema.ts       # Email validation schema (Zod)
│   ├── services/
│   │   ├── index.ts             # Service exports
│   │   └── mail.service.ts      # Email sending service (Nodemailer)
│   └── utils/
│       ├── index.ts             # Utility exports
│       ├── error.util.ts        # Error logging utilities
│       └── format.util.ts       # String formatting utilities
├── .env                         # Environment variables (local)
├── .gitignore                   # Git ignore rules
├── .prettierrc                  # Prettier code formatting config
├── eslint.config.js             # ESLint configuration
├── package.json                 # Project dependencies
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
    ```

    **Environment Variables:**
    - `NODE_ENV` - Application environment (development/production)
    - `PORT` - Server port (default: 3000)
    - `SMTP_HOST` - SMTP server hostname
    - `SMTP_PORT` - SMTP server port (587 for TLS, 465 for SSL)
    - `SMTP_USER` - SMTP authentication username
    - `SMTP_PASS` - SMTP authentication password
    - `MAIL_FROM` - Default sender email address

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

## Architecture

### Modular Structure

The project follows a modular architecture pattern:

- **Controllers** - Handle HTTP requests and responses
- **Services** - Contain business logic (email sending)
- **Routes** - Define API endpoints
- **Schemas** - Define data validation rules (Zod)
- **Middleware** - Handle cross-cutting concerns (error handling)
- **Utils** - Provide reusable utility functions
- **Config** - Manage application configuration

### Error Handling

Centralized error handling middleware catches and processes:
- **Zod Validation Errors** → 400 Bad Request with validation details
- **Standard Errors** → 500 Internal Server Error with error details
- **Unknown Errors** → 500 Internal Server Error with fallback message

All errors are logged with detailed information including stack traces and error context.

## API Endpoints

### Send Email

- **Endpoint**: `POST /mail/send`
- **Description**: Send an email through the SMTP server

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "text": "Plain text content",
  "html": "<p>HTML content</p>"
}
```

**Request Fields:**
- `to` (required, string) - Recipient email address (must be valid email format)
- `subject` (required, string) - Email subject line (alphanumeric, spaces, and special characters)
- `text` (optional, string) - Plain text email body
- `html` (optional, string) - HTML email body

**Success Response (200):**
```json
{
  "title": "Email Sent Successfully!",
  "data": {
    "to": "recipient@example.com",
    "subject": "Email Subject",
    "text": "Plain text content",
    "html": "<p>HTML content</p>"
  },
  "mailResponse": {
    "messageId": "<message-id@example.com>"
  }
}
```

**Validation Error Response (400):**
```json
{
  "title": "Request Validation Errors",
  "cause": null,
  "issues": [
    {
      "code": "invalid_string",
      "expected": "email",
      "received": "string",
      "path": ["to"],
      "message": "Invalid email address"
    }
  ],
  "message": "Invalid input",
  "name": "ZodError",
  "stack": "...",
  "type": "error"
}
```

**Server Error Response (500):**
```json
{
  "title": "Email Sending Failed",
  "cause": null,
  "message": "Error message describing the failure",
  "name": "Error",
  "stack": "..."
}
```

### Example Requests

**cURL:**
```bash
curl -X POST http://localhost:8080/mail/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Hello World",
    "html": "<p>This is a test email</p>"
  }'
```

**JavaScript (fetch):**
```javascript
const response = await fetch('http://localhost:8080/mail/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'user@example.com',
    subject: 'Hello World',
    html: '<p>This is a test email</p>'
  })
});

const data = await response.json();
console.log(data);
```

## Key Utilities

### String Formatting

The project includes utility functions for string formatting:

- [`capitalizeWord(word)`](src/utils/format.util.ts) - Capitalize first letter of a word
- [`capitalizeString(value)`](src/utils/format.util.ts) - Capitalize first letter of each word

### Error Logging

- [`logError(error, title)`](src/utils/error.util.ts) - Structured error logging with emoji indicators

### Environment Configuration

- [`required(name)`](src/config/env.ts) - Retrieve required environment variables with validation
- [`env`](src/config/env.ts) - Application configuration object with all environment settings

## Code Quality

### Linting & Formatting

The project uses:
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting

Configuration files:
- [`.prettierrc`](.prettierrc) - Prettier formatting rules
- [`eslint.config.js`](eslint.config.js) - ESLint rules and plugins

**Prettier Settings:**
- Semi-colons: enabled
- Single quotes: enabled
- Tab width: 2 spaces
- Trailing commas: all

## Development Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Run linting: `npm run lint:fix`
4. Build the project: `npm run build`
5. Test your changes: `npm run dev`
6. Commit your changes: `git commit -am 'Add new feature'`
7. Push to the branch: `git push origin feature/my-feature`
8. Open a pull request

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

## Troubleshooting

### SMTP Connection Issues

If you encounter SMTP connection errors:
1. Verify your SMTP credentials in `.env`
2. Check firewall settings (port 587 or 465)
3. Enable "Less secure app access" if using Gmail
4. Use app-specific passwords instead of account password

### TypeScript Compilation Issues

- Ensure `tsconfig.json` is properly configured
- Run `npm run build` to check for type errors
- Use `npm run lint:fix` to fix formatting issues

### Port Already in Use

If the default port is already in use:
1. Change `PORT` in `.env` to an available port
2. Or kill the process using the port: `lsof -i :8080`

---

Feel free to open issues or submit pull requests for improvements!