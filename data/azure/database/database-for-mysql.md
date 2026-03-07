---
cloud_provider: "Azure"
service_category: "database"
service_name: "Azure Database for MySQL"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Database for MySQL

### Description
Azure Database for MySQL is a fully managed PaaS relational database service based on MySQL Community Edition (versions 5.7 and 8.0), providing automated patching, backups, and high availability without infrastructure management. The Flexible Server model supports both zone-redundant HA (standby replica in a separate availability zone with automatic failover) and same-zone local-redundant HA for regions without multi-AZ support. Three compute tiers — Burstable, General Purpose, and Memory Optimized — cover development through high-concurrency production workloads, with on-demand server stop/start to eliminate idle compute charges. Storage auto-grow and independently provisioned IOPS allow seamless online scaling to meet fluctuating workload demands. Point-in-time restore is available for up to 35 days, with backups stored in locally redundant or geo-redundant storage based on configuration. Data is encrypted at rest with AES-256 and in transit via TLS 1.2+; full private access is available through virtual network integration. Up to 10 asynchronous read replicas support read scale-out for reporting and analytics. Data-in replication from external MySQL sources enables hybrid and multi-cloud synchronization patterns with minimal downtime.

### Use Cases
* LAMP-stack and PHP/Java web applications requiring a familiar, community-compatible MySQL engine with managed HA, automated backups, and zero-downtime patching
* E-commerce and content management platforms that experience burst traffic, using the Burstable tier for cost efficiency and scaling up to General Purpose during peak demand
* Applications migrating from on-premises MySQL or another cloud provider using Azure Database Migration Service or data-in replication for minimal-downtime cutover
* High-read workloads (e.g., reporting dashboards, read-heavy microservices) offloaded to up to 10 read replicas while writes remain on the primary instance
* Cost-sensitive development and staging environments using on-demand server stop/start to pay only for active compute hours
* Globally distributed systems requiring zone-redundant HA with automatic failover and geo-redundant backup to meet RTO/RPO requirements across Azure regions
