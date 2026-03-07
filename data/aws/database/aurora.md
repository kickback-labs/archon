---
cloud_provider: "AWS"
service_category: "database"
service_name: "Aurora"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS Aurora

### Description
Amazon Aurora is a cloud-native relational database engine that delivers up to 5x the throughput of MySQL and 3x that of PostgreSQL while maintaining full wire-protocol compatibility with both. It uses a distributed, fault-tolerant storage system that auto-scales in 10 GB increments up to 128 TB, replicating data six ways across three Availability Zones. Aurora Serverless v2 provides instantaneous, fine-grained autoscaling at the ACU (Aurora Capacity Unit) level, and Aurora DSQL extends the engine to a globally distributed, active-active, virtually unlimited-scale configuration. Zero-ETL integrations with Amazon Redshift enable near-real-time analytics on transactional data without building ETL pipelines.

### Use Cases
* High-throughput OLTP applications requiring sub-millisecond replication lag (e.g., e-commerce, fintech)
* Multi-tenant SaaS platforms leveraging Aurora Serverless v2 to scale each tenant independently
* Globally distributed applications using Aurora Global Database for cross-region reads and disaster recovery
* Analytics on live transactional data via Aurora zero-ETL integration with Amazon Redshift
* Applications migrating from commercial databases (e.g., Oracle, SQL Server) using Babelfish for Aurora PostgreSQL with minimal code changes
