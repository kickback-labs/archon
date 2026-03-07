---
cloud_provider: "GCP"
service_category: "networking"
service_name: "Virtual Private Cloud"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Virtual Private Cloud (VPC)

### Description
Google Cloud Virtual Private Cloud (VPC) provides a global, software-defined network that spans all GCP regions within a single logical boundary. Unlike traditional cloud VPCs that are regional, GCP VPCs are global by default, enabling subnets in different regions to communicate over Google's private backbone without traversing the public internet. VPC supports Shared VPC for multi-project organizations, VPC Peering for cross-project and cross-organization connectivity, and CIDR range expansion with no downtime.

### Use Cases
* Isolating workloads within a project using firewall rules and private subnets (e.g., separating web, app, and database tiers)
* Multi-region application networking via a single global VPC to reduce latency and eliminate cross-region NAT
* Shared VPC for centralizing network management across multiple GCP projects in an organization
* Hybrid connectivity to on-premises networks via Cloud Interconnect or Cloud VPN using Cloud Router for BGP route exchange
* Network security and observability with VPC Flow Logs, Packet Mirroring, and firewall rule logging
