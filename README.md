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

## Project Structure

```
.
├── src/
│   ├── index.ts
│   ├── config/
│   │   └── env.ts
│   ├── controllers/
│   │   ├── index.ts
│   │   └── mail.controller.ts
│   ├── middleware/
│   │   ├── index.ts
│   │   └── error.middleware.ts
│   ├── routes/
│   │   ├── index.ts
│   │   └── mail.routes.ts
│   ├── schemas/
│   │   ├── index.ts
│   │   └── mail.schema.ts
│   ├── services/
│   │   ├── index.ts
│   │   └── mail.service.ts
│   └── utils/
│       ├── index.ts
│       ├── error.util.ts
│       └── format.util.ts
├── .env
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)

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
- `npm run dev` - Start development server with hot reload
- `npm start` - Run the production build
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## API Endpoints

### Send Email

- **POST** `/mail/send`

Send an email through the SMTP server.

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "text": "Plain text content",
  "html": "<p>HTML content</p>"
}
```

**Fields:**
- `to` (required) - Recipient email address
- `subject` (required) - Email subject line
- `text` (optional) - Plain text email body
- `html` (optional) - HTML email body

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

**Error Response (400/500):**
```json
{
  "title": "Request Validation Errors",
  "issues": [
    {
      "code": "invalid_string",
      "path": ["to"],
      "message": "Invalid email address"
    }
  ]
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

---

Feel free to open issues or submit pull requests for improvements!