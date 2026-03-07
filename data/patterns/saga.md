# Saga

## Description

The Saga pattern manages distributed transactions across multiple microservices, each with its own database. Because two-phase commit (2PC) locks rows across service boundaries and introduces crippling latency and availability bottlenecks, Sagas replace it with a sequence of local transactions. Each step in the saga completes a local database transaction and either emits an event or command to trigger the next step. If any step fails, the saga executes a series of compensating transactions to logically undo the preceding steps, achieving eventual consistency.

There are two implementation variants with different trade-offs:

### Saga Choreography

Services communicate via domain events. Service A completes its local transaction and publishes an event; Service B subscribes to that event and executes its step. No central coordinator exists — each service reacts to events from others.

**Best for:** Small number of services, teams that want maximum decoupling, simple transaction flows.

### Saga Orchestration

A dedicated orchestrator service centrally manages the saga. It commands each participating service to execute its step and tracks the global state machine. If a step fails, the orchestrator commands compensating transactions in reverse order.

**Best for:** Complex transactions with many steps, strict sequencing requirements, the need for centralised monitoring and timeout management.

## When to Use

- Distributed transactions spanning multiple microservices, each owning its own database
- ACID transactions across service boundaries are not acceptable (too much latency or availability impact)
- Business processes that have a natural sequence of steps with clearly defined compensating actions for each step
- Any e-commerce checkout, financial transfer, booking system, or multi-step workflow in a microservices context

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `database` | Each participating service's local database; saga state persisted in orchestrator's DB (orchestration variant) |
| `integration_messaging` | Event bus or message queue for inter-service coordination (Choreography: SNS/SQS, EventBridge, Pub/Sub; Orchestration: Step Functions, Durable Functions, Temporal) |
| `compute` | Orchestrator service (orchestration variant); event-processing functions per service (choreography variant) |
| `devops` | Saga monitoring, dead-letter queues for failed steps, compensation audit logging |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Consistency** | Eventual consistency, not immediate — the system is transiently inconsistent between steps |
| **Complexity** | Compensating transactions must be designed for every step — some business operations are not easily reversible |
| **Idempotency** | All saga steps and compensations must be idempotent — messages may be delivered more than once |
| **Choreography** | High decoupling but complex event flows that are hard to trace in large sagas |
| **Orchestration** | Easy to monitor and debug but the orchestrator is a potential single point of failure and bottleneck |

## Common Pitfalls

- Not designing compensating transactions — if a saga cannot be rolled back, partial failures leave the system in an inconsistent state permanently
- Not making saga steps idempotent — at-least-once delivery means duplicate execution must be handled
- Using choreography for sagas with more than 5–6 steps — the event flow becomes impossible to reason about
- Not persisting saga state durably — if the orchestrator crashes mid-saga, it must be able to resume
