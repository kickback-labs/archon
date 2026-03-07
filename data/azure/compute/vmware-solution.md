---
cloud_provider: "Azure"
service_category: "compute"
service_name: "VMware Solution"
pricing_model: "on-demand"
managed: true
tier: 3
---
## Azure VMware Solution (AVS)

### Description
Azure VMware Solution (AVS) is a fully managed service that runs VMware Cloud Foundation (VCF) private clouds on dedicated bare-metal Azure infrastructure. Each private cloud includes VMware vCenter Server, vSAN, vSphere, NSX, and HCX, allowing organizations to migrate or extend on-premises VMware environments to Azure without refactoring, rehosting, or retraining staff. Microsoft manages and maintains the private cloud infrastructure—including patching and upgrading all VMware components—while customers retain full control over VM workloads, network segments, and vSphere RBAC. A minimum of three hosts is required per cluster, with up to 16 hosts per cluster and multiple clusters per private cloud. Host SKUs range from AV36 (36-core, 576 GB RAM) to AV64 (64-core, 1 TB RAM) to suit different workload densities. Connectivity to on-premises environments is provided via ExpressRoute Global Reach, and Azure services are accessible natively from the private cloud. AVS supports Azure Hybrid Benefit for Windows Server and SQL Server licenses, and provides three years of free Extended Security Updates for end-of-support Windows and SQL Server versions. The Forrester TEI study projects a 298% ROI and a payback period of under six months.

### Use Cases
* Datacenter exit and cloud migration (e.g., lifting entire VMware vSphere environments to Azure without VM conversion or application changes)
* Datacenter capacity extension on demand (e.g., bursting to AVS during hardware refresh cycles or peak seasonal periods to avoid capital expenditure)
* Disaster recovery and business continuity (e.g., using VMware Site Recovery Manager or JetStream on AVS as a secondary DR site for on-premises vSphere clusters)
* Workload modernization with Azure services (e.g., connecting VMs running on AVS to Azure SQL, Azure OpenAI, or Azure Monitor without leaving the VMware environment)
* Legacy workload compliance hosting (e.g., keeping Windows Server 2012 / SQL Server 2014 workloads on AVS to receive free Extended Security Updates while planning migration)
* Hybrid VMware management (e.g., using existing vCenter, NSX, and HCX skills and tooling uniformly across on-premises and AVS environments)
