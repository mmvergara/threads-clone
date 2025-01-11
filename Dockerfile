FROM oven/bun:1.1.43-slim

ENV NODE_ENV=production

RUN groupadd -r -g 1001 appgroup && \
    useradd -r -u 1001 -g appgroup appuser

USER appuser

WORKDIR /home/appuser

COPY --chown=appuser:appgroup package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY --chown=appuser:appgroup . .

RUN mkdir data && \
    touch data/local.db && \
    bunx drizzle-kit push && \
    bun run build && \
    rm -rf app/ .git/ public/ screenshots/

EXPOSE 3000

CMD ["bun", "run", "start"]

# docker build -t threads:latest .