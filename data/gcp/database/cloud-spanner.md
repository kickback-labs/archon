---
cloud_provider: "GCP"
service_category: "database"
service_name: "Cloud Spanner"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Cloud Spanner

### Description
Cloud Spanner is a fully managed, horizontally scalable, globally distributed relational database service that combines ACID transactions with SQL semantics and up to 99.999% availability SLA. It uses Google's TrueTime technology to enforce external consistency and strong global read consistency across regions without sacrificing write scalability. Data is automatically sharded across nodes; capacity scales by adding processing units without application downtime or schema migration. Spanner supports both Google SQL and PostgreSQL dialects, and extends the relational model with native graph (Spanner Graph), full-text search, and vector search capabilities for multi-model workloads.

### Use Cases
* Mission-critical OLTP applications requiring strong consistency and five-nines availability across multiple regions (e.g., global financial transaction ledgers, payment processing)
* User profile and entitlement management for high-traffic consumer applications that must scale horizontally while maintaining consistent reads (e.g., gaming platforms, loyalty programs)
* Inventory and order management systems that need a single strongly-consistent source of truth across multiple geographic regions and channels
* Migration of sharded MySQL or Cassandra clusters to a managed, auto-sharded system that eliminates manual resharding overhead
