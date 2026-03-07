---
cloud_provider: "GCP"
service_category: "integration_messaging"
service_name: "Eventarc"
pricing_model: "per-request"
managed: true
tier: 2
---
## GCP Eventarc

### Description
Eventarc is a fully managed event routing service that lets you build event-driven architectures on GCP without managing the underlying eventing infrastructure — no custom brokers, message buses, or delivery logic to operate. It is offered in two editions: Eventarc Standard (trigger-based, routes events from specific Google Cloud sources directly to a single destination) and Eventarc Advanced (a more powerful bus-based model with message buses, enrollments, and pipelines for complex multi-consumer and cross-project routing). Both editions support the CloudEvents 1.0 spec for portable event formats. Eventarc Standard can receive events from over 125 Google Cloud event sources via Cloud Audit Logs, from Pub/Sub topics directly, and from Cloud Storage object change notifications, then route them to Cloud Run, Cloud Run functions, GKE services, Workflows, and more. Eventarc Advanced adds a centralised event bus that decouples publishers from consumers, supports third-party event ingestion via Pub/Sub, and manages delivery, security, authorization, observability, and error-handling. Eventarc integrates tightly with Workflows to trigger multi-step orchestrations from events, making it the recommended event entry point for serverless event-driven pipelines on GCP.

### Use Cases
* Triggering serverless functions on GCP service events (e.g., an Eventarc trigger invoking a Cloud Run service whenever a Cloud Storage object is finalised, without any polling or manual Pub/Sub wiring)
* Audit-log-driven automation (e.g., routing Cloud Audit Log events for IAM policy changes to a Cloud Run security handler that validates the change and posts an alert to a Slack webhook)
* Multi-step workflow orchestration from events (e.g., an Eventarc trigger starting a Workflows execution when a new BigQuery job completes, chaining validation, notification, and archival steps)
* Cross-project and multi-consumer event distribution (e.g., using Eventarc Advanced bus to publish a "user.created" event that multiple consumer enrollments route to separate microservices in different projects)
* Third-party and custom event ingestion (e.g., publishing events from an external SaaS system via Pub/Sub into an Eventarc Advanced bus for routing to GCP-native destinations)
* Decoupled microservice communication (e.g., Cloud Run services emitting events to Eventarc rather than calling each other directly, improving resilience and enabling consumers to be added without modifying the producer)
