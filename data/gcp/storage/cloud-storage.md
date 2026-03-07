---
cloud_provider: "GCP"
service_category: "storage"
service_name: "Cloud Storage"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Cloud Storage (GCS)

### Description
Google Cloud Storage (GCS) is a fully managed, globally consistent object storage service for storing and retrieving any amount of unstructured data. It offers four storage classes—Standard, Nearline (access < once/month), Coldline (access < once/quarter), and Archive (access < once/year)—all accessible through a single JSON/XML API with millisecond retrieval latency regardless of class. Cloud Storage provides strong read-after-write consistency for all operations, 11 nines (99.999999999%) durability, and can replicate data across regions (dual-region) or continents (multi-region) for high availability and disaster recovery. It integrates natively with BigQuery, Dataproc, Vertex AI, Dataflow, and GKE as the foundational data lake layer for analytics and machine learning workloads on Google Cloud.

### Use Cases
* Primary data lake storing raw and processed data for BigQuery, Dataproc, or Dataflow analytics pipelines
* Training data and model artifact storage for Vertex AI ML workflows
* Application backup, disaster recovery, and archival with configurable retention policies and Bucket Lock for compliance
* Static website and media content hosting with direct HTTP access and CDN integration via Cloud CDN
