---
cloud_provider: "AWS"
service_category: "migration_hybrid"
service_name: "DataSync"
pricing_model: "per-request"
managed: true
tier: 2
---
## AWS DataSync

### Description
AWS DataSync is a managed data transfer service that simplifies, automates, and accelerates moving data between on-premises storage, other cloud providers, and AWS storage services (Amazon S3, EFS, and FSx). DataSync deploys a lightweight agent appliance on-premises and can transfer petabyte-scale datasets with in-flight TLS encryption and end-to-end data integrity validation via checksums. Transfer throughput scales automatically to use available network bandwidth, and bandwidth throttling, scheduling, and file filtering controls give fine-grained management of data movement. DataSync eliminates the need to write custom transfer scripts and provides comprehensive monitoring via CloudWatch. It supports NFS, SMB, Amazon S3 API, Hadoop Distributed File System (HDFS), and object storage endpoints including S3-compatible storage.

### Use Cases
* One-time data migration to AWS (e.g., moving petabytes of on-premises NFS data to Amazon S3 or EFS for a cloud-first initiative)
* Ongoing hybrid data synchronization (e.g., replicating on-premises NAS to Amazon FSx for Lustre for burst HPC workloads)
* Cold data archival (e.g., moving infrequently accessed on-premises data directly to S3 Glacier Instant Retrieval to free storage capacity)
* Disaster recovery data replication (e.g., continuously copying EFS data to a secondary Region for cross-Region DR)
* Multi-cloud data pipelines (e.g., transferring data from Azure Blob Storage or Google Cloud Storage to Amazon S3)
* Hybrid and edge workload data movement (e.g., syncing edge-generated data from remote sites to a central data lake on S3)
