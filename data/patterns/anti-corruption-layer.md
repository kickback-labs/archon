# Anti-Corruption Layer

## Description

The Anti-Corruption Layer (ACL) is an isolation pattern that prevents a new, cleanly designed microservice from being contaminated by the data model, semantics, or API conventions of a legacy system it must integrate with. The ACL acts as a translation boundary: it converts requests from the new service's domain model into formats the legacy system understands, and converts legacy responses back into the new service's clean domain model.

The pattern is a direct application of Domain-Driven Design's concept of context mapping — explicitly acknowledging that two bounded contexts have different models and refusing to let one corrupt the other.

## When to Use

- Integrating a new clean-architecture microservice with a legacy system whose data model or API design would pollute the new service's domain
- Migrating off a legacy system incrementally — the ACL bridges the two systems during the transition period
- Consuming third-party APIs with awkward or unstable schemas — the ACL insulates the core domain from external model changes
- When two microservices have overlapping but semantically different concepts (e.g., "customer" in the billing context vs. "user" in the identity context)

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | The ACL is typically a lightweight translation service (microservice, Lambda, or in-process adapter layer) |
| `integration_messaging` | If the integration is asynchronous, the ACL consumes legacy events and re-publishes domain events |
| `networking` | API gateway may host the ACL as a request/response transformation layer |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Domain purity** | New service's domain model remains clean and free of legacy technical debt |
| **Maintenance overhead** | The ACL must be maintained as both the legacy system and the new service evolve |
| **Latency** | Adds a translation hop to every cross-boundary call |
| **Explicit boundary** | Makes the integration boundary explicit and testable — a significant observability and testing advantage |

## Common Pitfalls

- Building an ACL that is too thin — if the legacy model leaks through the translation, the ACL provides no protection
- Not versioning the ACL's interface — changes to either side break the translation silently
- Using an ACL as a permanent substitute for actually cleaning up the legacy data model
