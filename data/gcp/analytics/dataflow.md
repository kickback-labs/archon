---
cloud_provider: "GCP"
service_category: "analytics"
service_name: "Dataflow"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Dataflow

### Description
Dataflow is GCP's fully managed, serverless stream and batch data processing service built on the open-source Apache Beam SDK. It provides a unified programming model for both streaming and batch pipelines, removing the need to manage clusters or servers — Dataflow autoscales workers (up to 4,000 per job) and handles all provisioning. The service natively integrates with Pub/Sub, BigQuery, Cloud Storage, Bigtable, and Spanner, and supports real-time ML inference through Vertex AI and Gemini models via RunInference. Pricing is based on worker CPU/memory consumption plus additional charges for Streaming Engine compute units and Shuffle data processed; committed use discounts of 20–40% are available.

### Use Cases
* Streaming ETL pipelines that ingest from Pub/Sub or Apache Kafka, transform data in real time, and land results in BigQuery, Cloud Storage, Bigtable, or third-party sinks (Splunk, Datadog)
* Real-time ML inference at scale — applying Vertex AI or Gemini models to streaming data for fraud detection, anomaly detection, and personalized recommendations using RunInference and MLTransform
* Batch processing and data migration — large-scale transformations, reprocessing historical data, and change-data-capture (CDC) from databases into BigQuery using pre-built Dataflow templates
* Clickstream analytics — processing user interaction events from web and mobile apps in real time to power personalization, A/B testing, and funnel optimization
* Multimodal data processing for generative AI — parallel ingestion and feature extraction of images, text, and audio streams before feeding unified representations into foundation models
