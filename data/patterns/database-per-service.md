# Database per Service

## Description

The Database per Service pattern mandates that each microservice owns its own private data store, and no other service may access that database directly. All inter-service data access must go through the owning service's public API. This is a prerequisite for true microservice independence: shared databases create invisible coupling between services, preventing independent deployment, independent scaling, and independent technology choice.

Each service's database can use a different database technology optimised for that service's access pattern — a relational DB for the order service, a document store for the product catalog, a graph DB for the recommendation engine.

## When to Use

- Any microservices architecture where team autonomy and independent deployability are genuine requirements
- Preventing schema changes in one service from breaking other services (the core coupling risk of a shared DB)
- Allowing each service to choose the database type best suited to its access pattern (polyglot persistence)
- When services must be independently scalable — shared databases create a shared scaling bottleneck

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `database` | One database instance (or schema with strict access control) per service; technology choice per service's access pattern |
| `integration_messaging` | Cross-service data access via API calls or async events — never direct DB queries across service boundaries |
| `security_identity` | Each service's DB credentials are isolated — no shared credentials; per-service IAM roles for DB access |

## Structural Patterns Commonly Paired

| Pattern | Why |
|---|---|
| Saga | Cross-service transactions that span multiple databases require compensating transactions |
| Transactional Outbox | Reliable event publishing from a service's local DB without distributed locks |
| CQRS | Separating read and write models when a service's read and write loads are asymmetric |
| Anti-Corruption Layer | When a service must integrate with a legacy shared database during migration |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Independence** | Services deploy, scale, and evolve their schemas without coordinating with other teams |
| **Data consistency** | No cross-service ACID transactions — eventual consistency via Saga is the required alternative |
| **Cross-service queries** | Joining data across services requires API composition or materialised views — no SQL JOINs across service boundaries |
| **Infrastructure cost** | N services = N database instances — cost and management overhead increases linearly |
| **Data duplication** | Some data may be duplicated across services (e.g., product name denormalised into order records) |

## Common Pitfalls

- Sharing a database between services "just for now" — this permanent temporariness is the primary source of microservice coupling debt
- Allowing direct DB access via network credentials shared between services — use service APIs as the contract
- Not modelling the event schema carefully — the events between services are as important an API contract as the HTTP API
