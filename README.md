# Archon

A cloud architect AI agent chatbot built with Next.js, TypeScript, and the Vercel AI SDK.

## Prerequisites

**App**
- [Node.js](https://nodejs.org)
- [pnpm](https://pnpm.io)
- PostgreSQL database

**Diagram generation**
- Python 3.12+
- [uv](https://docs.astral.sh/uv/)
- Graphviz:

```bash
sudo apt-get install graphviz graphviz-dev
```

## Running locally

### 1. Install Next.js dependencies

```bash
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in the following values:

- `OPENAI_API_KEY` — API key for [OpenAI](https://openai.com)
- `DATABASE_URL` — PostgreSQL connection string, e.g. `postgres://user:password@localhost:5432/archon`
- `BETTER_AUTH_SECRET` — Random secret used to sign auth tokens. Generate one with:

```bash
openssl rand -base64 32
```

### 3. Run database migrations

```bash
pnpm db:migrate
```

### 4. Start the MCP diagram server

The diagram generation feature requires the MCP server running separately. In a new terminal:

```bash
cd mcp
uv sync
uv run diagram-mcp
```

The server starts on `http://localhost:8000` by default. The Next.js app connects to it via the `MCP_SERVER_URL` environment variable.

### 5. Start the Next.js development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Via Docker

You can also run Archon instantly via docker. 

Make sure the `.env` file is configured, then run:

```bash
docker compose build
docker compose up
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
