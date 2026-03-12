# syntax=docker/dockerfile:1

FROM python:3.12-slim AS builder

# Install graphviz (required by the diagrams package to render PNGs)
# and uv for fast dependency installation
RUN apt-get update && apt-get install -y --no-install-recommends \
        graphviz \
    && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY pyproject.toml uv.lock README.md ./

# Install dependencies only (skip building the local package for now)
# --frozen: use the lockfile exactly; --no-dev: skip dev extras if any
RUN uv sync --frozen --no-dev --no-install-project

# Copy the full server source
COPY server/ ./server/

# Now install the local package itself
RUN uv sync --frozen --no-dev

# ── Runtime image ─────────────────────────────────────────────────────────────
FROM python:3.12-slim AS runner

# graphviz runtime libs must be present in the final image too
RUN apt-get update && apt-get install -y --no-install-recommends \
        graphviz \
    && rm -rf /var/lib/apt/lists/*

# Copy uv binary so we can use `uv run` in the CMD
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

# Copy the installed project (virtualenv + source) from the builder stage
COPY --from=builder /app /app

# The MCP server writes diagrams to DIAGRAM_OUTPUT_DIR.
# This env var is overridden in docker-compose so both containers agree on the path.
ENV DIAGRAM_OUTPUT_DIR=/tmp/archon-diagrams
ENV MCP_HOST=0.0.0.0
ENV MCP_PORT=8000

EXPOSE 8000

CMD ["uv", "run", "diagram-mcp"]
