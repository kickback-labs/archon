---
cloud_provider: "GCP"
service_category: "devops"
service_name: "Cloud Logging"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Cloud Logging

### Description
Cloud Logging is GCP's fully managed, real-time log management service that automatically collects, stores, searches, analyzes, and monitors log data from GCP services, Compute Engine VMs (via the Ops Agent), GKE, on-premises infrastructure, and other cloud providers. It supports structured logging and provides two query interfaces: the Logs Explorer for interactive log entry inspection with Logging Query Language (LQL), and Log Analytics for SQL-based aggregation and trend analysis with optional BigQuery integration. Log sinks can route log data to Cloud Storage, BigQuery, Pub/Sub, or other Cloud Logging buckets for long-term retention, archival, or third-party forwarding (e.g., Splunk, Datadog). Cloud Audit Logs capture admin activity, data access, and system events across all GCP services.

### Use Cases
* Centralized log aggregation across a GCP organization (e.g., using aggregated sinks at the organization level to route all project logs to a single Cloud Storage bucket or BigQuery dataset for compliance archiving)
* Security and compliance auditing (e.g., enabling Data Access audit logs and querying Cloud Audit Logs via Log Analytics to detect unauthorized access to sensitive resources)
* Operational troubleshooting (e.g., using the Logs Explorer to correlate GKE pod logs with trace data and error groups to diagnose latency spikes in a microservice)
* Log-based alerting (e.g., creating a log-based alerting policy that fires a notification when a critical error pattern appears in application logs)
* Streaming logs to third-party SIEM tools (e.g., routing logs to a Pub/Sub topic and consuming them with a Dataflow pipeline that forwards to Splunk or Datadog)
