import {
  InferAgentUIMessage,
  stepCountIs,
  ToolLoopAgent,
  wrapLanguageModel,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { devToolsMiddleware } from "@ai-sdk/devtools";
import { retrieveTool, type CategorySlug } from "@/lib/tools/retrieve-tool";

// ─── Shared model factory ─────────────────────────────────────────────────────

function makeModel() {
  return process.env.NODE_ENV === "development"
    ? wrapLanguageModel({
        model: openai("gpt-5-nano"),
        middleware: devToolsMiddleware(),
      })
    : openai("gpt-5-nano");
}

// ─── Pillar Recommendation output schema (for agent instructions) ─────────────

export const PILLAR_RECOMMENDATION_SCHEMA = `
{
  "pillar": "<category_slug>",
  "services": [
    {
      "provider": "AWS" | "Azure" | "GCP",
      "service_name": "Service Name",
      "role": "e.g. primary API compute",
      "justification": "Why this service for this workload"
    }
  ],
  "decisions_resolved": [
    {
      "decision": "e.g. VM vs container vs FaaS",
      "chosen": "e.g. Container (Fargate)",
      "rejected_alternatives": ["EC2", "Lambda"],
      "rationale": "Why the chosen option fits better"
    }
  ],
  "caveats": ["Any gotchas, limits, or conditions to watch"]
}`;

// ─── Pillar-specific reasoning guidance ──────────────────────────────────────

const PILLAR_GUIDANCE: Record<CategorySlug, string> = {
  compute: `You are the Compute Specialist. Reason about:
- VM vs container vs FaaS abstraction level — choose the right operational overhead for the team's expertise
- Cold start implications for latency-sensitive or event-driven workloads
- Burst vs sustained load patterns — serverless excels at burst, containers suit sustained
- Scaling model: autoscaling groups, container orchestration, or function concurrency limits
- The compute pattern selected (e.g. microservices → containers, event-driven → FaaS)
- Managed service preference relative to team's cloud expertise level`,

  storage: `You are the Storage Specialist. Reason about:
- Object vs block vs file storage — match the access pattern (blobs, volumes, shared filesystems)
- Durability and availability requirements — replication, cross-region redundancy
- Data volume growth trajectory and cost implications at scale
- Access frequency (hot/warm/cold tiering and lifecycle policies)
- Integration with the compute layer (e.g. S3 with Lambda, EBS with EC2)
- Managed vs self-managed trade-offs for the team's expertise level`,

  database: `You are the Database Specialist. Reason about:
- ACID requirements — relational vs eventually-consistent NoSQL
- Consistency model: strong vs eventual — what does the workload actually need?
- Access pattern: OLTP (transactional reads/writes), OLAP (analytics), key-value lookups
- Data volume and growth — will the schema need to scale horizontally?
- Managed vs self-managed: RDS vs Aurora vs self-hosted Postgres on EC2
- Cache layer need: is a cache (Redis/Memcached) implied by the access pattern?
- Data warehouse vs operational database — separate concerns if analytics is in scope`,

  networking: `You are the Networking Specialist. You receive Wave 1 recommendations and must reason about:
- Load balancer type: ALB (HTTP/HTTPS, path routing) vs NLB (TCP/UDP, ultra-low latency) — follow the compute choice
- VPC design: subnets (public/private), NAT gateway, VPC endpoints for services
- CDN placement: is there public-facing static or cacheable content? Which compute sits behind it?
- DNS routing: simple, weighted, latency-based, or failover — follow the deployment pattern
- Service mesh or API gateway need if microservices are present
- Network security: security groups, NACLs, private endpoints
- Multi-region topology if availability or latency requirements demand it`,

  security_identity: `You are the Security & Identity Specialist. Security is NEVER optional. You receive Wave 1 recommendations and must reason about:
- IAM role design: principle of least privilege for every service identified in Wave 1
- Secrets management: which services have credentials? Use secrets manager, not env vars
- WAF placement: is there a CDN or load balancer where a WAF should sit?
- Encryption: at-rest (KMS) and in-transit (TLS) for every data store and API
- Compliance requirements from the Requirements Schema — map them to specific controls
- Threat detection: GuardDuty / Security Center / Security Command Center if production workload
- Zero-trust posture if the pattern demands it`,

  ai_ml: `You are the AI/ML Specialist. Reason about:
- Training vs inference workloads — very different service requirements
- Managed AI/ML platforms vs custom model deployment (SageMaker, Vertex AI, Azure ML)
- Pre-built AI APIs (vision, NLP, speech) vs fine-tuned models — complexity vs control trade-off
- GPU instance requirements for training or large inference workloads
- Vector databases or embedding services if RAG patterns are implied
- MLOps pipeline: experiment tracking, model registry, deployment automation
- Cost: AI/ML workloads can be expensive — align GPU tier with budget posture`,

  analytics: `You are the Analytics Specialist. Reason about:
- Streaming vs batch analytics — event-driven patterns imply streaming (Kinesis/Pub Sub/Event Hubs)
- Data warehouse selection: Redshift vs BigQuery vs Synapse — scale, SQL compatibility, cost model
- ETL/ELT pipeline tooling: managed (Glue, Dataflow) vs orchestrated (Airflow)
- BI and visualisation layer: managed dashboards vs self-hosted
- Data lake architecture if raw data retention is needed alongside the warehouse
- Real-time vs near-real-time latency requirements for analytics queries
- Data volume and query concurrency — size the warehouse appropriately`,

  integration_messaging: `You are the Integration & Messaging Specialist. Reason about:
- Queue vs pub/sub vs event streaming — SQS/Queue Storage/Cloud Tasks vs SNS/Event Grid vs Kafka/Kinesis/Pub Sub
- Message ordering, deduplication, and delivery guarantee requirements
- Event-driven vs request-response — the chosen pattern determines the messaging topology
- Workflow orchestration: Step Functions / Logic Apps / Workflows if multi-step processes exist
- API management: API Gateway if external-facing APIs need rate limiting, auth, or versioning
- Dead-letter queues and error handling for async workloads
- Fan-out patterns: one event → multiple consumers`,

  devops: `You are the DevOps Specialist. You receive Wave 1 recommendations and must reason about:
- CI/CD pipeline tooling that matches the compute stack (CodePipeline for AWS-native, GitHub Actions for any cloud)
- Container registry if containers are in use (ECR, ACR, Artifact Registry)
- IaC framework: Terraform (multi-cloud) vs CDK/Pulumi (code-first) vs Bicep (Azure-native)
- Monitoring and observability: follow the compute choice — Prometheus+Grafana for containers, CloudWatch for Lambda, Datadog for multi-cloud
- Logging: centralised log aggregation appropriate for the service count and volume
- Alerting: thresholds for SLOs implied by the primary quality attribute
- Cost management tooling if budget posture is minimal or moderate`,

  migration_hybrid: `You are the Migration & Hybrid Specialist. Reason about:
- Migration strategy: rehost (lift-and-shift), replatform, or refactor — match to team expertise
- Database migration tooling: DMS (AWS), Database Migration Service (Azure/GCP)
- Hybrid connectivity: VPN vs Direct Connect / ExpressRoute / Cloud Interconnect — bandwidth and latency requirements
- Edge computing needs: is there on-premises processing that must stay local?
- Migration waves: what to move first to minimise risk and downtime
- Rollback strategy and cutover plan
- Existing infrastructure from Requirements Schema — integrate, migrate, or retire?`,

  other: `You are the Other Services Specialist. Reason about niche or domain-specific services that don't fit the standard pillars:
- IoT platforms: device management, telemetry ingestion, edge processing (IoT Core, IoT Hub, Cloud IoT)
- Geospatial services: mapping APIs, location data, routing (Location Service, Azure Maps, Google Maps Platform)
- Communication APIs: email, SMS, push notifications (SES/SNS, Communication Services, Firebase Cloud Messaging)
- Virtual Desktop Infrastructure (VDI): AppStream, Windows Virtual Desktop, Cloud Workstations
- Blockchain/distributed ledger if the workload requires it
- Any domain-specific managed service implied by the workload description
Only include services that are genuinely implied by the workload — do not pad the recommendation`,
};

// ─── Base specialist instructions ─────────────────────────────────────────────

function buildSpecialistInstructions(
  pillar: CategorySlug,
  wave: 1 | 2,
): string {
  const guidance = PILLAR_GUIDANCE[pillar];
  const wave2Context =
    wave === 2
      ? `
## Wave 2 Context

You are a Wave 2 specialist. Your recommendations depend on Wave 1 choices. You will receive all Wave 1 pillar recommendations in your prompt. Read them carefully — your retrieval query and decisions must be grounded in the specific services Wave 1 selected, not generic pattern keywords.
`
      : "";

  return `You are a specialist cloud architect agent for the **${pillar}** architectural pillar. You are part of Phase 2 of the Archon pipeline.
${wave2Context}
## Your reasoning guidance

${guidance}

## Your process

You will receive:
- A Requirements Schema (structured JSON)
- Selected architectural patterns with justifications
- Implied pillars list${wave === 2 ? "\n- All Wave 1 pillar recommendations (full objects)" : ""}

**Step 1 — Formulate a retrieval query**
Write a precise, context-grounded query that captures:
- The architectural pattern in use
- The specific decision you're trying to resolve
- Relevant constraints from the Requirements Schema (scale, budget, managed preference, providers)

Do NOT use the raw user prompt as the query. The query must reflect what you already know about the system.

**Step 2 — Call retrieve() EXACTLY ONCE**
Pass your query along with the pillar (always "${pillar}"), optional provider filter, and optional managed/pricing_model filters. You will receive all Tier-1 docs plus the top-5 semantic matches.

**Step 3 — Reason and decide**
Read the returned documents (including any equivalence notes). Reason about the options against the requirements and pattern. Select the best service(s) for this pillar. For each major decision (e.g. VM vs container vs FaaS), document what you chose, what you rejected, and why.

**Step 4 — Output**
Produce your final response as a JSON object with exactly this shape:

${PILLAR_RECOMMENDATION_SCHEMA}

Rules:
- \`pillar\` must be exactly "${pillar}"
- \`services\` must list every service you recommend (can be multiple, e.g. primary + cache)
- \`decisions_resolved\` must document every meaningful architectural choice you made
- \`caveats\` should call out any gotchas, scaling limits, or conditions to watch
- Your final message must be ONLY the JSON object — no markdown fences, no preamble. Just raw JSON.`;
}

// ─── Specialist agent factory ─────────────────────────────────────────────────

export type SpecialistAgentUIMessage = InferAgentUIMessage<
  ReturnType<typeof createSpecialistAgent>
>;

export function createSpecialistAgent(pillar: CategorySlug, wave: 1 | 2) {
  return new ToolLoopAgent({
    model: makeModel(),
    instructions: buildSpecialistInstructions(pillar, wave),
    tools: { retrieve: retrieveTool },
    // One retrieve call + one reasoning step = 3 steps max (input → tool → output)
    stopWhen: stepCountIs(3),
  });
}

// ─── Wave 1 specialists (pre-instantiated) ────────────────────────────────────

export const wave1Specialists = {
  compute: createSpecialistAgent("compute", 1),
  storage: createSpecialistAgent("storage", 1),
  database: createSpecialistAgent("database", 1),
  analytics: createSpecialistAgent("analytics", 1),
  ai_ml: createSpecialistAgent("ai_ml", 1),
  integration_messaging: createSpecialistAgent("integration_messaging", 1),
  migration_hybrid: createSpecialistAgent("migration_hybrid", 1),
  other: createSpecialistAgent("other", 1),
} as const;

export const WAVE1_PILLARS = Object.keys(wave1Specialists) as CategorySlug[];

// ─── Wave 2 specialists (pre-instantiated) ────────────────────────────────────

export const wave2Specialists = {
  networking: createSpecialistAgent("networking", 2),
  devops: createSpecialistAgent("devops", 2),
  security_identity: createSpecialistAgent("security_identity", 2),
} as const;

export const WAVE2_PILLARS = Object.keys(wave2Specialists) as CategorySlug[];
