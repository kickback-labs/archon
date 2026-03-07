# Patterns Context — Agent Quick Reference

This file is a consolidated reference for the Pattern Agent. It lists every known architectural pattern, its category, and the precise conditions under which it should be selected. Use this table to map user requirements to one or more patterns before any service selection begins.

> **Usage note:** Patterns are not mutually exclusive. A production system commonly combines patterns from multiple categories (e.g., a Serverless event-driven compute layer + CQRS data layer + Warm Standby DR + Zero Trust security). Select the patterns that are structurally implied by the requirements, then derive the implied pillars from that selection.

---

## Compute Paradigms

| Pattern | When to Use | Detail File |
|---|---|---|
| Monolithic (PaaS-hosted) | Small team, early stage, low domain complexity, fast time-to-market required. | `monolithic-paas.md` |
| Container Microservices | High team expertise, need for independent scalability per service, complex domain with clear bounded contexts, large engineering organisation. | `container-microservices.md` |
| Serverless Event-Driven | Bursty or unpredictable traffic, low operational overhead required, cost-sensitive, small team, no sustained baseline load. | `serverless-event-driven.md` |

---

## Deployment Archetypes

| Pattern | When to Use | Detail File |
|---|---|---|
| Zonal Deployment | Development/test environments, non-critical internal tools, low-latency component coupling required within a single facility. | `zonal-deployment.md` |
| Regional Deployment | High availability within a single geography, data sovereignty or residency constraints, cost-balanced resilience needed. | `regional-deployment.md` |
| Multi-Regional Deployment | Geographically dispersed users, strict low-latency requirements globally, regional disaster resilience required. | `multi-regional-deployment.md` |
| Global Deployment | Massive-scale applications requiring location-unaware routing and near-zero recovery time across any failure domain. | `global-deployment.md` |
| Hybrid / Multi-Cloud | Compliance mandates keeping sensitive data on-premises, existing on-prem investment, provider diversity requirement, best-of-breed service selection across vendors. | `hybrid-multi-cloud.md` |

---

## Microservices — Structural & Reliability

| Pattern | When to Use | Detail File |
|---|---|---|
| Strangler Fig | Gradual legacy system modernisation, zero-downtime migration, de-risking large rewrites by replacing functionality incrementally. | `strangler-fig.md` |
| Sidecar | Standardising cross-cutting concerns (logging, mTLS, distributed tracing, proxy routing) uniformly across polyglot microservices. | `sidecar.md` |
| Anti-Corruption Layer | Integrating a clean-architecture microservice with a legacy system whose data model or API would otherwise pollute the new service's domain model. | `anti-corruption-layer.md` |
| Circuit Breaker | Protecting distributed systems from cascading failures caused by downstream service latency, partial outages, or dependency exhaustion. | `circuit-breaker.md` |
| Scatter-Gather | Aggregating data from multiple independent backend services simultaneously to serve a single client request with minimum latency. | `scatter-gather.md` |

---

## Distributed Data & Transactions

| Pattern | When to Use | Detail File |
|---|---|---|
| Database per Service | High team autonomy required, strict domain boundaries enforced, preventing schema coupling across services. | `database-per-service.md` |
| Saga (Choreography) | Small number of services involved in a distributed transaction, avoiding a central orchestrator bottleneck, accepting more complex event tracing. | `saga.md` |
| Saga (Orchestration) | Complex distributed transactions requiring centralised state tracking, timeout management, and strict sequencing across many services. | `saga.md` |
| Transactional Outbox | Guaranteeing at-least-once message delivery to an event broker without a distributed lock — solving the dual-write problem. | `transactional-outbox.md` |
| Event Sourcing & CQRS | Strict audit trails or regulatory compliance required, complex read/write asymmetry, need to rebuild system state from historical events. | `event-sourcing-cqrs.md` |
| Sharding | Relational or NoSQL database write-throughput or storage limits exceeded; horizontal scaling of a massive dataset required. | `sharding.md` |

---

## Analytics, Data & Streaming

| Pattern | When to Use | Detail File |
|---|---|---|
| Data-Intensive / Lakehouse | Analytics-primary workloads, ML training pipelines, large structured or semi-structured data volumes requiring both BI and data science access. | `lakehouse.md` |
| Medallion Architecture | Structuring a data lakehouse into progressive quality tiers: Bronze (raw ingest), Silver (cleansed), Gold (business-ready aggregates). | `medallion-architecture.md` |
| Data Mesh | Eliminating centralised data engineering bottlenecks by distributing data ownership to autonomous business domains. | `data-mesh.md` |
| Data Fabric | Unifying data access across highly fragmented, multi-cloud or hybrid environments via automated metadata-driven virtualisation. | `data-fabric.md` |
| Real-Time Streaming | Sub-second event processing required — IoT telemetry, financial tick data, real-time fraud detection, live analytics dashboards. | `real-time-streaming.md` |

---

## AI & Machine Learning

| Pattern | When to Use | Detail File |
|---|---|---|
| MLOps CI/CD/CT Pipeline | Automating the full ML lifecycle: training, testing, deployment, and continuous drift-triggered retraining of production models. | `mlops-pipeline.md` |
| ML Inference Platform | Serving trained models at scale — real-time synchronous predictions or massive-scale asynchronous batch scoring with GPU acceleration. | `ml-inference-platform.md` |
| Vector RAG | Fast semantic similarity search across large unstructured text corpora (documents, wikis, PDFs) to ground LLM responses in proprietary context. | `rag.md` |
| Graph RAG | Answering multi-hop queries that require precise reasoning over explicit entity relationships — regulatory graphs, org structures, knowledge bases. | `rag.md` |
| Hybrid RAG | Maximising both retrieval speed and relational accuracy by combining vector similarity search with graph-based context enrichment. | `rag.md` |

---

## Agentic AI

| Pattern | When to Use | Detail File |
|---|---|---|
| Tool-Based Agent | Enabling an LLM to interact with external systems, APIs, databases, or action endpoints to retrieve live data or trigger side effects. | `tool-based-agent.md` |
| Orchestrator-Worker | Routing ambiguous, multi-domain queries to a coordinated team of specialised narrow-scope AI worker agents managed by a central orchestrator. | `orchestrator-worker.md` |
| Sequential / Prompt Chaining | Executing rigid, predictable, multi-step business logic where the output of each AI step is the exact input to the next — maximising interpretability. | `sequential-prompt-chaining.md` |
| Swarm / Parallel | Accelerating complex analysis by dispatching multiple independent agents simultaneously across different facets of a problem. | `swarm-parallel.md` |
| Reflection / Iterative Refinement | Enforcing strict accuracy, safety, and policy compliance via an autonomous generation-and-critique feedback loop before output is surfaced to users. | `reflection-iterative-refinement.md` |

---

## Network, Edge & Integration

| Pattern | When to Use | Detail File |
|---|---|---|
| Hub-and-Spoke | Centralised network security inspection, simplified hybrid routing, managing large multi-account or multi-VPC cloud footprints. | `hub-and-spoke.md` |
| Full Mesh / Direct Peering | Ultra-low latency, high-throughput inter-VPC communication where routing through a firewall is prohibitive (e.g., database replication between select VPCs). | `full-mesh-direct-peering.md` |
| Service Mesh | Managing complex synchronous HTTP/gRPC routing, zero-trust mTLS enforcement, and deep observability within a Kubernetes environment. | `service-mesh.md` |
| Event Mesh | Routing asynchronous event-driven traffic seamlessly across diverse cloud regions, legacy on-premises systems, and edge devices. | `event-mesh.md` |
| Edge Gateway | Translating legacy industrial OT protocols to cloud-native formats, executing local ML inference, and buffering telemetry under intermittent connectivity. | `edge-gateway.md` |

---

## Resilience, DR & Governance

| Pattern | When to Use | Detail File |
|---|---|---|
| Backup and Restore | Non-critical workloads, lowest infrastructure cost required, high RTO/RPO tolerance acceptable. | `backup-and-restore.md` |
| Pilot Light | Balancing cost and recovery speed — databases replicate continuously but compute stays off until a disaster event triggers scale-up. | `pilot-light.md` |
| Warm Standby | Rapid RTO (minutes) required; a fully functional but scaled-down environment stays live and scales out instantly on failover. | `warm-standby.md` |
| Multi-Site Active-Active | Mission-critical workloads demanding near-zero RTO and RPO; justifies running full production stacks simultaneously across multiple regions. | `multi-site-active-active.md` |
| Zero Trust | Defending against lateral movement threats in distributed cloud environments; every inter-service request must be authenticated and authorised. | `zero-trust.md` |
| FinOps Batch Loading | Reducing cloud billing by converting expensive real-time streaming pipelines to scheduled, off-peak batch processing for non-urgent workloads. | `finops-batch-loading.md` |
| Carbon-Aware Scheduling | Reducing carbon footprint by deferring flexible long-running workloads (ML training, ETL) to execute during peak renewable energy availability. | `carbon-aware-scheduling.md` |
