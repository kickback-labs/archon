---
cloud_provider: "AWS"
service_category: "networking"
service_name: "Direct Connect"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Direct Connect

### Description
AWS Direct Connect establishes a dedicated, private network connection from an on-premises environment to AWS, bypassing the public internet entirely. Traffic remains on the AWS global backbone, providing more consistent network performance, lower latency, and predictable bandwidth compared to internet-based connections. Direct Connect supports two connection types: dedicated connections (1 Gbps, 10 Gbps, or 100 Gbps physical ports allocated to a single customer) and hosted connections (50 Mbps–10 Gbps, provisioned by an AWS Direct Connect Delivery Partner). Multiple Virtual Interfaces (VIFs) can be created on a single connection: Private VIFs connect to VPCs, Public VIFs reach AWS public endpoints (S3, DynamoDB), and Transit VIFs attach to Transit Gateway for multi-VPC routing. For site-to-site interconnection between Direct Connect locations without going through AWS VPCs, Direct Connect SiteLink is available. Data transfer rates are lower than internet transfer costs and connections can be encrypted using MACsec (for dedicated connections) or IPSec VPN over Direct Connect.

### Use Cases
* Connecting on-premises data centers to AWS with consistent, low-latency network performance (e.g., latency-sensitive financial trading applications)
* Migrating large datasets to AWS more reliably than over the internet (e.g., petabyte-scale database migrations)
* Extending corporate networks to AWS VPCs as a private hybrid connectivity foundation
* Reducing data transfer costs for sustained high-volume traffic between on-premises and AWS
* Connecting multiple offices via the AWS backbone using Direct Connect SiteLink (e.g., global WAN replacement)
* Meeting regulatory requirements that prohibit data traversal over the public internet
