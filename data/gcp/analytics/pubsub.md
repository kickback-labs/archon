---
cloud_provider: "GCP"
service_category: "analytics"
service_name: "Pub/Sub"
pricing_model: "per-request"
managed: true
tier: 1
---
## GCP Pub/Sub

### Description
Pub/Sub is GCP's fully managed, globally distributed messaging service for real-time event ingestion and delivery. It implements a publisher-subscriber model where messages are published to topics and delivered to subscriber applications via pull or push subscriptions. The service requires no capacity planning — it auto-scales with no partitions, provides synchronous cross-zone message replication for at-least-once delivery, and supports in-order delivery per key at scale. Pub/Sub integrates natively with Dataflow for exactly-once stream processing, BigQuery for direct message ingestion into tables, and Cloud Storage for archival. It is HIPAA-compliant with end-to-end encryption and fine-grained IAM access controls. Pricing is based on monthly data volume with the first 10 GB free.

### Use Cases
* Real-time event ingestion from web, mobile, IoT devices, or application logs as the entry point for streaming analytics pipelines that feed BigQuery or data lakes via Dataflow
* Asynchronous decoupling of microservices — publishers emit events to topics without knowing who will consume them; push subscriptions deliver events to Cloud Run, Cloud Functions, App Engine, or GKE webhooks
* Fan-out broadcasting — a single published message is delivered to multiple independent subscriber applications simultaneously (e.g., audit, processing, and archival systems)
* Replay and reprocessing — seek subscriptions back to a snapshot or point in time to reprocess historical messages without re-publishing (messages retained up to 7 days by default)
* IoT data collection — ingesting telemetry from millions of connected devices at global scale with automatic load balancing, then routing to Dataflow or BigQuery for analysis
