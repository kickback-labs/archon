---
cloud_provider: "Azure"
service_category: "storage"
service_name: "Azure NetApp Files"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure NetApp Files (ANF)

### Description
Azure NetApp Files is an Azure-native, first-party enterprise file storage service built on NetApp ONTAP bare-metal hardware, delivered as a fully managed volumes-as-a-service. It supports NFSv3, NFSv4.1, SMB 3.x, and simultaneous dual-protocol volumes, as well as an S3-compatible object REST API. The service offers five performance tiers (Elastic zone-redundant, Flexible, Standard, Premium, Ultra) with dynamic service-level changes and cool access for cold data, enabling volumes from 50 GiB up to 1,024 TiB (or 7.2 PiB with large volumes and cool access). Capacity pools start at 1 TiB and scale up to 2,048 TiB. ANF provides sub-millisecond latency from all-flash in-Azure bare-metal infrastructure, with throughput scalable to double-digit GB/s and millions of IOPS. Data protection is handled by efficient block-incremental snapshots, cross-region and cross-zone replication, snapshot revert, and application-aware backup with vaulting. Security features include data-at-rest encryption with platform- or customer-managed keys, POSIX ACLs, AD/LDAP authentication, export policies, built-in machine-learning-based ransomware protection, and Azure RBAC. ANF integrates natively with Azure VMware Solution datastores, Azure Kubernetes Service persistent volumes, SAP HANA, Oracle, and high-performance computing workloads.

### Use Cases
* Lift-and-shift of enterprise NAS workloads requiring sub-millisecond latency and multi-protocol (NFS + SMB) access without refactoring (e.g., SAP HANA shared volumes)
* High-performance computing (HPC) and financial simulations that require hundreds of GB/s throughput from a single namespace
* Oracle and SQL Server databases needing ONTAP-native snapshot and replication capabilities for fast, application-consistent backup and recovery
* Azure VMware Solution datastore expansion: attach ANF volumes as NFS datastores to avoid purchasing additional VMware compute nodes solely for storage
* Persistent volumes for latency-sensitive Kubernetes workloads on AKS (e.g., AI/ML training jobs reading large datasets from ReadWriteMany volumes)
* Disaster recovery across regions or availability zones with cross-region replication and instant snapshot restore to a new volume
