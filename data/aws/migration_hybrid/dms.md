---
cloud_provider: "AWS"
service_category: "migration_hybrid"
service_name: "Database Migration Service"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS Database Migration Service (DMS)

### Description
AWS Database Migration Service (DMS) is a managed cloud service that enables you to migrate relational databases, data warehouses, NoSQL databases, and other data stores to AWS with near-zero downtime and zero data loss. DMS supports homogeneous migrations (e.g., Oracle to Oracle on RDS) and heterogeneous migrations (e.g., SQL Server to Aurora PostgreSQL), with automated schema conversion via DMS Schema Conversion and AI-assisted code conversion achieving up to 90% automation rates. Source databases remain fully operational throughout the migration, and Multi-AZ redundancy with checkpoint-based recovery ensures resilience. Data validation processes and re-synchronization guard against discrepancies between source and target. DMS offers both instance-based (hourly) and serverless pricing models. Note: DMS Fleet Advisor (database discovery) reaches end of support on May 20, 2026; AWS Transform is the recommended path for pre-migration database discovery.

### Use Cases
* Migrating on-premises databases to managed AWS services (e.g., Oracle or SQL Server to Amazon Aurora or RDS)
* Modernizing to open-source or cloud-native databases to reduce licensing costs (e.g., SQL Server to PostgreSQL with schema auto-conversion)
* Re-hosting on-premises databases on Amazon EC2 as a lift-and-shift first step
* Continuous data replication for ongoing synchronization between source and target during long migration windows
* Migrating data warehouses (e.g., Teradata or Netezza to Amazon Redshift)
