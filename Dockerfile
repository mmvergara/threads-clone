# Use a multi-stage build for smaller final image
FROM oven/bun:1.1.43-slim AS builder

WORKDIR /app

# Copy only files needed for installation first
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN mkdir data && \
    touch data/local.db && \
    bunx drizzle-kit push && \
    bun run build

# Start fresh for the production image
FROM oven/bun:1.1.43-slim

ENV NODE_ENV=production

# Create non-root user
RUN groupadd -r -g 1001 appgroup && \
    useradd -r -u 1001 -g appgroup appuser && \
    mkdir -p /home/appuser/data && \
    chown -R appuser:appgroup /home/appuser

WORKDIR /home/appuser

USER appuser

# Copy only necessary files from builder
COPY --from=builder --chown=appuser:appgroup /app/package.json /app/bun.lockb ./
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/build ./build
COPY --from=builder --chown=appuser:appgroup /app/data/local.db ./data/local.db

EXPOSE 3000

CMD ["bun", "run", "start"]

# docker build -t threads_clone:latest .