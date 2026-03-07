---
cloud_provider: "AWS"
service_category: "devops"
service_name: "CloudWatch"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS CloudWatch

### Description
Amazon CloudWatch is the primary observability service for AWS, collecting and unifying metrics, logs, and traces across all AWS resources and applications. It provides dashboards, alarms, anomaly detection, and AI-powered investigations to help operators monitor and troubleshoot workloads at scale. CloudWatch integrates natively with virtually every AWS service and supports OpenTelemetry standards for hybrid and multi-cloud environments.

### Use Cases
* Infrastructure monitoring (e.g., tracking EC2 CPU, RDS connections, and Lambda error rates via built-in metrics)
* Centralized log aggregation and analysis (e.g., shipping application logs from ECS tasks to CloudWatch Logs Insights for querying)
* Alarm-driven auto-remediation (e.g., triggering SNS or Lambda when a metric threshold is breached)
* Application performance monitoring (e.g., using CloudWatch Application Signals for distributed tracing with SLOs)
* Cost and usage optimization (e.g., identifying underutilized resources through long-term metric trends)
