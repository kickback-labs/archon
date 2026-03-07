---
cloud_provider: "AWS"
service_category: "storage"
service_name: "FSx for OpenZFS"
pricing_model: "on-demand"
managed: true
tier: 3
---
## AWS FSx for OpenZFS

### Description
Amazon FSx for OpenZFS is a fully managed shared file storage service built on the open-source OpenZFS file system, providing NFS-based access (NFSv3 and NFSv4.x) for Linux and macOS workloads requiring low-latency, high-performance file storage. It delivers over 1 million IOPS and latencies of a few hundred microseconds, making it one of the highest-performance managed file systems available in the cloud. FSx for OpenZFS includes native OpenZFS capabilities such as point-in-time snapshots, instant zero-copy cloning of entire volumes and directories, on-the-fly data compression, and automated tiering via the FSx Intelligent-Tiering storage class. It supports S3 Access Points, so file data can be accessed directly by S3-compatible applications (Amazon Bedrock, SageMaker, Glue) without data movement. Throughput capacity can be scaled independently of storage, and storage scaling is elastic. Automated daily backups are stored in S3, and cross-region replication is supported for disaster recovery.

### Use Cases
* Migrating Linux-based file server workloads from OpenZFS or other NFS servers to AWS without application changes
* Dev/test and CI/CD acceleration using instant volume clones (e.g., cloning a full application dataset in seconds to spin up parallel test environments)
* High-IOPS data analytics and machine learning workloads (e.g., financial analytics, feature engineering pipelines)
* Low-latency content delivery and web serving for content management systems (WordPress, Drupal, Magento)
* Build acceleration using fast shared NFS storage for source code repositories and build systems (Git, Bitbucket, Jenkins)
* Providing NFS-backed persistent storage for containerized applications on EKS or ECS with native Kubernetes CSI driver support
* Data pipelines that need to expose file data to S3-native AI/ML services without copying data out of the file system
