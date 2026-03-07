---
cloud_provider: "Azure"
service_category: "database"
service_name: "SQL Managed Instance"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure SQL Managed Instance

### Description
Azure SQL Managed Instance is a fully managed PaaS database engine that delivers near 100% compatibility with the latest SQL Server Enterprise Edition, making it the primary target for lift-and-shift migrations of on-premises SQL Server workloads to Azure with minimal application changes. Unlike Azure SQL Database, it exposes instance-scoped features such as SQL Server Agent, cross-database queries, linked servers, Service Broker, transactional replication, and CLR modules — capabilities that are unavailable in single-database PaaS offerings. It is deployed inside a customer's Azure Virtual Network with a private IP endpoint by default, providing full network isolation as a single-tenant service with dedicated compute and storage. Two service tiers are available: General Purpose (remote storage, broad scale) and Business Critical (local SSD replicas, low I/O latency, in-memory OLTP). High availability is built-in with 99.99% SLA, and zone redundancy can be enabled for multi-zone protection. The Managed Instance link feature uses distributed availability groups to synchronize databases in near real-time between on-premises SQL Server and the managed instance, enabling online migration and hybrid DR scenarios. Costs can be reduced through Azure Hybrid Benefit (applying existing SQL Server Software Assurance licenses), reserved capacity purchases, or the stop/start capability for non-production instances.

### Use Cases
* Lift-and-shift migration of on-premises SQL Server instances requiring features unavailable in Azure SQL Database, such as SQL Server Agent jobs, linked servers, Service Broker, CLR, and cross-database queries
* Enterprise applications with strict network isolation requirements, deployed inside a customer VNet with no public endpoint exposure and connectivity via ExpressRoute or VPN
* ISV and line-of-business applications distributed as SQL Server instances that need full instance-level compatibility without code changes to the application tier
* Disaster recovery and read-scale offloading for on-premises SQL Server via the Managed Instance link, replicating data to Azure in near real-time without a full cloud migration
* Multi-database applications requiring distributed transactions (DTC) across databases within the same managed instance, or cross-database queries with shared schema
* Regulated workloads requiring transparent data encryption (TDE), Always Encrypted, row-level security, dynamic data masking, and SQL auditing with logs shipped to Azure Storage
