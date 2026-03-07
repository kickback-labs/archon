---
cloud_provider: "Azure"
service_category: "storage"
service_name: "Elastic SAN"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Elastic SAN

### Description
Azure Elastic SAN is a fully managed, cloud-native storage area network (SAN) that consolidates block storage for multiple compute workloads behind a single provisioned resource. Volumes are exposed to clients via iSCSI, making Elastic SAN compatible with Azure Virtual Machines, Azure VMware Solution, AKS, and other iSCSI-capable hosts without per-workload storage provisioning. Performance (IOPS and throughput) is provisioned at the SAN level and shared across all volumes, scaling up to millions of IOPS with double-digit GB/s throughput and single-digit millisecond latency. Volume groups act as management and policy boundaries: network access rules and private endpoints configured on a group are inherited by all volumes within it. Redundancy options are LRS or ZRS, and data is encrypted at rest; snapshots are supported for point-in-time recovery. Elastic SAN is best suited for organizations with many IO-intensive workloads that can share a pooled performance budget rather than paying for dedicated per-disk IOPS overprovisioning.

### Use Cases
* Consolidating block storage for a large fleet of IO-intensive VMs (e.g., dozens of database servers) under a single SAN resource to reduce per-disk overprovisioning costs
* Providing shared iSCSI block volumes for Azure Kubernetes Service workloads that require ReadWriteOnce persistent volumes with high IOPS
* Backend storage for Azure VMware Solution clusters needing scalable block storage without adding VMware compute nodes
* Mission-critical databases (SQL Server, Oracle) that need millions of IOPS with sub-millisecond latency and centralized snapshot-based backup
* Multi-workload environments where different application tiers share a pooled SAN, with volume groups enforcing network isolation per tier (e.g., separate groups for prod vs. dev)
* Enterprises migrating on-premises SAN infrastructure to Azure while retaining familiar iSCSI connectivity and centralized storage management
