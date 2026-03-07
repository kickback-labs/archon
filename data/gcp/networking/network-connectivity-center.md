---
cloud_provider: "GCP"
service_category: "networking"
service_name: "Network Connectivity Center"
pricing_model: "on-demand"
managed: true
tier: 2
---
## GCP Network Connectivity Center (NCC)

### Description
Network Connectivity Center (NCC) is a hub-and-spoke orchestration framework that centralizes and simplifies connectivity management across VPC networks, on-premises sites, and other cloud providers. A global NCC hub acts as the central management resource, and spokes represent attached network resources — including VPC networks (VPC spokes), HA VPN tunnels, Cloud Interconnect VLAN attachments, and Router appliance VMs (hybrid spokes), as well as NCC Gateway spokes for third-party Security Service Edge (SSE) inspection. With VPC spokes, NCC exchanges subnet routes between multiple VPC networks across projects or organizations, eliminating the need for complex VPC Network Peering meshes. With hybrid spokes, NCC supports site-to-cloud connectivity (connecting on-premises or other cloud networks to GCP) and site-to-site data transfer (using Google's backbone WAN to route traffic between two external sites without the traffic ever traversing the public internet). Route exchange between VPC and hybrid spokes supports both IPv4 and IPv6 for VPC spokes, and IPv4 for hybrid spokes. NCC integrates with Cloud Router for BGP route advertisement and supports custom route advertisement, hub subnet import for automatic BGP propagation, and Shared VPC networks as spokes. Monitoring is available via Cloud Monitoring and Cloud Logging, and an SLA covers hub availability.

### Use Cases
* Connecting multiple VPC networks across projects or organizations without managing a full VPC Network Peering mesh (e.g., centralizing shared services in a hub VPC accessible by all spoke VPCs)
* Replacing transit VPC topologies by attaching hybrid spokes (Cloud Interconnect VLAN attachments or HA VPN tunnels) to a central NCC hub so all VPC spokes can reach on-premises networks through a single set of hybrid connections
* Using Google's global backbone as an enterprise WAN for site-to-site data transfer between two on-premises data centers without traversing the public internet (e.g., Tokyo ↔ New York via GCP backbone)
* Inserting third-party security appliances (Router appliance VMs or NCC Gateway) between VPC networks to enforce firewall inspection, IDS/IPS, or policy-based routing
* Automatically advertising new VPC spoke subnet ranges to on-premises BGP peers via hybrid spokes using the hub subnet import feature, eliminating manual Cloud Router configuration updates
* Scaling enterprise network architectures by attaching Shared VPC networks as spokes, allowing centralized connectivity governance while maintaining project-level resource isolation
* Resolving complex multi-region, multi-site connectivity requirements where Cloud VPN or Cloud Interconnect alone would require N×(N-1) tunnel configurations
