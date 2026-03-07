# Serverless Event-Driven

## Description

The serverless event-driven pattern uses Functions-as-a-Service (FaaS) — AWS Lambda, Azure Functions, or GCP Cloud Functions — as the compute primitive. Functions are stateless, ephemeral units triggered by discrete events: an HTTP request, a file upload, a queue message, a database change stream, or a scheduled timer. The cloud provider dynamically allocates and de-allocates execution environments; the operator never provisions or manages servers.

Because billing is per-invocation and per-millisecond of execution time, this pattern is uniquely cost-efficient for bursty or unpredictable workloads where a server-based architecture would pay for idle capacity. It is the lowest-operational-overhead compute pattern available — but its stateless, ephemeral nature requires careful architectural design for anything beyond simple request-response flows.

## When to Use

- Bursty, spiky, or highly unpredictable traffic patterns — including traffic that regularly drops to near-zero
- Cost-sensitive workloads where paying for idle compute is unacceptable
- Small team with limited operational expertise — no servers to patch, scale, or manage
- Event-driven workflows: file processing, webhook handlers, queue consumers, scheduled jobs
- Rapid prototyping or MVPs where time-to-first-deployment must be minimal

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | FaaS functions (Lambda, Azure Functions, Cloud Functions) as the execution unit |
| `integration_messaging` | Event sources and async connectors: SQS, SNS, EventBridge, Pub/Sub, Event Grid — the backbone of the event-driven flow |
| `storage` | Object storage for function artifacts and event payloads (S3, Azure Blob, GCS); also used as trigger source |
| `database` | Serverless-compatible databases preferred (DynamoDB, Firestore, Cosmos DB, Aurora Serverless) to match the scaling model |
| `networking` | API Gateway for HTTP-triggered functions; VPC integration when private resources are accessed |
| `security_identity` | Per-function IAM execution roles scoped to least privilege; secrets manager for credentials; API Gateway authorisers |
| `devops` | Deployment frameworks (SAM, Serverless Framework, Pulumi); distributed tracing (X-Ray, Application Insights); cold start monitoring |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Cold starts** | First invocation after idle has added latency (50ms–2s depending on runtime and VPC config) |
| **Statelessness** | Functions cannot hold in-memory state between invocations — external state stores required |
| **Execution limits** | Hard timeouts (Lambda: 15 min max), memory caps, concurrency limits per region |
| **Cost at sustained load** | At high sustained throughput, serverless becomes more expensive than container-based alternatives |
| **Observability** | Distributed traces across many functions require deliberate instrumentation from day one |
| **Vendor coupling** | FaaS APIs and event source bindings are provider-specific — portability is low |

## Scaling Ceiling & Break-Even Points

- **Cost crossover:** At sustained high RPS (typically >1000–5000 RPS continuously), containers or PaaS often become cheaper
- **Latency ceiling:** Not suitable for sub-10ms p99 latency requirements due to cold start variability
- **Execution ceiling:** Not suitable for long-running jobs exceeding provider timeout limits — use containers or batch compute instead

## Common Pitfalls

- Chaining functions synchronously — creates deeply nested call stacks with compounding latency and failure surface
- Ignoring cold start impact for latency-sensitive endpoints — use provisioned concurrency where needed
- Using serverless for long-running or stateful workflows without a proper orchestrator (Step Functions, Durable Functions, Workflows)
- Failing to scope IAM execution roles to least privilege — a single over-privileged function is a large blast radius
- Not setting concurrency limits — unbounded concurrency can exhaust downstream database connection pools
