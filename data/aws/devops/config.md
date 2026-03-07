---
cloud_provider: "AWS"
service_category: "devops"
service_name: "Config"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Config

### Description
AWS Config is a fully managed service that continuously records and evaluates the configuration state of AWS resources in your account. It maintains a detailed configuration history for each resource and delivers configuration change notifications to Amazon SNS and Amazon S3. Config rules allow you to define desired configuration states — either using AWS-managed rules or custom Lambda-backed rules — and Config automatically evaluates resource configurations against these rules on a continuous or change-triggered basis. Noncompliant resources are flagged and can be automatically remediated using AWS Systems Manager Automation documents. Config integrates with AWS Organizations to enable organization-wide compliance evaluation through conformance packs, which bundle multiple rules and remediations into a single deployable unit. Pricing is based on the number of configuration items recorded and the number of active Config rule evaluations per month.

### Use Cases
* Compliance-as-code enforcement (e.g., flagging any S3 bucket where public access is not blocked and automatically remediating via Systems Manager)
* Configuration change tracking and auditing (e.g., recording every change to a security group's inbound rules over the past 90 days for a compliance audit)
* Operational troubleshooting (e.g., correlating a service disruption with a specific configuration change to an EC2 instance or load balancer)
* Security posture assessment (e.g., detecting IAM policies that grant wildcard `*` actions and notifying a security team via SNS)
* Multi-account governance with conformance packs (e.g., deploying a CIS AWS Foundations Benchmark conformance pack across all accounts in an AWS Organization)
* Resource inventory and relationship mapping (e.g., discovering all EC2 instances, their attached EBS volumes, and associated security groups in a region)
* Drift detection for infrastructure-as-code (e.g., alerting when a manually modified resource deviates from its CloudFormation-managed desired state)
