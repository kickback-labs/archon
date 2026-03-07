---
cloud_provider: "AWS"
service_category: "analytics"
service_name: "Lake Formation"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Lake Formation

### Description
AWS Lake Formation is a managed service that makes it easier to build, secure, and manage data lakes by centralizing permissions, governance, and data sharing on top of Amazon S3 and the AWS Glue Data Catalog. It provides fine-grained access control down to the row, column, and cell level, enforced consistently across AWS analytics services including Athena, Redshift Spectrum, EMR, and Glue ETL. Lake Formation uses tag-based access controls (LF-TBAC) to scale permissions across large numbers of users and datasets without managing individual IAM policies for each resource. It integrates with AWS Glue Sensitive Data Detection to automatically tag PII and sensitive columns, and with AWS Data Exchange for secure business-to-business data sharing without data movement. Comprehensive audit logs via Amazon CloudTrail track all data access by user and role, supporting compliance requirements. Lake Formation is also available within the next generation of Amazon SageMaker (SageMaker Unified Studio).

### Use Cases
* Centralize data lake access control (e.g., apply column- and row-level security to S3-backed tables accessible from Athena, Redshift, and EMR)
* Enforce consistent fine-grained permissions across multiple AWS analytics services from a single policy definition
* Scale governance to hundreds of users using tag-based access controls without managing per-resource IAM policies
* Share data across AWS accounts or AWS Organizations without copying or moving data (e.g., cross-account data mesh)
* Govern external data sharing with business partners via AWS Data Exchange integration
* Audit data access for compliance by reviewing CloudTrail logs of who accessed which dataset and when
* Protect sensitive data by automating PII detection and tagging with Glue Sensitive Data Detection
