# Archon

The greated AI cloud architect, so you can _kickback_ and relax.

## Features
- Simplifies process of designing cloud architectures
- Picks architectural patterns
- Finds the best services from AWS, Azure and GCP using RAG
- Validates the architecture against the _well-architected_ framework
- Generates Diagrams via an MCP server
- Fully responsive UI
- User authentication baked in via Better-Auth

## Demo video
You can see a demo video [here](https://youtu.be/s37cBCvhmPw)

## Architecture
- We first gathered data from all 3 cloud providers, and assigned _tiers_ to them (T1/T2/T3)
- During _Phase 2_, we perform RAG only on T2 and T3 docs. T1 docs are _always_ injected into the context, since they are foundational/common services
- The pipeline does the following in order:
  - Phase 0: Gathers app requirements
  - Phase 1: Finds best architectural patterns
  - Phase 2: Finds best services from AWS, Azure and GCP in parallel (split into 2 waves, since _networking_, _devops_ and _security_ depend on wave 1's output)
  - Phase 3: Validates the architecture using the _well-architected_ framework
  - Phase 4: Creates a final response, taking into account all of the specialist agent's output
  - Phase 5: Generates Diagram via an MCP server
- Overview of the main pipeline:
<img src="docs/assets/ai_cloud_architect_pipeline.png" alt="AI Cloud Architect Pipeline" width="600">

- When the user wants to ask a follow-up question, it follows a different pipeline:
<img src="docs/assets/ai_cloud_architect_pipeline_followup.png" alt="AI Cloud Architect Pipeline Followup" width="600">


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
- `BETTER_AUTH_SECRET` — Random secret used to sign auth tokens. You can use [this](https://www.hexhero.com/tools/random-key-generator) website, or run:

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

You can also run Archon directly via docker.

Make sure the `.env` file is configured:

```bash
cp .env.example .env
```

- `OPENAI_API_KEY` — API key for [OpenAI](https://openai.com)
- `DATABASE_URL` — Ignore this, will be configured automatically
- `BETTER_AUTH_SECRET` — Random secret used to sign auth tokens. You can use [this](https://www.hexhero.com/tools/random-key-generator) website, or run:

```bash
openssl rand -base64 32
```

then run:

```bash
docker compose build
docker compose up
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
