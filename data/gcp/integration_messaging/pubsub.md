---
cloud_provider: "GCP"
service_category: "integration_messaging"
service_name: "Pub/Sub"
pricing_model: "per-request"
managed: true
tier: 1
---
## GCP Pub/Sub

### Description
Google Cloud Pub/Sub is a fully managed, globally distributed messaging service that serves as the primary event backbone for decoupled, event-driven architectures on GCP. In the integration context, Pub/Sub acts as the asynchronous glue between services — publishers emit events to topics without knowledge of consumers, and subscribers (Cloud Run, Cloud Functions, GKE workloads, Eventarc triggers, or any HTTP endpoint via push subscriptions) consume independently at their own pace. It provides at-least-once delivery, automatic scaling without partition management, and dead-letter topics for undeliverable messages. Pub/Sub integrates directly with Eventarc to route Google Cloud and third-party events to serverless targets, and with Workflows for event-driven orchestration. Message ordering per key and subscription filters allow fine-grained routing without additional broker logic.

### Use Cases
* Asynchronous microservice decoupling (e.g., an order service publishes "order.placed" events consumed independently by inventory, billing, and notification services with no direct coupling)
* Event-driven serverless triggers (e.g., a Pub/Sub push subscription invoking a Cloud Run service whenever a new file lands in Cloud Storage or a Firestore document changes)
* Dead-letter handling for reliability (e.g., routing undeliverable messages to a dead-letter topic after N retries, then processing failures separately without blocking the main consumer)
* Routing Google Cloud and third-party events via Eventarc (e.g., Eventarc publishing Audit Log events to a Pub/Sub topic that triggers a Cloud Function for compliance processing)
* Cross-service fan-out without tight coupling (e.g., a single "user.signup" event delivered simultaneously to fraud detection, welcome email, and CRM sync services via separate subscriptions on the same topic)
