# ==============================================================================
# Multi-stage production Dockerfile for EcoGPT
# Optimized for Google Cloud Run (Containerized Serverless Execution)
# ==============================================================================

# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies required for build)
RUN npm ci || npm install

# Copy project files
COPY . .

# Build the client SPA into dist/
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Production Runner
# ------------------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

# Production environment configurations
ENV NODE_ENV=production
ENV PORT=8080

# Copy package manifests and install production-ready runtime
COPY package*.json ./
RUN npm install --omit=dev && npm install tsx

# Copy built static frontend distribution from builder
COPY --from=builder /app/dist ./dist

# Copy backend server and essential configuration
COPY server.ts ./
COPY tsconfig*.json ./

# Cloud Run automatically injects PORT (default 8080)
EXPOSE 8080

# Lightweight container health check against the EcoGPT health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-8080}/api/health || exit 1

# Start full-stack EcoGPT server
CMD ["npx", "tsx", "server.ts"]
