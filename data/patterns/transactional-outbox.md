# Transactional Outbox

## Description

The Transactional Outbox pattern solves the "dual-write" problem in event-driven microservices: a service must atomically update its database and publish a message to an event broker, but it cannot guarantee both succeed without a distributed transaction. If the DB write succeeds but the message publish fails, the event is lost. If the message is published before the DB write commits and the DB write then fails, a phantom event is produced.

The solution: within the same local database transaction as the business entity update, the service inserts the event payload into a dedicated `outbox` table. A separate relay process (CDC-based or polling-based) reads the outbox table and publishes events to the message broker, guaranteeing at-least-once delivery. The message broker then handles deduplication if needed.

## When to Use

- Any service in an event-driven architecture that must reliably publish events after a database mutation without a distributed lock
- When at-least-once message delivery must be guaranteed — even if the service crashes immediately after the DB commit
- Implementing Saga Choreography reliably — each saga step's event must be published atomically with the local DB transaction
- When you cannot afford to lose events and cannot use distributed transactions (2PC)

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `database` | The outbox table lives in the service's primary database; CDC or polling reads from it |
| `integration_messaging` | The relay publishes to the message broker (Kafka, SQS, Pub/Sub, EventBridge); broker handles subscriber fan-out |
| `devops` | Monitoring the outbox table for stuck/unprocessed rows; alerting on relay lag |

## Implementation Variants

| Variant | Mechanism | Trade-offs |
|---|---|---|
| **CDC (Change Data Capture)** | Debezium, AWS DMS, or native DB replication reads the outbox table's WAL and publishes events | Near-real-time, no polling overhead, but requires CDC infrastructure |
| **Polling relay** | A scheduled process queries the outbox for unpublished rows and publishes them | Simpler to deploy, but introduces polling latency and DB load |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Reliability** | Guarantees at-least-once event delivery — no lost events due to partial failures |
| **Latency** | Slight publication delay vs. synchronous publish (milliseconds for CDC, seconds for polling) |
| **Complexity** | Requires maintaining the outbox table schema and the relay process |
| **Ordering** | Events from the same outbox are published in insertion order — cross-partition ordering still requires care |

## Common Pitfalls

- Not making the message broker consumer idempotent — at-least-once delivery means consumers must handle duplicates
- Letting the outbox table grow unbounded — old processed rows must be cleaned up
- Using polling relay with too high a polling interval — creates unacceptable event latency for real-time use cases
