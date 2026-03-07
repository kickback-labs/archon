---
cloud_provider: "GCP"
service_category: "migration_hybrid"
service_name: "Database Migration Service"
pricing_model: "per-request"
managed: true
tier: 2
---
## GCP Database Migration Service (DMS)

### Description
Google Cloud Database Migration Service (DMS) is a fully serverless, managed service that enables minimal-downtime migrations of relational databases to Cloud SQL and AlloyDB for PostgreSQL. It supports homogeneous migrations (same engine to same engine) for MySQL, PostgreSQL, and SQL Server at no additional charge, and heterogeneous migrations (e.g., Oracle or SQL Server to PostgreSQL) priced on a per-byte basis. DMS uses native database replication capabilities to take an initial snapshot of the source database followed by continuous change data replication, keeping the destination in sync until cutover with minimal downtime. A built-in conversion workspace, assisted by Gemini AI, handles schema and code conversion for heterogeneous migrations, translating stored procedures, triggers, and functions to a PostgreSQL-compatible dialect with explanations and recommendations. DMS supports multiple secure, private connectivity options (private IP, VPC peering, SSH tunnels, forward SSH bastion) to protect data in transit. No migration servers need to be provisioned or managed; auto-scaling ensures high-performance replication at scale.

### Use Cases
* Homogeneous migrations of MySQL, PostgreSQL, or SQL Server workloads to Cloud SQL with zero-cost replication (e.g., migrating from Amazon RDS for PostgreSQL to Cloud SQL for PostgreSQL)
* Oracle-to-PostgreSQL heterogeneous migrations with AI-assisted schema and code conversion (e.g., migrating Oracle stored procedures to AlloyDB for PostgreSQL)
* Continuous data replication for minimal-downtime cutovers (e.g., migrating production databases during live traffic windows)
* Cross-cloud database migrations from AWS RDS or Azure Database to Cloud SQL (e.g., MySQL on Amazon RDS to Cloud SQL for MySQL)
* Migrating on-premises databases to AlloyDB for PostgreSQL to gain enterprise availability and performance benefits
* Validating migration readiness before cutover (e.g., running pre-migration validation checks to surface compatibility issues)
* Developer upskilling during Oracle-to-PostgreSQL migrations (e.g., using Gemini-powered side-by-side SQL dialect comparisons)
