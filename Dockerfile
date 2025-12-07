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

# Explicitly copy i18n locales to a dedicated directory for reliability
COPY --from=builder /app/client/src/i18n/locales ./locales/
# Also copy to the original development path for fallback
COPY --from=builder /app/client/src/i18n/locales ./client/src/i18n/locales/

# Debug: List both locales directories to confirm files are copied
RUN echo "=== /app/locales ===" && ls -la /app/locales/ || echo "Locales not found in /app/locales"
RUN echo "=== /app/client/src/i18n/locales ===" && ls -la /app/client/src/i18n/locales/ || echo "Locales not found in /app/client/src/i18n/locales"

# Expose port (Zeabur will override this with PORT env var)
EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "start"]
