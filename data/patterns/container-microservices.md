# Container Microservices

## Description

The container microservices pattern decomposes an application into a set of small, independently deployable services, each responsible for a single business domain. Every service runs in its own container, owns its own data store, and communicates with other services via well-defined APIs (typically REST or gRPC) or asynchronous messages. Container orchestration platforms — Amazon EKS, Azure AKS, or Google GKE — handle scheduling, health checking, rolling deployments, and horizontal scaling of individual services.

This pattern delivers independent scalability, polyglot flexibility, and strong fault isolation — but at the cost of significant operational complexity. It is the correct choice when the business domain is complex enough that Conway's Law dictates separate teams, and those teams have the expertise to operate distributed systems.

## When to Use

- Large engineering organisation where separate teams own distinct business domains
- Independent scalability is required per service (e.g., checkout must scale independently of the catalog)
- Complex domain with clear bounded contexts (DDD applies)
- High cloud and Kubernetes operational expertise in the team
- Long-lived product where independent deployability across many services justifies the operational investment

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Kubernetes-managed containers (EKS, AKS, GKE); each service independently scaled |
| `database` | Database per service — each service owns its own store (relational, NoSQL, cache as needed) |
| `networking` | Service-to-service routing, ingress controller, internal load balancing, VPC/VNet segmentation |
| `security_identity` | mTLS between services, per-service IAM roles (IRSA/Workload Identity), secrets management |
| `integration_messaging` | Async communication between services via message queues or event streams (SQS, Pub/Sub, EventBridge) |
| `devops` | Per-service CI/CD pipelines, distributed tracing, centralised logging, per-service APM |

## Structural Patterns Commonly Paired

| Pattern | Why |
|---|---|
| Database per Service | Enforces loose coupling at the data layer |
| Circuit Breaker | Protects services from cascading failures on sync calls |
| Sidecar | Standardises mTLS, observability, and proxy config across polyglot services |
| Saga (Orchestration or Choreography) | Manages distributed transactions across service boundaries |
| Service Mesh (Istio / Linkerd) | Manages synchronous routing, zero-trust mTLS, and observability at the platform level |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Independent scaling** | Each service scales to its own load curve — highly efficient at scale |
| **Operational overhead** | Distributed tracing, service discovery, multi-pipeline CI/CD, Kubernetes expertise required |
| **Network latency** | Inter-service calls add latency vs. in-process function calls in a monolith |
| **Data consistency** | No cross-service ACID transactions; eventual consistency via Saga is the norm |
| **Polyglot** | Each service can use the best language and runtime for its domain |

## Scaling Ceiling & Break-Even Points

- This pattern pays off when the team is large enough that the coordination overhead of a monolith exceeds the operational cost of microservices
- Typically appropriate at 10+ engineers with distinct domain teams
- Not appropriate for solo developers or small teams regardless of traffic volume

## Common Pitfalls

- Splitting services too granularly too early — nano-services create chatty network traffic and amplify latency
- Sharing a database across services — defeats all the isolation benefits
- Underestimating Kubernetes operational burden for teams without prior experience
- Not implementing distributed tracing from day one — debugging failures across 20 services without it is extremely difficult
