---
cloud_provider: "AWS"
service_category: "storage"
service_name: "FSx for NetApp ONTAP"
pricing_model: "on-demand"
managed: true
tier: 3
---
## AWS FSx for NetApp ONTAP

### Description
Amazon FSx for NetApp ONTAP is a fully managed shared storage service built on NetApp's popular ONTAP file system, delivering the rich data management capabilities of NetApp as a native AWS service. It provides multiprotocol access over NFS, SMB, iSCSI, and NVMe-over-TCP simultaneously, making it suitable for heterogeneous environments serving both Windows and Linux clients from a single file system. Storage capacity and throughput scale independently and automatically, supporting elastic growth and shrinkage without downtime. FSx for ONTAP includes advanced ONTAP features such as FlexClone instant zero-copy clones, SnapMirror cross-region replication, SnapVault backup, deduplication, compression, and thin provisioning. It also supports S3 Access Points, allowing file data to be accessed as S3 objects for use with Bedrock, SageMaker, and Athena. An IDC study found 37% lower three-year cost of storage operations and 288% three-year ROI for organizations migrating to FSx for ONTAP. It supports Single-AZ and Multi-AZ deployments for HA.

### Use Cases
* Lifting and shifting NetApp ONTAP on-premises workloads to AWS without changing application code, NFS/SMB mount paths, or data management processes
* Providing multiprotocol shared storage for mixed Linux and Windows environments from a single file system
* Hosting enterprise databases (Oracle, SAP HANA) that require iSCSI block storage with ONTAP's QoS and snapshot capabilities
* Rapid application dev/test environments using FlexClone to create instant zero-cost copies of multi-TB datasets in seconds
* Disaster recovery and backup using SnapMirror replication to a secondary AWS Region or to on-premises NetApp storage
* Modernizing data management with automated tiering to lower-cost capacity pools and integration with S3-based AI/ML pipelines
* Business continuity for regulated industries (healthcare, financial services) requiring NetApp-grade audit trails and WORM compliance
