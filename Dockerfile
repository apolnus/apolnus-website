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
COPY shared ./shared
COPY client/src ./client/src
COPY *.csv ./

# Expose port (Zeabur will override this with PORT env var)
EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "start"]
