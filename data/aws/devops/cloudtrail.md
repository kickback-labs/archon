---
cloud_provider: "AWS"
service_category: "devops"
service_name: "CloudTrail"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS CloudTrail

### Description
AWS CloudTrail is a managed auditing and governance service that records API calls and user activity across an AWS account, delivering a tamper-evident event history to S3 or CloudTrail Lake. It covers management events (control-plane actions) and optionally data events (e.g., S3 object reads/writes, Lambda invocations) and network activity events for VPC endpoints. CloudTrail is the foundational service for compliance, security investigation, and operational debugging in AWS.

### Use Cases
* Compliance auditing and reporting (e.g., proving SOC 2, PCI-DSS, or HIPAA controls with immutable API logs)
* Security incident investigation (e.g., tracing which IAM principal deleted a resource or changed a security group)
* Operational troubleshooting (e.g., querying CloudTrail Lake with SQL to diagnose unexpected resource changes)
* Data perimeter enforcement (e.g., using network activity events to detect VPC endpoint policy violations)
* Automated threat detection (e.g., routing CloudTrail events to GuardDuty or Security Hub for anomaly alerting)
