# Event Sourcing & CQRS

## Description

**Event Sourcing** stores state not as a current snapshot but as an append-only log of immutable domain events (e.g., `OrderPlaced`, `PaymentProcessed`, `OrderShipped`). The current state of any entity is derived by replaying its event history. This provides a complete, unalterable audit trail, time-travel capability (reconstruct state at any point in time), and the ability to derive new projections from historical events retroactively.

**Command Query Responsibility Segregation (CQRS)** physically separates the write model (commands that mutate state) from the read model (queries that return data). In an event-sourced system, this is almost always paired because replaying events to answer every read query is computationally prohibitive — instead, events are projected into fast, denormalised read models optimised for specific query patterns.

The two patterns are complementary: Event Sourcing is the write side; CQRS materialises the write side's events into optimised read projections.

## When to Use

- Strict audit trails or regulatory compliance requiring an unalterable history of every state change (financial, healthcare, legal)
- Complex domain logic where the history of how the system arrived at its current state is as important as the state itself
- Systems requiring time-travel queries — reconstruct what the system looked like at any past point in time
- Highly asymmetric read/write loads — CQRS allows the read and write sides to scale entirely independently
- Event replay to build new read projections retroactively from historical data

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `database` | Append-only event store (EventStoreDB, Kafka as durable log, DynamoDB Streams, Cosmos DB) for the write side; separate read databases (Elasticsearch, Redis, PostgreSQL read replicas) for query projections |
| `integration_messaging` | Event bus propagates domain events from the write side to projection builders |
| `compute` | Projection builders (stream processors or Lambda functions) consume events and update read models |
| `devops` | Event schema versioning, projection rebuild tooling, event store backup and replay testing |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Audit trail** | Complete, immutable history is a first-class output — no data is ever overwritten |
| **Complexity** | Significantly more complex than CRUD — event schema design, projection management, and eventual consistency must all be handled |
| **Eventual consistency** | Read models lag behind the write side — queries may see slightly stale data |
| **Event schema evolution** | Immutable events must be carefully versioned — schema changes require upcasting strategies |
| **Scalability** | Read and write sides scale independently — each optimised for its own load profile |

## Common Pitfalls

- Using Event Sourcing for simple CRUD domains — the complexity is only justified when audit trail or event replay are genuine requirements
- Not versioning event schemas from day one — migrating an event store with no schema versioning strategy is extremely painful
- Building projections that are too coarse or too fine — projection granularity is a critical design decision
- Not testing projection rebuilds — a projection that cannot be rebuilt from the event log is broken
