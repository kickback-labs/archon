# Real-Time Streaming

## Description

The Real-Time Streaming pattern continuously ingests, processes, and reacts to high-throughput event streams with sub-second latency. Rather than processing data in scheduled batch jobs after it comes to rest, streaming architectures process each event as it arrives — enabling immediate downstream reactions, live dashboard updates, real-time anomaly detection, and instant personalisation.

The backbone of streaming architectures is a distributed commit log or message broker: Apache Kafka (Amazon MSK, Confluent Cloud), Amazon Kinesis, Google Pub/Sub, or Azure Event Hubs. Stream processors (Apache Flink, Spark Structured Streaming, ksqlDB, Dataflow) consume from these brokers and apply transformations, aggregations, windowing, and enrichment in real time.

## When to Use

- Sub-second event processing is a business requirement — detecting fraud as a transaction occurs, not an hour later
- IoT telemetry ingestion at high volume and velocity (sensors, connected devices, fleet tracking)
- Financial market data: order book updates, trade execution, risk calculations
- Real-time personalisation and recommendation engines
- Live analytics dashboards where users expect data freshness in seconds, not minutes
- Event-driven microservices that must react immediately to domain events

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `integration_messaging` | Distributed message broker as the event backbone (Kafka/MSK, Kinesis, Pub/Sub, Event Hubs) |
| `analytics` | Stream processing engine for transformations, windowing, and aggregations (Flink, Dataflow, Spark Streaming, Kinesis Analytics) |
| `storage` | Output sinks for processed events (object storage for archival, time-series DB, operational DB, data lakehouse Bronze layer) |
| `compute` | Stream processor compute (managed: Kinesis Data Analytics, Cloud Dataflow; self-managed: Flink on EKS/GKE) |
| `database` | Low-latency read store for stream outputs (Redis, DynamoDB, Cassandra, Bigtable) to serve real-time queries |
| `devops` | Consumer lag monitoring, dead-letter queue management, schema registry (Confluent Schema Registry, Glue Schema Registry) |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Latency** | Sub-second to millisecond event processing — orders of magnitude faster than batch |
| **Complexity** | Stateful stream processing, watermarking, exactly-once semantics, and schema evolution are significantly more complex than batch ETL |
| **Cost** | Streaming infrastructure runs 24/7 — more expensive than batch for equivalent data volumes |
| **Ordering** | Strict global event ordering is hard at scale; partition-level ordering is achievable |
| **Exactly-once** | Achieving exactly-once processing semantics requires careful configuration of both the broker and the processor |

## Common Pitfalls

- Using streaming when batch would suffice — streaming infrastructure is expensive and complex; if hourly batch meets the latency requirement, use batch
- Not designing for consumer lag — a slow consumer that falls behind a fast producer can cause unbounded lag, eventually causing the broker to drop events or the consumer to OOM
- Ignoring schema evolution — stream schemas change over time; a schema registry with backward/forward compatibility is essential from day one
- Not implementing dead-letter queues — malformed or unprocessable events must be captured and investigated, not silently dropped
