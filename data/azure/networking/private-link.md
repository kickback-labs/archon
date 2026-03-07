---
cloud_provider: "Azure"
service_category: "networking"
service_name: "Private Link"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Private Link

### Description
Azure Private Link enables private, secure connectivity from a Virtual Network (VNet) to Azure PaaS services (such as Azure Storage, SQL Database, Cosmos DB, Key Vault), customer-owned services, or Microsoft partner services via private endpoints—private IP addresses within the VNet. Traffic between the VNet and the service travels entirely over the Microsoft global network, never traversing the public internet, which eliminates data exfiltration risks and reduces the attack surface. Private Link works across Microsoft Entra ID tenants and supports access from on-premises networks connected via ExpressRoute or VPN. Private endpoints can also be used for services hosted behind an Azure Standard Load Balancer (Private Link Service), allowing service providers to expose their services privately to customer VNets. The service has a 99.99% SLA and is globally available with no regional restrictions.

### Use Cases
* Private access to Azure PaaS services without public internet exposure (e.g., connecting to Azure SQL Database or Blob Storage from a VNet using a private IP, disabling the public endpoint entirely)
* Preventing data exfiltration from sensitive environments (e.g., mapping specific storage account private endpoints so that even if a VM is compromised, only that account is accessible)
* Cross-tenant private service consumption (e.g., a SaaS provider exposing their Azure-hosted service as a Private Link Service for customers to consume privately in their own VNets)
* Accessing Azure services from on-premises without internet (e.g., connecting to Azure Key Vault or Container Registry over an ExpressRoute private peering via private endpoints)
* Zero-trust backend connectivity for Front Door or Application Gateway (e.g., securing application origins so they are only reachable via Private Link, not via public IP)
* Regulatory compliance requiring data to stay on private networks (e.g., financial or healthcare workloads where all service access must occur over private network paths)
