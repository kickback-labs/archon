---
cloud_provider: "AWS"
service_category: "database"
service_name: "Keyspaces"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Keyspaces (for Apache Cassandra)

### Description
Amazon Keyspaces is a fully managed, serverless, Apache Cassandra-compatible database service. It enables running Cassandra workloads on AWS using the same CQL (Cassandra Query Language) application code, Apache drivers, and developer tools in use today, without provisioning, patching, or managing servers. Keyspaces is serverless — it automatically scales tables up and down in response to application traffic, and customers pay only for the resources used. Data is encrypted by default, replicated three times across multiple Availability Zones for high availability, and can be backed up continuously using point-in-time recovery. Keyspaces supports both on-demand and provisioned capacity modes, and integrates with AWS IAM for fine-grained access control, AWS CloudTrail for audit logging, and Amazon VPC for network isolation.

### Use Cases
* Migrating self-managed Apache Cassandra clusters to a fully managed service with minimal code changes
* High-scale industrial IoT applications requiring wide-column storage for time-stamped device data across many sensors
* User activity tracking and time-series event storage at very high write throughput (e.g., clickstream data)
* Gaming applications storing player state, inventory, and match history across millions of users
* Retail and e-commerce catalog data with wide, sparse attribute sets per item across large data sets
* Applications requiring CQL compatibility with the operational simplicity of a serverless, auto-scaling database
