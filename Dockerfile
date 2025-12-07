# Build stage
FROM node:22-alpine AS builder

# Enable corepack for pnpm
RUN corepack enable

WORKDIR /app

# Copy package files and patches
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Install ALL dependencies (including dev) for build
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Production stage
FROM node:22-alpine AS runner

RUN corepack enable

WORKDIR /app

# Copy package files and patches
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Install ALL dependencies (not just --prod) because start script needs drizzle-kit and tsx from devDependencies
RUN pnpm install --frozen-lockfile

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy necessary config and script files for runtime
COPY drizzle.config.ts ./
COPY drizzle ./drizzle
COPY scripts ./scripts
COPY server ./server
COPY shared ./shared
COPY *.csv ./

# Copy client directory from builder stage to ensure all files are present
COPY --from=builder /app/client ./client

# Explicitly copy i18n locales from build context (not builder) as they may be modified during build
COPY client/src/i18n/locales/ ./client/src/i18n/locales/

# Debug: List locales directory to confirm files are copied
RUN ls -la /app/client/src/i18n/locales/ || echo "Locales directory not found!"

# Expose port (Zeabur will override this with PORT env var)
EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "start"]
