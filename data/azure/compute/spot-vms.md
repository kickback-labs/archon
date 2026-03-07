---
cloud_provider: "Azure"
service_category: "compute"
service_name: "Spot Virtual Machines"
pricing_model: "on-demand"
managed: false
tier: 2
---
## Azure Spot Virtual Machines

### Description
Azure Spot Virtual Machines (Spot VMs) provide access to unused Azure compute capacity at discounts of up to 90% compared to pay-as-you-go prices, making them ideal for cost-optimized, interruption-tolerant workloads. Spot VMs use the same hardware, VM series, and OS options as standard Azure VMs, but availability and price fluctuate with Azure's spare capacity. When Azure needs to reclaim that capacity — either because demand increases or when the current Spot price exceeds your configured maximum price — workloads are evicted with a 30-second notification via Scheduled Events, giving applications time to checkpoint state or flush data. You can set a maximum price cap (in USD) or accept eviction at any price above pay-as-you-go; if no capacity is available or the price ceiling is exceeded, the VM is deallocated or deleted based on your eviction policy. Spot VMs are available on individual VMs and on Azure Virtual Machine Scale Sets (VMSS), and can be combined with Azure Compute Fleet for automated multi-region, multi-size capacity acquisition. Spot pricing is not covered by an SLA; workloads requiring high availability should complement Spot VMs with standard on-demand instances or use VMSS with mixed instance policies.

### Use Cases
* Batch and HPC workloads (e.g., running parallelized scientific simulations or rendering jobs on Azure Batch pools of Spot VMs with automatic task requeue on eviction)
* CI/CD and automated test pipelines (e.g., spinning up ephemeral Spot VM agents for build and test jobs that tolerate interruption and restart from a clean state)
* Big data and analytics processing (e.g., running distributed Spark or Hadoop jobs on VMSS Spot nodes where intermediate state is checkpointed to Azure Blob Storage)
* Dev/test environments (e.g., non-production environments and developer sandboxes that can be evicted overnight and recreated the next day at a fraction of the on-demand cost)
* Stateless containerized workloads (e.g., deploying AKS node pools with Spot VMs for background microservices where the scheduler can rebalance pods on eviction)
* Cost-optimized scale-out with mixed capacity (e.g., using Azure Compute Fleet to automatically find and provision Spot capacity across multiple VM sizes and regions to hit a target vCPU count at minimum cost)
