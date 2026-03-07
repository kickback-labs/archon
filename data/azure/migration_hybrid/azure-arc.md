---
cloud_provider: "Azure"
service_category: "migration_hybrid"
service_name: "Azure Arc"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Arc

### Description
Azure Arc extends the Azure control plane to resources running outside of Azure, including on-premises datacenters, other public clouds, and edge locations, by projecting them into Azure Resource Manager. It enables organizations to manage servers (Windows/Linux), Kubernetes clusters, SQL Server instances, and Azure data services running anywhere using the same Azure portal, CLI, RBAC, Azure Policy, and monitoring tooling they use for native Azure resources. Arc-enabled Kubernetes supports GitOps-based configuration deployment via Flux, and Arc-enabled data services allow running Azure SQL Managed Instance on any Kubernetes environment with cloud-like elastic scale and automated updates. The control plane functionality (resource organization, RBAC, Azure Resource Graph, tagging) is offered at no extra cost; Azure service usage (Defender, Monitor, etc.) is charged at standard service rates.

### Use Cases
* Applying Azure Policy and RBAC to on-premises Windows/Linux servers to enforce compliance posture uniformly across hybrid environments
* Managing Kubernetes clusters from any distribution (AKS, EKS, GKE, on-prem) under a single Azure pane of glass, with GitOps-driven configuration via Flux
* Running Azure SQL Managed Instance on-premises or at the edge on Arc-enabled Kubernetes to meet data-residency or latency requirements
* Enabling VM lifecycle operations (create, resize, delete, power cycle) on VMware vCenter- and SCVMM-managed on-premises environments through Azure portal and IaC templates
* Deploying Azure Container Apps and Event Grid on Arc-enabled Kubernetes as custom location targets for edge workloads
