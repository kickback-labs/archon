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
  filters: {
    managed?: boolean,
    pricing_model?: string,
    tier?: 1 | 2 | 3
  },
  top_k: number           // 5–8
})
```

### Tier-1 handling

Tier-1 documents are fetched by `tier = 1` metadata filter **within the specialist's pillar scope**. They are merged with the semantic results before being returned to the specialist. They are not globally injected — they are scoped to the pillar the specialist is actively reasoning about.

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
[Phase 3 — Critic Agent]
    │  issues found? → re-run affected specialists once with feedback
    ▼
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
    users: "< 1k" | "1k–100k" | "> 100k",
    rps_estimate?: string,
    data_volume?: string
  },
  team: {
    size: "solo" | "small" | "large",
    cloud_expertise: "low" | "medium" | "high"
  },
  constraints: {
    budget: "minimal" | "moderate" | "enterprise",
    compliance: string[],
    provider_lock_in: "avoid" | "acceptable" | "preferred",
    providers: ("AWS" | "Azure" | "GCP")[],
    managed_preference: boolean | null
  },
  qualities: {
    primary: string,
    secondary: string
  },
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
2. Calls `retrieve()` with appropriate filters (`managed`, `pricing_model`, `providers`, `tier`).
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
3. Calls `retrieve()` with appropriate filters.
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
  decisions_resolved: {
    decision: string,
    chosen: string,
    rejected_alternatives: string[],
    rationale: string
  }[],
  caveats: string[]           // gotchas, limits, or conditions to watch
}
```

The `decisions_resolved` log is persisted alongside the chat. It enables the UI to show the user *why* a specific service was chosen over alternatives without re-running the pipeline.

---

### Phase 3 — Critic Agent

**Purpose:** Validate the full set of specialist recommendations before synthesis. A senior architect reviews a design before presenting it.

**Input:** All pillar recommendations (Wave 1 + Wave 2) + Requirements Schema + selected patterns

**Checks performed:**

1. **Integration consistency** — Do the chosen services connect? If Compute picked AWS Fargate, did Networking include an ALB and the VPC context? If the pattern is event-driven, did Integration & Messaging recommend an appropriate queue or event bus?

2. **Gap detection** — Are there implied services missing from any pillar? Common gaps: no CDN despite public-facing traffic, no secrets manager despite credentials being used, no monitoring despite a production workload.

3. **Constraint compliance** — Does any recommendation violate the Requirements Schema? Examples: a self-managed service recommended for a team with `cloud_expertise: "low"`; a premium service recommended for a `budget: "minimal"` workload; a single-region design for a workload with high availability as its primary quality.

4. **Proportionality** — Is the complexity proportional to the stated scale and team? An event-driven microservices architecture recommended for a solo developer building a side project is over-engineered.

**Output:**

```ts
{
  issues: {
    severity: "blocking" | "warning",
    affected_pillars: CategorySlug[],
    description: string,
    suggested_fix: string
  }[]
}
```

If `issues` contains any `blocking` items, the affected specialist agents are re-run once with the critic's feedback appended to their context. `warning` items are passed to the Synthesis Agent as notes. The correction loop runs **at most once** — the critic does not loop indefinitely.

---

### Phase 4 — Synthesis Agent

**Purpose:** Produce the final architectural output. This agent does not do retrieval or service selection — it synthesises and communicates the work already done.

**Input:**
- Requirements Schema
- Pattern Agent output
- All pillar recommendations — Wave 1 + Wave 2 (post-critic)
- All resolved decisions

**Output — four parts:**

#### 1. Architecture Narrative

Prose explanation structured as:
- What this architecture is and why it fits the stated requirements
- Key trade-offs made (what was ruled out and why)
- Risks and mitigations
- Where this architecture breaks down (scaling ceiling, cost inflection points, operational complexity thresholds)

#### 2. Service List

Structured, per-pillar:

```ts
{
  pillar: CategorySlug,
  services: {
    provider: string,
    service_name: string,
    role: string,
    justification: string
  }[]
}[]
```

#### 3. Architecture Diagram Payload

A node/edge structure for rendering in the `Canvas` component:

```ts
{
  nodes: {
    id: string,
    label: string,           // service name
    category: CategorySlug,
    provider: string,
    role: string
  }[],
  edges: {
    from: string,
    to: string,
    label?: string           // e.g. "async", "HTTPS", "replicates to"
  }[]
}
```

#### 4. Next Steps

Prioritised implementation order with:
- What to build first and why
- Critical early decisions that are hard to reverse later
- Estimated monthly cost bracket (rough range, not a quote)
- Suggested follow-up questions the user should ask

---

## Extracted Data

Beyond the final recommendation, two structured artifacts are persisted per conversation:

### Requirements Schema

Stored alongside the chat record. Enables:
- Follow-up conversations that don't re-ask the same questions
- Analytics on what workload types and constraints are most common
- Personalisation if the user has existing infra preferences

### Decision Log

Every `decisions_resolved` entry from every specialist is stored as a flat list of decision objects:

```ts
{
  chat_id: string,
  pillar: CategorySlug,
  decision: string,
  chosen: string,
  rejected_alternatives: string[],
  rationale: string
}
```

This allows the UI to render a "Why this?" panel for any service in the output — the user can drill into the reasoning without re-running the pipeline. It also provides a training signal: if a user manually overrides a decision, that override is a labelled example of where the agent's reasoning diverged from a human expert's judgment.

---

## Summary of Design Principles

1. **Requirements before retrieval.** No service is considered until the requirements are captured. No retrieval query is written until the architectural pattern is selected.

2. **Patterns before services.** Services are the implementation of a pattern. Selecting services without first selecting a pattern produces a bag of components, not an architecture.

3. **Agents do the reasoning; RAG provides the knowledge.** Retrieval is a tool that agents call with precise, context-grounded queries. It is not the control flow of the system.

4. **Dependency order is explicit.** Wave 1 specialists (compute, storage, database, analytics, ai_ml, integration_messaging, migration_hybrid) run in parallel because their decisions are independent. Wave 2 specialists (networking, devops, security_identity) run after Wave 1 because their correct answers are structurally determined by Wave 1's choices. Execution order encodes architectural dependency.

5. **Every recommendation is validated.** The Critic Agent catches integration gaps, constraint violations, and disproportionate complexity before the user sees anything.

6. **Decisions are first-class outputs.** The decision log is as important as the service list. An architecture without its reasoning is not reproducible and cannot be challenged or improved.

7. **Simplicity in retrieval, richness in reasoning.** Dense vector search with metadata filters is sufficient when queries are written by specialist agents. Retrieval complexity is traded for agent reasoning depth.
