---
cloud_provider: "Azure"
service_category: "compute"
service_name: "Batch"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Batch

### Description
Azure Batch is a fully managed cloud-scale job scheduling and high-performance computing (HPC) service that enables you to run large-scale parallel and batch workloads across thousands of virtual machines. You define pools of compute nodes (Windows or Linux VMs), submit jobs composed of tasks, and Batch handles queuing, scheduling, execution, re-queuing on failure, and scaling down upon completion — with no upfront cost or cluster infrastructure to manage. It supports Docker containers for lift-and-shift of existing cluster applications, and integrates with Azure Storage for staging input data and retrieving output. Pricing is based only on the underlying compute (VMs, storage, networking) consumed; the Batch service itself has no additional charge. Jobs can use standard on-demand VMs, low-priority Spot VMs for deep discounts, or dedicated reserved capacity. SDKs are available for Python, .NET, Java, and Node.js, and the REST API is also supported.

### Use Cases
* High-performance computing (HPC) simulations (e.g., finite-element analysis, computational fluid dynamics, or seismic processing running across thousands of cores on demand)
* Rendering and media processing (e.g., Blender or 3D rendering pipelines that parallelize frame-by-frame across hundreds of VMs and scale to zero when complete)
* Large-scale batch ETL and data processing (e.g., nightly ingestion jobs that fan out across many tasks, each processing a partition of a data set from Azure Blob Storage)
* Scientific research and genomics (e.g., genome sequencing pipelines that distribute reads across worker VMs and aggregate results back to storage)
* CI/CD and automated test execution at scale (e.g., running thousands of parallel test cases across ephemeral Batch nodes that are deallocated after the run)
* Cost-optimized burst compute using Spot VMs (e.g., running interruptible analytics workloads at up to 90% discount by targeting low-priority nodes with auto-requeue on eviction)
