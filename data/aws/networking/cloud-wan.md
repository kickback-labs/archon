---
cloud_provider: "AWS"
service_category: "networking"
service_name: "Cloud WAN"
pricing_model: "on-demand"
managed: true
tier: 3
---
## AWS Cloud WAN

### Description
AWS Cloud WAN is a managed wide-area network (WAN) service that provides a central dashboard and policy-based automation for building, managing, and monitoring a global network spanning AWS VPCs, on-premises data centers, and branch offices. Cloud WAN uses a core network concept with segments (logical routing domains for traffic isolation, e.g., production and shared services) and attachment policies that define how VPCs, Site-to-Site VPNs, Direct Connect gateways, and Transit Gateways connect to segments. Network policies are expressed as JSON documents, enabling infrastructure-as-code WAN management. Cloud WAN leverages the AWS global backbone for inter-region traffic and integrates with AWS Network Manager for unified topology visibility and event monitoring. It is designed to replace or complement Transit Gateway for organisations that need a unified, multi-region, policy-driven global network.

### Use Cases
* Building a global enterprise WAN that spans multiple AWS regions, on-premises data centers, and branch offices under a single management plane
* Replacing complex multi-region Transit Gateway mesh topologies with a centralised, policy-driven core network
* Enforcing network segmentation across the global WAN (e.g., isolating production traffic from development without creating separate Transit Gateways per region)
* Connecting branch offices using preferred local network providers and routing traffic over the AWS backbone for inter-site connectivity
* Simplifying monitoring and troubleshooting of a multi-region network from a single Network Manager dashboard
* Accelerating hybrid network provisioning through JSON policy automation applied uniformly across all attachment types
