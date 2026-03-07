---
cloud_provider: "GCP"
service_category: "analytics"
service_name: "BigQuery"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP BigQuery

### Description
BigQuery is GCP's fully managed, serverless data warehouse and analytics platform that scales to petabytes with no infrastructure to manage. It decouples storage and compute, enabling high-speed SQL analytics using Google's Dremel, Colossus, Borg, and Jupiter infrastructure. BigQuery includes built-in ML capabilities (BigQuery ML) allowing users to train and run models directly in SQL, as well as native integration with Vertex AI, Gemini-powered AI assistance, and Apache Iceberg support for open lakehouse architectures. Pricing is based on storage and either on-demand query processing (per TiB scanned) or capacity-based slot reservations (Standard, Enterprise, Enterprise Plus editions).

### Use Cases
* Interactive ad-hoc analytics over petabyte-scale structured and semi-structured datasets using standard SQL
* Serving as the central data warehouse in a lakehouse architecture, processing Apache Iceberg tables alongside native BigQuery tables with unified governance via Dataplex
* Training and running ML models (linear regression, k-means, time-series forecasting, LLM inference) directly in SQL using BigQuery ML without moving data
* Real-time ingestion and analysis via BigQuery Storage Write API, Pub/Sub native subscriptions, or continuous SQL queries for event-driven analytics
* Migrating legacy data warehouses (Redshift, Teradata, Snowflake, Netezza) using the free BigQuery Migration Service with AI-powered SQL translation
