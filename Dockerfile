# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root manifests
COPY package*.json ./

# Install all dependencies including build tooling
RUN npm install

# Copy application source files
COPY client/ ./client/
COPY server/ ./server/

# Build client React application into client/dist
RUN npm run build

# Production Runner Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy root manifests
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy server code
COPY server/ ./server/

# Copy compiled frontend from builder stage
COPY --from=builder /app/client/dist ./client/dist

# Expose container ports (Cloud Run defaults to 8080, fallback 3000)
EXPOSE 8080
EXPOSE 3000

CMD ["node", "server/index.js"]
