---
cloud_provider: "GCP"
service_category: "storage"
service_name: "Filestore"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Filestore

### Description
Google Cloud Filestore is a fully managed, high-performance NFS file storage service for applications requiring shared file system access. It provides two primary service tiers: Filestore Zonal for high-throughput, low-latency workloads such as HPC, electronic design automation (EDA), and media rendering; and Filestore Regional for enterprise workloads (SAP, Oracle) requiring 99.99% regional availability with resiliency to zonal outages. Capacity scales up to 100 TiB per instance with throughput up to 26 GiB/s and 920,000 IOPS. A Multi-share option for GKE allows provisioning shares as small as 10 GiB within a single instance, enabling cost-efficient shared storage for containerized applications. Data protection includes instantaneous snapshots, cross-region replication, and scheduled backups with recovery in 10 minutes or less.

### Use Cases
* Shared NFS storage for GKE pods via the managed CSI driver, enabling multiple pods to read/write the same file system concurrently
* High-performance scratch storage for HPC clusters (genomics, financial modeling, media rendering) requiring high IOPS and low latency
* Enterprise application migration (SAP, ERP, Oracle) requiring managed NFS with 99.99% regional availability and full backup/snapshot capabilities
* Electronic design automation (EDA) workflows with mixed sequential, random-access, and metadata-intensive I/O patterns
* Web content and CMS hosting (WordPress, Drupal) requiring scalable, low-latency shared file access
* NFS datastore expansion for VMware Engine clusters, scaling capacity independently from vSAN compute
