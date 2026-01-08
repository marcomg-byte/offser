# Offensive Server

A simple Express.js server for handling mail-related routes. This project is structured with TypeScript and uses environment variables for configuration.

## Features

- Express.js API with modular routing
- TypeScript for type safety
- Environment variable configuration
- Example mail endpoint

## Project Structure

```
.
├── src/
│   ├── index.ts
│   ├── config/
│   │   └── env.ts
│   ├── controllers/
│   │   └── mail.controller.ts
│   └── routes/
│       └── mail.routes.ts
├── .env
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

	Edit the `.env` file to set your desired port:
	```
	PORT=8000
	```

4. **Build the project**
	```sh
	npm run build
	```

5. **Start the server**
	```sh
	npm start
	```

	The server will run on the port specified in `.env` (default: 8000).

### Development

For development, you can use `ts-node` and `nodemon` for automatic reloads:

```sh
npx nodemon src/index.ts
```

### API Endpoint

- `GET /mail/send`  
  Send a mail (expects `to`, `subject`, and `body` in the request body).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

---

Feel free to open issues or submit pull requests for improvements!
