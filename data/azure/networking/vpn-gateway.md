---
cloud_provider: "Azure"
service_category: "networking"
service_name: "VPN Gateway"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure VPN Gateway

### Description
Azure VPN Gateway is a managed virtual network gateway that sends encrypted traffic between Azure Virtual Networks and on-premises locations over the public internet using industry-standard IPsec/IKE protocols. It supports Site-to-Site (S2S) VPNs for connecting on-premises networks to Azure VNets, Point-to-Site (P2S) VPNs for individual client connections, and VNet-to-VNet connections between Azure Virtual Networks. Multiple SKUs are available offering throughputs from 100 Mbps up to 10 Gbps (VpnGw5 AZ) with active-active or active-passive configurations for high availability. Zone-redundant SKUs (suffixed with AZ) deploy gateway instances across Availability Zones for resiliency. VPN Gateway supports BGP for dynamic routing, policy-based and route-based VPN types, and coexistence with ExpressRoute circuits.

### Use Cases
* Site-to-Site VPN for connecting on-premises branch offices or datacenters to Azure VNets (e.g., securely extending a corporate network to Azure without a dedicated leased line)
* Point-to-Site VPN for remote worker access (e.g., enabling individual employees to securely connect to Azure virtual machines and resources from laptops or mobile devices)
* VNet-to-VNet connectivity between Azure regions or subscriptions (e.g., linking a production VNet in East US with a disaster recovery VNet in West US)
* Active-active high-availability VPN for critical connectivity (e.g., deploying redundant gateway instances across Availability Zones to eliminate single points of failure)
* Coexistence with ExpressRoute for redundancy (e.g., using VPN as a failover path when an ExpressRoute circuit is unavailable)
* Cost-effective hybrid connectivity for workloads with lower bandwidth requirements (e.g., development and test environments that don't justify the cost of an ExpressRoute circuit)
