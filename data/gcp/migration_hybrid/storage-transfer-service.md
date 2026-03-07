---
cloud_provider: "GCP"
service_category: "migration_hybrid"
service_name: "Storage Transfer Service"
pricing_model: "per-request"
managed: true
tier: 2
---
## GCP Storage Transfer Service

### Description
Google Cloud Storage Transfer Service is a fully managed data movement service that enables large-scale, reliable transfers of object and file data between cloud storage systems and Cloud Storage. It supports transfers from Amazon S3, Azure Blob Storage, S3-compatible storage, on-premises file systems, HDFS clusters, and publicly accessible URLs, as well as bucket-to-bucket transfers within Cloud Storage. The service is optimized for datasets larger than 1 TiB and features a highly parallelized architecture for high throughput, automatic retries, and data integrity validation via checksums to ensure no corruption occurs during transfer. Storage Transfer Service offers two transfer modes: agentless (for cloud-to-cloud transfers, managed entirely by Google) and agent-based (for on-premises or hybrid scenarios, using lightweight transfer agents deployed in the customer's environment). It supports scheduled, one-time, and event-driven transfers, with Pub/Sub notifications for job status updates. Transfers can be filtered by object prefix, last-modified date, or a manifest file listing specific objects. All data in transit is encrypted using TLS 1.3, and customer-managed encryption keys (CMEK) are supported. The service integrates with Cloud Logging and Cloud Monitoring for audit trails and transfer job observability. Pricing is based on the volume of data transferred, with no charge for transfers between Cloud Storage buckets in the same region.

### Use Cases
* Migrating large datasets from AWS S3 or Azure Blob Storage to Cloud Storage (e.g., one-time cloud-to-cloud migration during a cloud provider switch)
* Continuous cross-bucket replication for disaster recovery or multi-region data distribution
* Ingesting on-premises file system data to Cloud Storage for analytics (e.g., nightly batch uploads from NAS to BigQuery staging buckets)
* Transferring HDFS data from on-premises Hadoop clusters to Cloud Storage as part of a Dataproc migration
* Event-driven data ingestion that triggers a transfer job when new objects are written to an S3 or Azure bucket
* Archiving cold data from costly on-premises storage to Cloud Storage Archive class to reduce storage costs
* Building data pipelines that pull data from multiple cloud sources into a central Cloud Storage data lake for Dataflow or BigQuery processing
