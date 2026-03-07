---
cloud_provider: "GCP"
service_category: "integration_messaging"
service_name: "Cloud Tasks"
pricing_model: "per-request"
managed: true
tier: 2
---
## GCP Cloud Tasks

### Description
Cloud Tasks is a fully managed service for asynchronously dispatching and reliably delivering a large volume of distributed task executions outside of the synchronous request path. Producers enqueue tasks into named queues; Cloud Tasks handles scheduling, rate limiting, retry with configurable back-off, and de-duplication, then dispatches each task to an HTTP endpoint (any publicly reachable URL or an App Engine handler). This decouples the producer from the execution environment and prevents slow or unreliable downstream services from affecting user-facing latency. Queue-level controls allow operators to set maximum dispatch rates, maximum concurrent dispatches, and per-task retry limits, making it straightforward to throttle traffic against rate-limited third-party APIs. Cloud Tasks is a natural complement to Cloud Run, App Engine, and Cloud Functions as the execution target, and it pairs with Cloud Scheduler for cron-triggered task injection. Compared to Pub/Sub, Cloud Tasks provides explicit task targeting (to a specific endpoint), individual task visibility and management, and precise delivery-rate control — making it preferable when you need guaranteed single-consumer delivery and per-task control rather than fan-out messaging.

### Use Cases
* Offloading slow work from the request path (e.g., a web handler enqueues an image processing task to Cloud Tasks immediately returning HTTP 200, while a Cloud Run service processes the image asynchronously)
* Rate-controlled dispatch to throttled APIs (e.g., fanning out thousands of tasks to a queue configured to dispatch at a rate the downstream third-party API can sustain without hitting quota limits)
* Reliable background job execution with retries (e.g., sending transactional emails via an external provider with automatic exponential-backoff retries if the provider is temporarily unavailable)
* Scheduled and deferred task execution (e.g., scheduling a task with a future scheduled time to send a payment reminder 24 hours after an invoice is issued)
* App Engine task queue modernisation (e.g., migrating legacy App Engine push queues to Cloud Tasks HTTP target queues backed by Cloud Run for workload portability)
* Distributed work fan-out with controlled concurrency (e.g., splitting a bulk data export into per-record tasks and using queue concurrency limits to avoid overwhelming a downstream database)
