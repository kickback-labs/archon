---
cloud_provider: "GCP"
service_category: "storage"
service_name: "Google Cloud NetApp Volumes"
pricing_model: "on-demand"
managed: true
tier: 3
---
## GCP Google Cloud NetApp Volumes

### Description
Google Cloud NetApp Volumes is a fully managed, cloud-native enterprise file storage service built on NetApp ONTAP technology, delivering advanced data management for lift-and-shift and cloud-native workloads. It supports NFS (v3, v4.1, v4.2), SMB (2.1, 3.0, 3.1.1), and iSCSI protocols natively, eliminating the need to re-architect existing applications. Volumes are provisioned from 1 GiB to 3 PiB in seconds across multiple service levels—Flex Unified, Flex File, Standard, Premium, and Extreme—each offering different throughput-per-GiB profiles to balance cost and performance. Key data management capabilities include automated and manual snapshots, volume replication for cross-region disaster recovery, ONTAP FlexCache for fan-out caching of remote volumes, and integrated backups with configurable retention policies. Auto-tiering transparently moves cold data to lower-cost storage. Customer-managed encryption keys (CMEK) via Cloud KMS are supported, and access is controlled through IAM with VPC peering via Private Service Access. The service integrates with Cloud Monitoring and Cloud Logging and can be managed via the Google Cloud Console, gcloud CLI, or Terraform.

### Use Cases
* Enterprise NFS/SMB file shares migrated from on-premises NetApp ONTAP environments without re-architecture (e.g., SAP shared file systems, Windows home directories)
* High-performance database file storage using the Premium or Extreme service level for self-managed databases requiring low latency and high throughput (e.g., Oracle, SQL Server)
* Virtual desktop infrastructure (VDI) storage providing high-IOPS shared storage for user profile and application data
* Google Cloud VMware Engine storage integration, providing ONTAP-native file shares to VMware VMs running in GCP
* Cross-region disaster recovery using asynchronous volume replication to replicate critical file data to a secondary region with minimal RPO
* HPC and EDA workload scratch storage using the Extreme service level for workloads requiring up to 4.5 GiBps per volume (e.g., chip design simulation intermediate data)
* Block storage workloads using iSCSI volumes consumed as raw block devices by Linux or Windows Compute Engine VMs
* Data archival with auto-tiering that automatically moves infrequently accessed data from performance tiers to cold storage transparently
