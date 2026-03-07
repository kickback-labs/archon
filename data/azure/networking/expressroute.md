---
cloud_provider: "Azure"
service_category: "networking"
service_name: "ExpressRoute"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure ExpressRoute

### Description
Azure ExpressRoute enables private, high-bandwidth connections between on-premises datacenters or colocation facilities and Azure datacenters via dedicated leased lines provisioned through connectivity partners, bypassing the public internet entirely. Circuits support bandwidths from 50 Mbps up to 100 Gbps (via ExpressRoute Direct with dedicated physical ports). Traffic receives consistent, low-latency performance with higher reliability and security than internet-based connections, and does not traverse the public internet. ExpressRoute supports peering to Azure private services (Virtual Network), Microsoft services (Office 365, Dynamics 365), and allows Global Reach to interconnect on-premises sites through the Microsoft global backbone. MACsec encryption is supported on ExpressRoute Direct for point-to-point physical link security, and both IPv4 and IPv6 are supported.

### Use Cases
* Extending on-premises datacenters to Azure with predictable, low-latency connectivity (e.g., connecting an enterprise headquarters to Azure VNets for hybrid workloads without internet traffic)
* Regulated industry compliance requiring private network paths (e.g., financial services or healthcare workloads where data must not traverse the public internet)
* High-throughput data migration and replication (e.g., transferring petabytes of data to Azure at up to 100 Gbps for large-scale migrations or disaster recovery replication)
* Hybrid application architectures (e.g., running an intranet web app in Azure that authenticates users via on-premises Active Directory without public internet exposure)
* Connecting multiple on-premises sites via Azure backbone (e.g., using ExpressRoute Global Reach to route branch-office traffic through the Microsoft global network)
* Accessing Microsoft 365 and other Microsoft cloud services privately (e.g., routing Exchange Online and SharePoint traffic through ExpressRoute Microsoft peering)
