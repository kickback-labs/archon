---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "Secrets Manager"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS Secrets Manager

### Description
AWS Secrets Manager is a fully managed service for storing, rotating, and retrieving secrets such as database credentials, API keys, and OAuth tokens. Secrets are encrypted at rest using AWS KMS and accessed via API calls, eliminating hard-coded credentials in application code. Secrets Manager supports automatic rotation for supported AWS services (RDS, Redshift, DocumentDB, etc.) and custom rotation via AWS Lambda functions. Replication of secrets across multiple AWS Regions is supported for disaster recovery.

### Use Cases
* Storing and programmatically retrieving database passwords in application code (e.g., replacing hard-coded RDS credentials)
* Automatically rotating database credentials on a schedule without application downtime
* Storing API keys and third-party service credentials with fine-grained IAM access policies
* Replicating secrets across regions for multi-region application deployments
* Auditing all secret access and rotation events via AWS CloudTrail integration
