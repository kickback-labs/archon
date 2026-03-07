---
cloud_provider: "GCP"
service_category: "compute"
service_name: "Sole-Tenant Nodes"
pricing_model: "on-demand"
managed: false
tier: 2
---
## GCP Sole-Tenant Nodes

### Description
Sole-Tenant Nodes are physical Compute Engine servers dedicated exclusively to a single customer's workloads, ensuring no other customer's VMs share the same physical host. Unlike standard multi-tenant VMs, sole-tenant nodes provide physical isolation that is required for compliance mandates (e.g., PCI DSS, HIPAA), bring-your-own-license (BYOL) scenarios where per-core or per-socket licensing applies (e.g., Windows Server, SQL Server), and workloads where hardware affinity or isolation guarantees are contractually required. Nodes are organized into node groups and provisioned within a single zone; you define a node template specifying the node type (e.g., `n2-node-80-640`) and then create VMs that are scheduled exclusively onto that physical host. Advanced maintenance control lets you set a maintenance window, schedule live migration or in-place restart of VMs on the node, and receive notifications via Pub/Sub or Cloud Monitoring. Pricing is charged per sole-tenant node (the full physical server), regardless of how many VMs run on it; committed use discounts (1- or 3-year) are available for cost reduction, and unused capacity on a node can optionally be filled with regular on-demand VMs.

### Use Cases
* BYOL Windows Server or SQL Server licensing where license costs are calculated per physical core or socket (e.g., running a SQL Server Enterprise workload to avoid per-vCPU virtualization penalties)
* Compliance-driven physical isolation for regulated industries (e.g., PCI DSS workloads requiring attestation that no other tenant shares the hardware)
* Workloads with hardware-affinity requirements such as latency-sensitive databases that must reside on the same physical node for predictable performance
* Migrating on-premises VMware or Hyper-V fleets where licensing agreements require bare-metal or single-tenant hardware
* High-performance computing (HPC) clusters where NUMA topology and memory bandwidth need to be consistent and unshared
* Consolidated billing environments where a single physical server should absorb several small VMs for cost and operational simplicity
