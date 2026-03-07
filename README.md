# Archon

A cloud architect AI agent chatbot built with Next.js, TypeScript, and the Vercel AI SDK.

## Running locally

**Prerequisites:** Node.js, pnpm, and a PostgreSQL database.

1. Install dependencies:

```bash
pnpm install
```

2. Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

The following variables need to be filled in:

- `AI_GATEWAY_API_KEY` — API key for [Vercel AI Gateway](https://vercel.com/ai-gateway)
- `DATABASE_URL` — PostgreSQL connection string, e.g. `postgres://user:password@localhost:5432/archon`.
- `BETTER_AUTH_SECRET` — A random secret used to sign auth tokens. Generate one with:
```bash
openssl rand -base64 32
```

3. Generate and run database migrations:

```bash
pnpm db:migrate
```

4. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
