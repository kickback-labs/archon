---
cloud_provider: "Azure"
service_category: "networking"
service_name: "Virtual Network"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Virtual Network (VNet)

### Description
Azure Virtual Network is the fundamental networking building block for private networks in Azure, enabling Azure resources such as VMs, AKS clusters, and App Service Environments to communicate securely with each other, the internet, and on-premises networks. VNets provide network isolation and segmentation through subnets, and support traffic filtering via Network Security Groups (NSGs) and routing via custom route tables. Resources can connect to on-premises networks through Site-to-Site VPN or ExpressRoute, and VNets can be linked together across regions via VNet peering. Azure Virtual Network itself carries no charge; costs apply only to resources deployed within it or to connectivity services like VPN Gateway and ExpressRoute.

### Use Cases
* Isolating and segmenting workloads (e.g., separating web, application, and database tiers into subnets with NSG rules)
* Extending on-premises networks into Azure (e.g., hybrid cloud via Site-to-Site VPN or ExpressRoute)
* Connecting multiple Azure regions or subscriptions (e.g., global hub-and-spoke topology via VNet peering)
* Securing private access to Azure PaaS services (e.g., Azure Storage or SQL Database via service endpoints or Private Link)
* Hosting containerised workloads with private networking (e.g., AKS clusters with CNI networking within a VNet)
