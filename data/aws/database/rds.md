---
cloud_provider: "AWS"
service_category: "database"
service_name: "RDS"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS Relational Database Service (RDS)

### Description
Amazon Relational Database Service (Amazon RDS) is a fully managed relational database service that automates undifferentiated tasks such as hardware provisioning, database setup, patching, and backups. It supports eight engines: Amazon Aurora (MySQL-compatible and PostgreSQL-compatible), PostgreSQL, MySQL, MariaDB, Oracle, Microsoft SQL Server, and IBM Db2. RDS offers Multi-AZ deployments for high availability, Read Replicas for horizontal read scaling, and AWS Graviton3-based instances for improved price-performance. It integrates with AWS Secrets Manager for credential rotation, AWS KMS for encryption at rest, and Amazon VPC for network isolation.

### Use Cases
* Multi-engine relational workloads migrated from on-premises (e.g., Oracle or SQL Server lift-and-shift)
* Web and mobile application backends requiring managed RDBMS with auto-scaling storage
* Regulated data workloads requiring Multi-AZ redundancy and automated backups
* Read-heavy applications using Read Replicas to offload reporting queries from the primary instance
* Hybrid deployments running RDS on AWS Outposts for low-latency on-premises database access
