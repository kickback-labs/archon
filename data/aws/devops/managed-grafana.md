---
cloud_provider: "AWS"
service_category: "devops"
service_name: "Managed Grafana"
pricing_model: "subscription"
managed: true
tier: 2
---
## Amazon Managed Grafana

### Description
Amazon Managed Grafana is a fully managed service based on the open-source Grafana project that enables teams to visualize, analyze, and correlate operational data from multiple sources in unified dashboards. AWS handles all provisioning, scaling, patching, and maintenance of Grafana workspaces, eliminating the operational overhead of self-hosted Grafana servers. It integrates natively with AWS data sources including CloudWatch, Amazon Managed Service for Prometheus, AWS X-Ray, Amazon OpenSearch Service, AWS IoT SiteWise, and many third-party sources such as Datadog and Splunk — all queryable from a single pane of glass. Grafana workspaces are secured via AWS IAM Identity Center or SAML-based identity providers, and access is scoped per workspace using Grafana's built-in role model. The service scales automatically to support large container and IoT deployments. Pricing is per active editor or viewer user per month.

### Use Cases
* Unified observability across metrics, logs, and traces (e.g., correlating Prometheus container metrics with CloudWatch Logs and X-Ray traces in a single Grafana dashboard)
* Kubernetes and container monitoring (e.g., visualizing EKS cluster node and pod metrics from Amazon Managed Service for Prometheus alongside ECS service metrics from CloudWatch)
* IoT and edge device monitoring (e.g., displaying real-time sensor readings from AWS IoT SiteWise for a manufacturing floor)
* Collaborative incident response (e.g., multiple on-call engineers editing and sharing dashboards in real time during a production outage, with version history for rollback)
* Multi-account and multi-region observability (e.g., querying CloudWatch metrics from several AWS accounts across regions in a single Grafana workspace)
* Alerting on operational thresholds (e.g., configuring Grafana alert rules that page PagerDuty when a service's p99 latency exceeds 500 ms)
* Migration from self-managed Grafana (e.g., importing existing dashboard JSON and re-pointing data sources to eliminate Grafana server maintenance)
