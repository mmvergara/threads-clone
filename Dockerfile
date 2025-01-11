# BUILD STAGE
# BUILD STAGE
# BUILD STAGE

FROM oven/bun:1.1.43-slim AS builder

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . .

RUN mkdir data && \
    touch data/local.db && \
    bunx drizzle-kit push && \
    bun run build && \
    rm -rf node_modules && \
    bun install --frozen-lockfile --production

# FINAL STAGE
# FINAL STAGE
# FINAL STAGE
FROM oven/bun:1.1.43-slim

ENV NODE_ENV=production

RUN groupadd -r -g 1001 appgroup && \
    useradd -r -u 1001 -g appgroup appuser && \
    mkdir -p /home/appuser/data && \
    chown -R appuser:appgroup /home/appuser

WORKDIR /home/appuser

USER appuser

COPY --from=builder --chown=appuser:appgroup /app/package.json /app/bun.lockb ./
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/build ./build
COPY --from=builder --chown=appuser:appgroup /app/data/local.db ./data/local.db

EXPOSE 3000

CMD ["bun", "run", "start"]

# docker build -t threads_clone:latest .