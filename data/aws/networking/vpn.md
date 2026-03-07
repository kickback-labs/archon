---
cloud_provider: "AWS"
service_category: "networking"
service_name: "Site-to-Site VPN"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Site-to-Site VPN

### Description
AWS Site-to-Site VPN is a fully managed IPSec VPN service that creates an encrypted connection between an on-premises network (or another cloud) and an AWS VPC or Transit Gateway. Each VPN connection uses two redundant tunnels across different Availability Zones to ensure high availability — if one tunnel fails, traffic automatically routes through the other. The service supports BGP for dynamic routing and static routing for simpler configurations. The Accelerated Site-to-Site VPN option routes traffic through AWS Global Accelerator Anycast endpoints, reducing latency for globally distributed environments. VPN connections are typically used as a cost-effective alternative to Direct Connect for lower-bandwidth or non-latency-critical workloads, and as a backup to Direct Connect for critical hybrid workloads. Throughput per tunnel is up to 1.25 Gbps, with multiple tunnels available for aggregated bandwidth.

### Use Cases
* Establishing encrypted hybrid connectivity between on-premises networks and AWS VPCs quickly (e.g., initial cloud migration phase before Direct Connect is provisioned)
* Providing backup connectivity alongside Direct Connect for high-availability hybrid architectures
* Connecting branch offices or remote sites to centrally managed Transit Gateway
* Accelerating VPN traffic using Global Accelerator for improved global performance
* Enabling secure cloud access from home offices or small locations that don't require dedicated connectivity
