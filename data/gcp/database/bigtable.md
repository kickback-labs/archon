---
cloud_provider: "GCP"
service_category: "database"
service_name: "Cloud Bigtable"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Cloud Bigtable

### Description
Cloud Bigtable is a fully managed, wide-column NoSQL database designed for low-latency, high-throughput workloads at petabyte scale. Originally developed to power Google services like Search, Maps, and YouTube, it decouples compute from storage to enable transparent horizontal scaling and automatic rebalancing. It is compatible with Apache HBase and Apache Cassandra APIs, supports SQL queries and continuous materialized views, and offers up to 99.999% availability in multi-region configurations. Data Boost provides workload-isolated capacity for batch analytics and ML training without impacting transactional serving.

### Use Cases
* Time series data ingestion and serving for IoT telemetry, financial tick data, and operational monitoring
* Real-time analytics on high-velocity event streams (e.g., clickstream, ad impressions, game telemetry)
* AdTech and personalization: low-latency feature stores powering ML recommendations at billions of requests per day
* ML training infrastructure for storing and serving large embedding tables and model weight snapshots
* Cybersecurity workloads requiring fast lookup of signatures, blocklists, and fraud signals
