# Archon — Architecture Strategy

## Goal

Build an AI agent that acts as a senior cloud architect. Given a user's description of a system they want to build, the agent produces a complete, justified, provider-aware architectural recommendation — including service selection, trade-off reasoning, and an architecture diagram.

The agent must reason like a senior architect: capture requirements first, select patterns before services, reason about constraints, and validate its own output before presenting it.

---

## Knowledge Base

### Structure

The knowledge base lives in `data/`. There are three provider directories — `data/aws/`, `data/azure/`, `data/gcp/` — each containing one sub-directory per category (e.g. `data/aws/compute/`), and inside each category directory there is one markdown file per service (e.g. `data/aws/compute/fargate.md`).

### Service Document Format

Each service is stored in its own markdown file. The filename is a lowercase, hyphenated version of the service name.

```markdown
---
cloud_provider: "AWS"
service_category: "compute"
service_name: "Fargate"
pricing_model: "serverless"
managed: true
tier: 1
---
## AWS Fargate

### Description
AWS Fargate is a serverless, pay-as-you-go compute engine...

### Use Cases
* Microservices architecture
* Containerized background workers
```

**Frontmatter fields:**

| Field | Description | Example values |
|---|---|---|
| `cloud_provider` | Provider name | `"AWS"`, `"Azure"`, `"GCP"` |
| `service_category` | Category slug | `"compute"`, `"storage"` |
| `service_name` | Official short name | `"Fargate"`, `"Cloud Run"` |
| `pricing_model` | Primary pricing model | `"on-demand"`, `"serverless"`, `"reserved"`, `"per-request"`, `"subscription"` |
| `managed` | Fully managed by provider | `true` / `false` |
| `tier` | Retrieval priority | `1`, `2`, `3` |

**Tier values:**

| Tier | Label | Meaning |
|---|---|---|
| `1` | Foundational | Services every architect must consider when this category is active. Fetched by metadata filter within the relevant specialist's scope — never by global injection. |
| `2` | Standard | Well-known services relevant for a significant subset of use cases. Retrieved by semantic search. |
| `3` | Specialist | Niche or domain-specific services. Only surface when the query is a strong semantic match. |

**Doc size constraints by tier:**

| Tier | Description length | Use Cases bullets |
|---|---|---|
| `1` | 2–5 sentences. Cover what the service is and its primary value proposition only. | 3–5 bullets, no sub-bullets. |
| `2` | 5–12 sentences. Key features, integrations, constraints. | 5–8 bullets. Examples encouraged. |
| `3` | No hard limit. Full detail: features, limits, protocols, pricing nuances, integration patterns. | 5–10+ bullets. Rich examples. |

### Categories

The taxonomy is fixed and shared across all three providers.

| Directory | Category | What it covers |
|---|---|---|
| `compute` | Compute | VMs, containers (ECS/EKS/GKE/AKS), serverless containers (Fargate/Cloud Run), FaaS (Lambda/Cloud Functions/Azure Functions), batch, auto-scaling |
| `storage` | Storage | Object (S3/GCS/Blob), block (EBS/Persistent Disk/Managed Disks), file (EFS/Filestore/Azure Files) |
| `database` | Database | Relational (RDS/Cloud SQL/Azure SQL), NoSQL (DynamoDB/Firestore/Cosmos DB), cache (ElastiCache/Memorystore), graph, time-series, data warehouse |
| `networking` | Networking | VPC, CDN, DNS, load balancing, VPN, dedicated connections, NAT |
| `security_identity` | Security & Identity | IAM, secrets management, HSM, WAF, DDoS protection, threat detection, compliance |
| `ai_ml` | AI & Machine Learning | ML platforms, NLP, computer vision, generative AI, AutoML |
| `analytics` | Analytics & Big Data | Streaming analytics, batch analytics, BI, ETL/data pipelines, big data processing |
| `integration_messaging` | Integration & Messaging | Queues, pub/sub, event streaming, workflow orchestration, API management |
| `devops` | DevOps & Operations | CI/CD, monitoring, logging, IaC, cost management |
| `migration_hybrid` | Migration & Hybrid | Cloud migration tools, database migration, hybrid/on-prem extensions, edge computing |
| `other` | Other | IoT platforms, geospatial, communication APIs, VDI, blockchain |

### Cross-Provider Equivalences

`data/equivalences.yaml` maps services into concept groups with an equivalence level:

| Level | Meaning | Agent behaviour |
|---|---|---|
| `high` | Nearly identical in function, model, and architecture. | Pick one and note the others are equivalent alternatives. |
| `medium` | Same end goal but meaningful architectural differences. | Reason about the trade-offs and justify the choice. |

After retrieval, for every document entering context, the pipeline looks up `(provider, service_name)` in `data/equivalences.yaml` and appends an inline footer:

```
> Equivalent to: <other providers' services> (<level> equivalence)
> Note: <note>   ← only present when level is "medium"
```

This gives the synthesis agent full cross-provider awareness without deduplicating documents.

---

## Retrieval Design (RAG)

Retrieval is a **tool that agents call** — it is not the skeleton of the system. The agent orchestration is the skeleton.

### Embeddings

- One embedding vector per service document (per-file granularity)
- Frontmatter fields stored as metadata alongside each vector
- Model: a general-purpose text embedding model (e.g. `text-embedding-3-small`)

### Query authorship

Retrieval queries are written by **Specialist Agents** (see Phase 2), not derived from the raw user prompt. This is the critical design choice: by the time a retrieval call is made, the system already knows the architectural pattern, the requirements, and the specific decision the specialist is trying to resolve. The query is therefore precise and contextually grounded.

### Retrieval call

```ts
retrieve({
  query: string,          // written by the specialist agent
  pillar: CategorySlug,   // scopes the search to one category
  providers: string[],    // [] means all providers
  // top_k is fixed at 5 in code — not agent-controllable
})
```

### Tier-1 handling

Tier-1 documents are fetched by `tier = 1` metadata filter **within the specialist's pillar scope** (and optionally scoped to the requested providers). They are merged with the semantic results before being returned to the specialist — all Tier-1 docs first, then the top `top_k` Tier-2/3 semantic matches. Tier-1 docs are never excluded by `managed`, `pricing_model`, or other metadata filters, ensuring the specialist always sees the full foundational service set for the pillar. The retrieve tool is called **exactly once** per specialist invocation.

### No reranking

Dense vector search (cosine similarity) with metadata pre-filtering is sufficient because:

1. The query is written by a specialist agent with full context, not a raw user string.
2. The search space is already narrowed to one pillar and optionally one provider.
3. The specialist agent is capable of reasoning across 5–8 documents and discarding irrelevant ones.

A reranker would add latency and infrastructure complexity with marginal benefit given the above constraints.

---

## Agent Orchestration

### Overview

```
User prompt
    │
    ▼
[Phase 0 — Requirements Agent]  ←→  ask_user() tool
    │
    ▼  Requirements Schema
[Phase 1 — Pattern Agent]       ←→  read_file() tool  (data/patterns/*.md)
    │
    ▼  Selected pattern(s) + implied pillars
[Phase 2 — Wave 1 Specialist Agents × N]  ←→  retrieve() tool (RAG per pillar)
  compute │ storage │ database │ analytics │ ai_ml │ integration_messaging │ migration_hybrid
    │
    ▼  Wave 1 pillar recommendations
[Phase 2 — Wave 2 Specialist Agents × 3]  ←→  retrieve() tool (RAG per pillar)
  networking │ devops │ security_identity (always runs)
    │
    ▼  Wave 2 pillar recommendations
[Phase 3 — Validator Agent]     ←→  data/WELL_ARCHITECTED.md (injected into context)
    │
    ▼  Well-Architected validation report (prose)
[Phase 4 — Synthesis Agent]
    │
    ▼
Final output: narrative + service list + diagram payload + next steps
```

---

### Phase 0 — Requirements Agent

**Purpose:** Capture structured requirements before any architectural reasoning begins. A senior architect always asks questions before designing.

**Tools available:** `ask_user(questions: string[])` — surfaces targeted clarifying questions to the user in the UI and returns their answers.

The agent conducts a single-round intake. It asks only questions whose answers materially change the architecture. Typical questions cover:

- What does the system do? (workload description)
- Expected scale: concurrent users, request rate, data volume
- Team size and cloud expertise level
- Budget posture: minimal / moderate / enterprise
- Compliance requirements (HIPAA, SOC 2, GDPR, PCI, etc.)
- Provider preference or constraints
- Preference for managed vs self-managed services
- Existing infrastructure to integrate with or migrate from
- Primary quality attribute: availability, latency, throughput, cost, simplicity

**Output — Requirements Schema:**

```ts
{
  workload_description: string,
  scale: {
    users: "< 1k" | "1k–100k" | "> 100k"
  },
  cloud_expertise: "low" | "medium" | "high",
  constraints: {
    budget: "minimal" | "moderate" | "enterprise",
    compliance: string[],
    providers: ("AWS" | "Azure" | "GCP")[],
    managed_preference: boolean | null
  },
  quality: string,          // primary quality attribute driving trade-offs
  existing_infra: string | null
}
```

This schema is the **ground truth** for all downstream phases. Every agent receives it.

---

### Phase 1 — Pattern Agent

**Purpose:** Select one or more architectural patterns that fit the requirements, enrich that selection with detailed pattern knowledge, and produce the structured output that drives all downstream phases. This happens before any service is considered. Services are the implementation of a pattern, not the starting point.

**Input:** Requirements Schema

**Tools available:**
- `read_file(path: string)` — reads a file from the knowledge base by path. Used in this phase to load pattern detail files after initial pattern selection.

**Step 1 — Pattern selection**

The agent reads `data/PATTERNS_CONTEXT.md` as its fixed pattern catalogue. This file lists every known pattern, its category, a precise "when to use" condition, and the filename of its detail document under `data/patterns/`. The agent uses this table to map the Requirements Schema to one or more patterns before any further reasoning begins.

Patterns are not mutually exclusive. A production system commonly combines patterns from multiple categories (e.g., a Serverless Event-Driven compute layer + CQRS data layer + Warm Standby DR + Zero Trust security). Select every pattern that is structurally implied by the requirements.

**Step 2 — Pattern enrichment (tool call)**

For each selected pattern, the agent calls `read_file` with the detail file path listed in `data/PATTERNS_CONTEXT.md` (e.g. `data/patterns/serverless-event-driven.md`). This retrieves the full pattern specification: structural constraints, implied services, trade-offs, and the definitive list of implied pillars for that pattern.

Where multiple patterns share one detail file (e.g. both Saga variants use `saga.md`, all RAG variants use `rag.md`), a single `read_file` call covers all of them.

**Step 3 — Output construction**

Using the Requirements Schema and the enriched pattern detail, the agent produces its output.

**Output:**

```ts
{
  patterns: {
    name: string,
    justification: string       // grounded in requirements + pattern detail
  }[],
  implied_pillars: CategorySlug[]    // derived from the pattern detail files, not from the query
}
```

The `implied_pillars` list is the correct moment to determine which categories matter. It must be derived from the pattern detail files, not guessed from keywords in the user's message. For example: a serverless event-driven pattern structurally implies compute, integration_messaging, storage, and security_identity — whether or not the user mentioned any of those words.

---

### Phase 2 — Specialist Agents

**Purpose:** For each implied pillar, a dedicated specialist agent reasons about the right service(s) for that pillar given the full context. Phase 2 runs in two sequential waves. Wave 1 pillars are independent of each other and run in parallel. Wave 2 pillars are structurally dependent on Wave 1 outputs — their topology, tooling, and posture are shaped by the services already chosen — so they run after Wave 1 completes, in parallel with each other.

All specialists use the same `retrieve()` tool and produce the same output shape. The wave structure is an execution concern, not a schema concern.

---

#### Wave 1 — Independent Specialists

**Pillars:** `compute`, `storage`, `database`, `analytics`, `ai_ml`, `integration_messaging`, `migration_hybrid`

These pillars have self-contained selection decisions driven directly by the Requirements Schema and the chosen patterns. They do not depend on each other's outputs.

**Each Wave 1 specialist receives:**
- Requirements Schema
- Selected pattern(s) and their justifications
- Access to the `retrieve()` tool

**Each Wave 1 specialist:**

1. Formulates a precise retrieval query based on the pattern and requirements — not the raw user prompt.
2. Calls `retrieve()` with a precise query, the pillar, and an optional providers filter derived from the Requirements Schema.
3. Reads the returned documents (including equivalence notes).
4. Reasons about the options relative to the requirements and pattern.
5. Resolves architectural decisions within its pillar scope.
6. Flags unresolvable trade-offs (those requiring user input or preference) in `caveats[]`.
7. Outputs a **pillar recommendation**.

**Specialist system prompts are pillar-specific.** For example:

- The Compute Specialist knows to reason about: VM vs container vs FaaS abstraction level, cold start implications, burst vs sustained load, operational overhead relative to team expertise, and the scaling model of the chosen pattern.
- The Database Specialist knows to reason about: ACID requirements, consistency model, access pattern (OLTP vs OLAP vs key-value), managed vs self-managed, and data volume growth trajectory.

---

#### Wave 2 — Reactive Specialists

**Pillars:** `networking`, `devops`, `security_identity`

These pillars cannot be reasoned about independently. Their correct answers are structurally determined by what Wave 1 chose:

- **Networking** — VPC design, load balancer type, CDN placement, DNS routing, NAT, and peering topology all follow from which compute services, database placement, and deployment pattern Wave 1 selected. A networking specialist cannot reason about ALB vs NLB without knowing whether the compute layer is container-based or serverless, or whether the deployment is single-region or multi-regional.
- **DevOps** — CI/CD pipeline tooling, monitoring agents, logging sinks, and IaC frameworks are tightly coupled to the compute stack. The right monitoring setup for EKS (Prometheus, CloudWatch Container Insights) is different from the right setup for Lambda (CloudWatch Logs, X-Ray). DevOps tooling follows the compute choice.
- **Security & Identity** — WAF placement depends on whether a CDN or load balancer is present. IAM role design depends on which services exist and what they access. Secrets management scope depends on the number and type of services with credentials. Security wraps the rest of the architecture; it cannot be correctly specified before the services are known. **`security_identity` always runs, even if not in `implied_pillars` — security is never optional.**

**Each Wave 2 specialist receives:**
- Requirements Schema
- Selected pattern(s) and their justifications
- All Wave 1 pillar recommendations (full output objects)
- Access to the `retrieve()` tool

**Each Wave 2 specialist:**

1. Reads the Wave 1 pillar recommendations to understand which services have been chosen and how they connect.
2. Formulates a retrieval query grounded in the specific Wave 1 service choices — not generic pattern keywords.
3. Calls `retrieve()` with a precise query grounded in Wave 1 choices, the pillar, and an optional providers filter.
4. Reads the returned documents (including equivalence notes).
5. Reasons about the options in the context of the full Wave 1 picture.
6. Resolves architectural decisions within its pillar scope.
7. Flags unresolvable trade-offs in `caveats[]`.
8. Outputs a **pillar recommendation**.

---

#### Output per specialist (both waves) — Pillar Recommendation

```ts
{
  pillar: CategorySlug,
  services: {
    provider: string,
    service_name: string,
    role: string,             // e.g. "primary API compute", "background job processor"
    justification: string
  }[],
  caveats: string[]           // gotchas, limits, or conditions to watch
}
```

The `caveats` list is passed to the Synthesis Agent as notes.

---

### Phase 3 — Validator Agent

**Purpose:** Validate the full set of specialist recommendations against a cloud-agnostic Well-Architected framework before synthesis. The validator is advisory only — it produces a prose report that is passed to the Synthesis Agent. It does not re-run any specialists and does not block or modify recommendations.

**Input:** All pillar recommendations (Wave 1 + Wave 2) + Requirements Schema + selected patterns

**Knowledge source:** `data/WELL_ARCHITECTED.md` — a cloud-agnostic Well-Architected reference distilled from the AWS (6-pillar) and Azure (5-pillar) frameworks. It covers Reliability, Security, Cost Optimization, Operational Excellence, Performance Efficiency, and Sustainability. The document is injected into the validator's system prompt at agent startup (no retrieval tool needed).

**Tools available:** None. The validator reasons from injected context alone.

**Checks performed across six pillars:**

1. **Reliability** — Are workloads deployed across multiple failure domains proportionate to the stated availability quality attribute? Is there a data backup strategy? Are health checks and graceful degradation patterns present?

2. **Security** — Are identities managed centrally with least privilege? Are secrets stored in a managed store, never hardcoded? Is encryption applied at rest and in transit? Are compliance requirements (HIPAA, GDPR, PCI, etc.) addressed?

3. **Cost Optimization** — Is the pricing model (serverless, on-demand, reserved) matched to the traffic pattern? Is autoscaling configured? Is the cost proportionate to the stated budget?

4. **Operational Excellence** — Is infrastructure defined as code? Is the operational burden proportionate to team size and cloud expertise? Are fully managed services used where `cloud_expertise` is low?

5. **Performance Efficiency** — Is the database type matched to the access pattern? Is there a caching layer where justified? Can the compute layer scale to the stated peak load?

6. **Sustainability** — Are managed or serverless options used where appropriate? Is autoscaling configured to release idle capacity?

**Proportionality principle:** Every check is evaluated relative to the stated requirements. A single-zone deployment for a `budget: "minimal"`, `scale: "< 1k"` workload is not flagged as a reliability gap — it is proportionate. An over-engineered microservices architecture for a solo developer side project is flagged for disproportionate complexity.

**Output:**

A short prose report (150–350 words) structured as:

```
## Well-Architected Review

[One sentence verdict.]

**Strengths**
- [2–4 bullets: what the architecture does well, grounded in actual recommendations.]

**Concerns**
- [1–3 bullets: real gaps given the stated requirements, each with a one-line mitigation hint.
   If no meaningful concerns exist, a single bullet says so.]

**Proportionality**
[One sentence: does the complexity match the stated scale and budget?]
```

This report is passed in full to the Synthesis Agent, which incorporates the most important findings into its Trade-offs & Caveats section. The report is not shown in raw form in the UI — the UI shows only a "Well-Architected review complete" / "Architecture validated" status indicator.

---

### Phase 4 — Synthesis + Diagram

Phase 4 runs sequentially in two steps: the Synthesis Agent streams the written response first, then the Diagram Agent generates the infrastructure diagram via MCP.

---

#### Step 4a — Synthesis Agent

**Purpose:** Produce the final written architectural output. This agent does not do retrieval or service selection — it synthesises and communicates the work already done.

**Input:**
- Requirements Schema
- Pattern Agent output
- All pillar recommendations — Wave 1 + Wave 2
- Well-Architected validation report (from Phase 3)

**Output:** A single streamed markdown document with the following structure:

##### 1. Architecture Narrative

Prose explanation covering:
- What this architecture is and why it fits the stated requirements
- Key trade-offs made (what was ruled out and why)
- Risks and mitigations (incorporating the most important findings from the Well-Architected report)
- Where this architecture breaks down (scaling ceiling, cost inflection points, operational complexity thresholds)

##### 2. Service List

Per-pillar breakdown of every recommended service with its role and justification.

##### 3. Next Steps

Prioritised implementation order with:
- What to build first and why
- Critical early decisions that are hard to reverse later
- Estimated monthly cost bracket (rough range, not a quote)
- Suggested follow-up questions the user should ask

The synthesis text streams to the UI in real time via `text-start` / `text-delta` / `text-end` stream chunks. The Well-Architected report is consumed by the Synthesis Agent as context — it is not shown raw in the UI.

---

#### Step 4b — Diagram Agent (MCP)

**Purpose:** Generate a PNG infrastructure diagram using the Python `diagrams` package, via an MCP server running as a separate process.

**Trigger:** Runs after the synthesis text stream completes.

**Transport:** HTTP MCP (`@ai-sdk/mcp` with `type: "http"`), connecting to the MCP server at `MCP_SERVER_URL` (default: `http://localhost:8000/mcp`).

**Tool workflow (enforced by system prompt):**

1. `get_diagram_examples` — fetches example code for the relevant cloud provider (e.g. `"aws"`, `"gcp"`, `"azure"`) to learn the diagrams DSL syntax.
2. `list_icons` — discovers available icon class names for the provider, filtered by provider. Only names returned here may be used in code.
3. `generate_diagram` — submits Python code using the diagrams DSL. Always called with `workspace_dir` set to `DIAGRAM_OUTPUT_DIR` (default: `/tmp/archon-diagrams`).

**Code constraints enforced by the system prompt:**
- No import statements — the MCP server pre-imports all providers into the exec namespace.
- Start code directly with `with Diagram(`.
- Only use icon class names confirmed by `list_icons` (case-sensitive).
- 10–20 nodes maximum.
- No parentheses in the diagram title string (avoids a code-rewriting regex issue in the server).
- Do not name any variable `os` (would shadow the built-in module in the exec namespace).

**Output:** The MCP server saves the PNG to `DIAGRAM_OUTPUT_DIR/generated-diagrams/<filename>.png` and returns the absolute path in its text response. The Diagram Agent parses this path with the pattern `/PNG diagram:\s*(.+\.png)/i`.

**UI integration:**
- While generating: emits `data-archon-diagram` with `state: "generating"` → the diagram panel slides in from the right showing a spinner, and the chat area slides left to ~55% width (Framer Motion layout animation).
- On success: emits `data-archon-diagram` with `state: "complete"` and `imagePath` → the panel displays the PNG served by `/api/diagrams/[...path]`.
- On failure: emits `data-archon-diagram` with `state: "error"` → the panel shows the error message.

**PNG serving:** `GET /api/diagrams/[...path]` reconstructs the absolute filesystem path from URL segments and serves the file directly. The path guard allows any path under `DIAGRAM_OUTPUT_DIR` or the system temp directory (`os.tmpdir()`), since the MCP server may fall back to `/tmp/generated-diagrams` if the configured directory did not exist at the time of the call. The configured directory is created with `mkdir -p` both at pipeline start (before the MCP client connects) and on each `/api/diagrams` request.

---

## Extracted Data

Beyond the final recommendation, two structured artifacts are persisted per conversation:

### Requirements Schema

Stored alongside the chat record. Enables:
- Follow-up conversations that don't re-ask the same questions
- Analytics on what workload types and constraints are most common
- Personalisation if the user has existing infra preferences

---

## Summary of Design Principles

1. **Requirements before retrieval.** No service is considered until the requirements are captured. No retrieval query is written until the architectural pattern is selected.

2. **Patterns before services.** Services are the implementation of a pattern. Selecting services without first selecting a pattern produces a bag of components, not an architecture.

3. **Agents do the reasoning; RAG provides the knowledge.** Retrieval is a tool that agents call with precise, context-grounded queries. It is not the control flow of the system.

4. **Dependency order is explicit.** Wave 1 specialists (compute, storage, database, analytics, ai_ml, integration_messaging, migration_hybrid) run in parallel because their decisions are independent. Wave 2 specialists (networking, devops, security_identity) run after Wave 1 because their correct answers are structurally determined by Wave 1's choices. Execution order encodes architectural dependency.

5. **Every recommendation is validated.** The Validator Agent checks all specialist recommendations against a cloud-agnostic Well-Architected framework (Reliability, Security, Cost Optimization, Operational Excellence, Performance Efficiency, Sustainability) before the user sees anything. Validation is advisory and proportional to the stated requirements — it does not re-run specialists or block the pipeline.

6. **Simplicity in retrieval, richness in reasoning.** Dense vector search with metadata filters is sufficient when queries are written by specialist agents. Retrieval complexity is traded for agent reasoning depth.
