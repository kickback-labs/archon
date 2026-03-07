---
cloud_provider: "GCP"
service_category: "storage"
service_name: "Local SSD"
pricing_model: "on-demand"
managed: false
tier: 2
---
## GCP Local SSD

### Description
Google Cloud Local SSD provides physically attached, ephemeral NVMe block storage for Compute Engine VM instances, offering the highest IOPS and lowest latency of any GCP storage option. Local SSDs are co-located on the same physical server as the VM, eliminating network overhead and delivering up to 6,000,000 read/write IOPS and 36,000 MiB/s throughput on storage-optimized instances. Up to 32 Local SSD disks can be attached per general-purpose instance for up to 12 TB of total storage. Because Local SSDs are tied to the host server, data is lost when the VM is stopped, reset, or terminated—making them suitable only for transient data. Pricing is billed per GB per month based on actual usage. Unlike Persistent Disk, Local SSDs are not managed by Google beyond the hardware layer; formatting, mounting, and resilience are the user's responsibility.

### Use Cases
* High-performance cache layer for databases (Redis, Memcached) or application-level caching requiring sub-millisecond latency
* Scratch processing space for HPC, data analytics, and batch jobs where data is ephemeral and re-creatable
* Temporary storage for Microsoft SQL Server tempdb and Windows pagefile to achieve high-performance database operations
* Shuffle and spill storage for distributed compute frameworks (Spark, Hadoop) running on Compute Engine or Dataproc
* Genomics and scientific computing workloads with large intermediate datasets that do not need to persist beyond job completion
