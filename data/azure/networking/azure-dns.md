---
cloud_provider: "Azure"
service_category: "networking"
service_name: "Azure DNS"
pricing_model: "per-request"
managed: true
tier: 1
---
## Azure DNS

### Description
Azure DNS is a managed DNS hosting and resolution service built on Microsoft's global infrastructure, covering both public DNS zones for internet-facing domains and private DNS zones for name resolution within Azure virtual networks. It includes Azure DNS Private Resolver, which enables bidirectional DNS resolution between on-premises environments and Azure private zones without requiring VM-based DNS servers. Azure DNS also integrates Azure Traffic Manager for DNS-based global traffic routing and load balancing, and provides a DNS Security Policy feature that filters queries based on Microsoft's threat-intelligence feed to block known malicious domains.

### Use Cases
* Hosting public DNS zones for internet-facing domains (e.g., delegating `contoso.com` to Azure DNS and managing records alongside other Azure resources)
* Private DNS resolution within VNets (e.g., auto-registering VM hostnames in a private zone for service discovery)
* Hybrid DNS resolution (e.g., using DNS Private Resolver to resolve Azure private zone names from on-premises without VM-based forwarders)
* DNS-based global traffic routing (e.g., using Traffic Manager with DNS to direct users to the nearest healthy regional endpoint)
* DNS security and threat prevention (e.g., enabling DNS Security Policy to block queries to known malicious domains at the VNet level)
