---
cloud_provider: "GCP"
service_category: "database"
service_name: "Cloud SQL"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Cloud SQL

### Description
Cloud SQL is a fully managed relational database service for MySQL, PostgreSQL, and SQL Server, handling backups, patching, high availability, failover, and monitoring so teams can focus on application development. Each instance runs on a Compute Engine VM backed by a Persistent Disk, with a static IP and optional standby VM in a separate zone for HA. Cloud SQL Enterprise Plus edition for MySQL and PostgreSQL provides near-zero-downtime maintenance. Connections are secured via the Cloud SQL Auth Proxy, private IP (VPC), or public IP with authorized networks and SSL enforcement.

### Use Cases
* Lift-and-shift migration of on-premises MySQL, PostgreSQL, or SQL Server databases to a managed cloud service with minimal code changes
* Application backends for web and mobile apps that require a relational database with automatic failover and daily backups (e.g., e-commerce order management)
* Multi-zone high-availability databases for production workloads requiring regional failover with automated switchover
* Dev/test database environments provisioned on demand and shut down after use to control costs
