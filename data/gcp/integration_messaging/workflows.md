---
cloud_provider: "GCP"
service_category: "integration_messaging"
service_name: "Workflows"
pricing_model: "per-request"
managed: true
tier: 2
---
## GCP Workflows

### Description
Google Cloud Workflows is a fully managed, serverless orchestration service for sequencing Google Cloud services, external HTTP APIs, and custom logic into reliable, stateful pipelines. Workflows are defined in YAML or JSON with named steps that are human-readable and machine-parseable, making them easy to visualise and audit. The service checkpoints execution state after every step to Cloud Spanner, so in-progress executions survive zone outages and can resume automatically. It supports configurable retry policies, timeouts, and custom error handling for failures in downstream services, and can wait on asynchronous operations via polling or HTTP callbacks for up to one year. Workflows integrates natively with Eventarc for event-driven triggers, with Cloud Scheduler for cron-driven runs, and has built-in connectors for Google Cloud services (BigQuery, Cloud Storage, Pub/Sub, etc.) that handle request formatting and long-running operation polling automatically. The pricing model is pay-per-step with a generous always-free tier, and there is no infrastructure to provision or maintain.

### Use Cases
* Microservice and API orchestration (e.g., chaining Document AI processing, a Cloud Function approval check, and a Firestore write into a sequential, observable receipt-processing flow)
* Business process automation (e.g., orchestrating order fulfillment — inventory check, warehouse shipment request, customer notification — with human-in-the-loop callbacks waiting up to 30 days for delivery confirmation)
* Data and ML pipelines (e.g., scheduling a recurring BigQuery export, transformation job, and Vertex AI batch prediction pipeline using Cloud Scheduler integration and BigQuery connectors)
* IT process automation (e.g., monthly IAM permission compliance sweep: iterating resources, requesting approval renewals via Cloud Function callbacks, and revoking unrenewed access after a timeout)
* Event-driven processing (e.g., triggering a Workflows execution via Eventarc when a file lands in Cloud Storage, then orchestrating multi-step validation and enrichment before storing results in Firestore)
* Error-resilient service integration (e.g., calling an unreliable third-party API with exponential-backoff retry and custom error handling that routes failures to a dead-letter notification step)
