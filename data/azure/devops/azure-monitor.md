---
cloud_provider: "Azure"
service_category: "devops"
service_name: "Azure Monitor"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Monitor

### Description
Azure Monitor is a comprehensive, full-stack observability service that collects, stores, and analyzes metrics, logs, distributed traces, and change data from Azure resources, on-premises systems, and other clouds in a unified platform. It provides the central data store (Azure Monitor Metrics for time-series numerics and Log Analytics workspaces for structured/unstructured logs), built-in alerting with near-real-time metric alerts and log-search alerts, and autoscale rules that dynamically adjust resource capacity based on observed metrics.

### Use Cases
* Unified infrastructure and application monitoring across Azure VMs, containers (AKS), and PaaS services via pre-built insights (VM Insights, Container Insights)
* Setting metric and log-based alerts with action groups to trigger email/SMS/webhook notifications or automated remediation when thresholds are breached
* Querying application and infrastructure logs using Kusto Query Language (KQL) in Log Analytics to troubleshoot incidents and build custom dashboards
* Autoscaling compute resources (VM Scale Sets, App Service) in response to CPU, memory, or custom metric signals to maintain performance and control cost
* Distributed tracing of microservices and web applications via Application Insights to identify latency bottlenecks and dependency failures
