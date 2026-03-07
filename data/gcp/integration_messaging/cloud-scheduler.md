---
cloud_provider: "GCP"
service_category: "integration_messaging"
service_name: "Cloud Scheduler"
pricing_model: "per-request"
managed: true
tier: 3
---
## GCP Cloud Scheduler

### Description
Cloud Scheduler is a fully managed, enterprise-grade cron job service that lets you reliably schedule and execute recurring tasks at defined times or regular intervals using standard Unix-cron format. Each job dispatches a request to one of three supported target types: an HTTP/S endpoint, a Pub/Sub topic, or an App Engine HTTP application. Cloud Scheduler guarantees "at least once" delivery semantics per scheduled execution, meaning targets should be designed to be idempotent to handle rare cases of duplicate delivery. Failed jobs are retried automatically with exponential backoff according to a configurable retry policy, including maximum retry duration, minimum/maximum backoff intervals, and maximum retry count. Cloud Scheduler is a regional service; HTTP/S and Pub/Sub targets are available in all supported Cloud Scheduler regions, while App Engine targets are restricted to the project's App Engine region. Authentication for HTTP targets supports OAuth 2.0 (service account tokens) and OIDC tokens, enabling secure invocation of authenticated Cloud Run, Cloud Functions, or other Google-signed endpoints. Scheduling is configured using the standard cron expression format with timezone support, making it straightforward to align jobs with business-hour windows in any time zone. Logs and execution results are visible in Cloud Logging, and Cloud Monitoring can be used to create alerting policies on job failure or missed executions. For complex conditional or branching job logic, Workflows or Cloud Composer are better choices; Cloud Scheduler excels at simple, time-triggered dispatching.

### Use Cases
* Scheduled HTTP endpoint calls (e.g., invoking a Cloud Run service every 10 minutes to refresh a cached dataset)
* Periodic Pub/Sub message publishing (e.g., publishing a trigger message to a Pub/Sub topic every hour to fan out to downstream subscribers)
* VM lifecycle management (e.g., starting and stopping Compute Engine VMs on a business-hours schedule to reduce costs)
* Scheduled Cloud Functions invocation (e.g., triggering a function nightly to process and archive log files from Cloud Storage)
* Periodic data export and backup (e.g., kicking off a Firebase Firestore export to Cloud Storage every 24 hours)
* Workflow triggering (e.g., invoking a Cloud Workflows execution on a weekly schedule via an HTTP target to the Workflows API)
* Report and notification dispatch (e.g., calling an email-sending service endpoint daily at 8 AM in a specified business timezone)
* Stale data cleanup (e.g., invoking an App Engine endpoint to purge expired session records from a database every 30 minutes)
* Batch job initiation (e.g., triggering a Dataflow pipeline via the Dataflow API HTTP endpoint on a nightly cron)
* Health check and watchdog pings (e.g., periodically calling an internal health check endpoint and alerting via Cloud Monitoring on failure)
