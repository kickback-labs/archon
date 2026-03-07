---
cloud_provider: "GCP"
service_category: "storage"
service_name: "Persistent Disk"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Persistent Disk

### Description
Google Cloud Persistent Disk is a fully managed, durable block storage service for Compute Engine VMs and GKE nodes. It offers four disk types—Standard HDD, Balanced SSD, SSD, and Extreme SSD—spanning price/performance needs from bulk throughput to sub-millisecond latency, with individual disk sizes up to 64 TB. Persistent Disks are network-attached and decoupled from the VM lifecycle, surviving instance deletion and supporting concurrent read-only attachment to multiple VMs. Data is automatically encrypted at rest and in transit, distributed across multiple physical drives for redundancy, and supports both zonal and regional (synchronous two-zone) configurations for high availability.

### Use Cases
* Boot disks and persistent data volumes for Compute Engine VMs and GKE workloads
* High-availability databases (PostgreSQL, MySQL, SQL Server) using Regional Persistent Disk for synchronous two-zone replication
* Cross-region disaster recovery using Persistent Disk Asynchronous Replication with low RPO
* Incremental snapshot-based backup schedules for compliance and data protection
* Staging environment provisioning using Disk Clones sourced from production disks
