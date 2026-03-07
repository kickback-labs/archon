---
cloud_provider: "Azure"
service_category: "migration_hybrid"
service_name: "Azure Stack Hub"
pricing_model: "on-demand"
managed: false
tier: 2
---
## Azure Stack Hub

### Description
Azure Stack Hub is an on-premises extension of Azure that allows organizations to run Azure-consistent IaaS and PaaS services from their own datacenter on integrated hardware appliances (4–16 servers per scale unit) delivered by Microsoft hardware partners. It is designed for edge and disconnected scenarios — factory floors, ships, remote sites, regulated industries — where latency, intermittent connectivity, or data-residency requirements prevent use of the public cloud. The appliance exposes the same Azure Resource Manager API surface, portals, and DevOps tooling as public Azure, enabling a single consistent operating model across both environments. Customers own and operate the hardware; Microsoft provides the software platform and support. Azure Stack Hub can be deployed connected to global Azure (hybrid) or fully air-gapped (disconnected), using either Microsoft Entra ID or Active Directory Federation Services (AD FS) for identity.

### Use Cases
* Delivering Azure-consistent compute (VMs), storage, and networking from an on-premises datacenter for workloads that cannot leave a geographic boundary due to regulatory or data-sovereignty requirements
* Building and running edge solutions with intermittent or no internet connectivity (factory automation, offshore installations, mining operations) using the same app code and tooling as Azure
* Offering App Service, SQL Server, and MySQL as PaaS services to internal tenant teams in a private cloud model managed by the organization
* Applying consistent DevOps pipelines across Azure and Azure Stack Hub so that cloud-native app patterns (containers, serverless, microservices) can run on-premises without code changes
* Meeting disaster-recovery and business-continuity requirements in regions where Azure public cloud regions are not yet available
