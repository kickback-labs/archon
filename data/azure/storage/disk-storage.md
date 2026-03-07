---
cloud_provider: "Azure"
service_category: "storage"
service_name: "Disk Storage"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Disk Storage (Managed Disks)

### Description
Azure Disk Storage provides block-level, managed disk volumes for Azure Virtual Machines. Managed disks abstract away the underlying storage accounts: you specify a disk type and size, and Azure handles provisioning, replication, and lifecycle management. There are five disk types—Ultra Disk, Premium SSD v2, Premium SSD, Standard SSD, and Standard HDD—spanning from ultra-low latency NVMe storage to cost-effective spinning media for infrequently accessed data. Locally redundant storage (LRS) disks provide 11-nines durability, and zone-redundant storage (ZRS) disks provide 12-nines durability. Managed disks integrate with availability sets and availability zones for fault isolation, and support snapshots, Azure Backup, and Azure Site Recovery for data protection.

### Use Cases
* OS and data disks for Azure Virtual Machines (e.g., attaching Premium SSD to a SQL Server VM for consistent low-latency transactional I/O)
* High-performance database storage (e.g., using Ultra Disk for latency-sensitive workloads like SAP HANA requiring sub-millisecond I/O)
* VM disk backup and point-in-time recovery (e.g., taking incremental managed disk snapshots before OS updates for fast rollback)
* Shared disk clustering (e.g., attaching a single managed disk to multiple VMs simultaneously for Windows Server Failover Cluster or SAP ASCS deployments)
