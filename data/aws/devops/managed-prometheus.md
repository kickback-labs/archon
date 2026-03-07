---
cloud_provider: "AWS"
service_category: "devops"
service_name: "Managed Service for Prometheus"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Amazon Managed Service for Prometheus

### Description
Amazon Managed Service for Prometheus (AMP) is a fully managed, Prometheus-compatible monitoring service designed for containerized and cloud-native workloads. It ingests metrics using the standard Prometheus remote write protocol from self-managed Prometheus servers, the AWS Distro for OpenTelemetry (ADOT), and other compatible agents. AMP scales ingestion and query throughput automatically without capacity planning, maintaining consistent PromQL query response times even at millions of active time series. High availability is built in, with data replicated across multiple Availability Zones within a workspace. It integrates natively with Amazon Managed Grafana for dashboard visualization and alerting, and with AWS security services (IAM, VPC endpoints, AWS PrivateLink) to meet enterprise compliance requirements. Workspaces are isolated per customer, and data is encrypted at rest and in transit. Pricing is based on the number of metrics samples ingested, queried, and stored.

### Use Cases
* Kubernetes cluster monitoring (e.g., collecting node, pod, and container metrics from EKS clusters via kube-state-metrics and the node exporter, queried in Grafana)
* Hybrid and multi-cloud observability (e.g., scraping Prometheus metrics from on-premises Kubernetes clusters and sending them to AMP via remote write over an AWS PrivateLink connection)
* High-cardinality metrics storage (e.g., ingesting millions of unique label combinations from a large microservices fleet without hitting local Prometheus server limits)
* Alerting on SLOs (e.g., writing PromQL recording and alerting rules in AMP to fire when error budget burn rate exceeds a threshold, routed to PagerDuty via Alertmanager)
* Replacing self-managed Prometheus (e.g., migrating from a manually scaled Prometheus setup to AMP to eliminate on-call burden for storage capacity and HA configuration)
* Workload and application metrics monitoring (e.g., collecting custom application metrics via ADOT from ECS services and querying them alongside infrastructure metrics)
* IoT and time-series device monitoring (e.g., ingesting high-frequency sensor data from IoT devices for real-time anomaly detection using PromQL)
