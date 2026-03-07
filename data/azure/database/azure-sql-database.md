---
cloud_provider: "Azure"
service_category: "database"
service_name: "Azure SQL Database"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure SQL Database

### Description
Azure SQL Database is a fully managed, cloud-native relational database service (PaaS) built on the latest stable version of the Microsoft SQL Server engine, with a guaranteed 99.99% SLA. It handles patching, backups, high availability, and monitoring automatically, freeing teams from infrastructure management. It offers two purchasing models (vCore and DTU) and three service tiers: General Purpose for balanced workloads, Business Critical for high-throughput OLTP with in-memory replicas, and Hyperscale for databases scaling to 128 TB with fast backup and restore. A serverless compute tier is available for intermittent workloads, auto-pausing during inactivity and billing per second.

### Use Cases
* Relational OLTP backends for web and mobile applications requiring automatic scaling, built-in HA, and zero-downtime patching
* Multi-tenant SaaS platforms using elastic pools to share provisioned resources across hundreds of databases, reducing per-tenant cost
* Applications needing global read scale via active geo-replication with up to four readable secondaries across Azure regions
* Microservices needing an isolated, portable single database with a predictable resource allocation (vCores, memory, storage)
