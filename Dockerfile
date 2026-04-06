# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY esbuild.container.mjs ./

# Skip prepare script (runs clean + build + start)
RUN npm ci --ignore-scripts

COPY src/ ./src/

# Produces bundle/ + templates
RUN npm run bundle:container

# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

# Needed for Node to recognize bundle/index.js as ESM without re-parsing
COPY package.json ./

# Only install packages that cannot be bundled (native bindings / worker threads)
RUN npm install --ignore-scripts mysql2 pino-pretty

# Copy container bundle and templates from builder
COPY --from=builder /app/bundle ./bundle

RUN mkdir -p logs

EXPOSE 8080

CMD ["node", "bundle/index.js"]