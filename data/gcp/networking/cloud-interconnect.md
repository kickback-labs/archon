---
cloud_provider: "GCP"
service_category: "networking"
service_name: "Cloud Interconnect"
pricing_model: "on-demand"
managed: true
tier: 2
---
## GCP Cloud Interconnect

### Description
Cloud Interconnect provides low-latency, high-availability private connectivity between on-premises networks (or other cloud providers) and Google Cloud VPC networks, bypassing the public internet entirely. It offers four connection types: Dedicated Interconnect (direct 10-Gbps or 100-Gbps physical connections at Google colocation facilities, up to 8×10 Gbps or 2×100 Gbps per connection), Partner Interconnect (through a supported service provider, 50 Mbps–50 Gbps VLAN attachments), Cross-Cloud Interconnect (direct physical connections to AWS, Azure, OCI, or Alibaba Cloud), and Cross-Site Interconnect (connecting on-premises sites through Google's backbone). VLAN attachments are used to connect Cloud Interconnect circuits to VPC networks via Cloud Router BGP sessions, enabling dynamic route exchange. Cloud Interconnect supports MACsec encryption for Layer 2 security and HA VPN over Cloud Interconnect for IPsec encryption meeting compliance requirements. SLA tiers are 99.99% (critical production with redundant connections) and 99.9% (non-critical). Unlike Cloud VPN, Cloud Interconnect can directly reduce egress costs because traffic does not traverse the public internet, and on-premises hosts can reach internal VPC IP addresses without NAT.

### Use Cases
* Dedicated Interconnect for large-scale, high-throughput data migration or replication between on-premises data centers and GCP (e.g., petabyte-scale data pipelines)
* Partner Interconnect for enterprises that cannot co-locate at a Google facility but need private connectivity through an ISP or network provider
* Hybrid cloud architectures where on-premises systems must access GCP VPC resources using private internal IPs (e.g., database backends inaccessible from the internet)
* Cross-Cloud Interconnect for direct private connectivity between GCP and AWS, Azure, OCI, or Alibaba Cloud to reduce multi-cloud egress costs
* Meeting regulatory or security compliance requirements by keeping traffic off the public internet, optionally adding MACsec or HA VPN encryption
* Low-latency, high-bandwidth connectivity for latency-sensitive workloads such as real-time analytics, financial trading systems, or media rendering farms
* Redundant 99.99% SLA configurations with geographically diverse connections to support business-critical production workloads
