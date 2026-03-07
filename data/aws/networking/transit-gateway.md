---
cloud_provider: "AWS"
service_category: "networking"
service_name: "Transit Gateway"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Transit Gateway

### Description
AWS Transit Gateway is a regional network hub that connects VPCs, AWS accounts, VPN connections, and Direct Connect gateways through a single managed gateway, replacing complex full-mesh VPC peering arrangements. Each new connection to Transit Gateway is a single attachment, regardless of how many other networks are connected. Transit Gateway supports route tables for network segmentation, allowing control over which VPCs and networks can communicate with each other. Inter-Region peering allows Transit Gateway instances in different AWS regions to connect over the AWS global backbone with encryption. Multicast is natively supported for applications that require one-to-many delivery. Transit Gateway Network Manager provides a centralised dashboard for monitoring Transit Gateway topology and route-change events across regions. Bandwidth scales automatically up to 50 Gbps per attachment.

### Use Cases
* Simplifying hub-and-spoke network architectures across hundreds of VPCs and accounts (e.g., replacing N*(N-1)/2 VPC peering connections with N Transit Gateway attachments)
* Centralising shared services (e.g., Active Directory, DNS, security inspection) accessible from all VPCs via Transit Gateway
* Building multi-region global networks by peering Transit Gateways across regions
* Connecting multiple VPN and Direct Connect links to AWS networks without per-VPC configuration
* Enabling multicast traffic delivery for on-premises multicast applications migrated to AWS
* Network segmentation using separate Transit Gateway route tables for different security domains (e.g., production vs. development environments)
