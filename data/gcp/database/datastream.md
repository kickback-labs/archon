---
cloud_provider: "GCP"
service_category: "database"
service_name: "Datastream"
pricing_model: "on-demand"
managed: true
tier: 2
---
## GCP Datastream

### Description
Datastream is a serverless, agentless change data capture (CDC) and replication service that continuously streams data changes from source databases into Google Cloud destinations with minimal latency. It reads insert, update, and delete events directly from the transaction logs of MySQL, PostgreSQL, AlloyDB, Oracle, and SQL Server databases without placing query load on the source. Destination targets include BigQuery, Cloud SQL, Cloud Storage, and Cloud Spanner. Datastream handles schema drift automatically by rotating files and maintaining a versioned Schema Registry, and it supports multiple secure private connectivity methods (VPN, reverse SSH, IP allowlisting). Pricing is based on actual data processed per month with no infrastructure to provision or manage.

### Use Cases
* Real-time analytics by streaming operational database changes into BigQuery for near-instant insights (e.g., streaming e-commerce order updates to a reporting dataset)
* Database replication across heterogeneous systems (e.g., replicating an on-premises Oracle database to Cloud SQL for PostgreSQL or Spanner)
* Event-driven architectures using CDC events written to Cloud Storage or Pub/Sub via Dataflow templates (e.g., triggering inventory adjustments on every order insert)
* Data lake ingestion by landing raw change events in Cloud Storage for downstream Dataflow or Dataproc processing
* Zero-downtime database migrations using Datastream to keep a target database in sync while validating cutover (e.g., Oracle to AlloyDB migration)
* Operational dashboards requiring sub-minute data freshness without burdening the production database with polling queries
