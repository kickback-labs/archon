---
cloud_provider: "GCP"
service_category: "devops"
service_name: "Cloud Monitoring"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Cloud Monitoring

### Description
Cloud Monitoring is GCP's fully managed observability service for collecting, storing, and visualizing metrics, alerting, and uptime checking across Google Cloud resources, on-premises systems, and other cloud environments. It automatically ingests system metrics from virtually every GCP service and supports custom metrics via the Cloud Monitoring API and OpenTelemetry, as well as Prometheus metrics through Google Cloud Managed Service for Prometheus. Alerting policies can trigger notifications via email, PagerDuty, Slack, and other channels when metric thresholds are breached. Multi-project metrics scopes allow a single view across an entire organization's resources.

### Use Cases
* Alerting on infrastructure and application health (e.g., CPU utilization exceeding threshold on a Compute Engine fleet triggers a PagerDuty incident)
* Uptime and synthetic monitoring (e.g., HTTP/HTTPS/TCP endpoint probes and broken-link checkers to validate service availability from multiple regions)
* Custom application metrics (e.g., publishing business-level counters via OpenTelemetry SDK and charting them on a custom dashboard alongside GCP system metrics)
* Multi-project and hybrid-cloud observability (e.g., configuring a metrics scope to view metrics from multiple GCP projects and AWS CloudWatch in a single console)
* Prometheus workload monitoring on GKE (e.g., scraping Prometheus-instrumented pods without managing a self-hosted Prometheus server)
