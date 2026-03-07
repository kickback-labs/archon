---
cloud_provider: "Azure"
service_category: "database"
service_name: "Azure Database for PostgreSQL"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Database for PostgreSQL

### Description
Azure Database for PostgreSQL is a fully managed PaaS relational database service based on the community edition of PostgreSQL, supporting major versions through automated minor upgrades. It handles patching, automated backups (point-in-time restore up to 35 days), and high availability without manual infrastructure management. The Flexible Server deployment model offers zone-redundant HA (warm standby across availability zones with synchronous replication and zero data loss) and same-zone HA for lower-latency failover. Three compute tiers are available — Burstable (for intermittent workloads), General Purpose, and Memory Optimized — with on-demand stop/start support to reduce costs during development and testing. Storage and IOPS scale independently and online, with storage auto-grow to prevent capacity surprises. A built-in PgBouncer connection pooler is available on the same host to efficiently manage connection overhead for high-concurrency applications. Data at rest is encrypted with AES-256, and TLS 1.2+ is enforced in transit; virtual network integration supports fully private deployments without public endpoints. Azure Database Migration Service provides near-zero-downtime migration paths from on-premises PostgreSQL and other cloud providers.

### Use Cases
* Relational OLTP backends for web and mobile applications requiring community PostgreSQL compatibility with managed HA, automated backups, and zero-downtime minor version upgrades
* Applications with unpredictable or intermittent traffic using the Burstable compute tier combined with server stop/start to eliminate idle compute costs
* High-concurrency SaaS platforms leveraging built-in PgBouncer to pool thousands of application connections into a smaller set of server connections, avoiding connection exhaustion
* Read-scale-out scenarios using up to 5 asynchronous read replicas to distribute reporting and analytics queries away from the primary write instance
* Geographically distributed applications requiring zone-redundant high availability with synchronous standby replication and automatic failover within an Azure region
* Migrations from on-premises or other cloud PostgreSQL databases using Azure Database Migration Service or native pg_dump/pg_restore with minimal downtime
* Applications requiring PostGIS, pg_vector, or other community extensions supported natively by the Flexible Server engine
