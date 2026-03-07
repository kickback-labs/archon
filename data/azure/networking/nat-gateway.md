---
cloud_provider: "Azure"
service_category: "networking"
service_name: "NAT Gateway"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure NAT Gateway

### Description
Azure NAT Gateway is a fully managed, highly resilient Network Address Translation (NAT) service that provides secure, scalable outbound internet connectivity for resources in a Virtual Network (VNet) subnet. All instances in an attached subnet share the NAT gateway's static public IP addresses or prefixes for outbound connections, while remaining unreachable from the internet for unsolicited inbound traffic. It dynamically allocates SNAT ports to automatically scale outbound connectivity and eliminate SNAT port exhaustion—the primary failure mode of Load Balancer outbound rules. Two SKUs are available: Standard (zonal, up to 50 Gbps) and StandardV2 (zone-redundant, up to 100 Gbps, with IPv6 and flow log support). As of March 31, 2026, new Azure virtual networks default to private subnets, making an explicit outbound method like NAT Gateway required for internet access. TCP and UDP protocols are supported; ICMP is not.

### Use Cases
* Secure outbound internet access for private subnet VMs without assigning public IPs (e.g., VMs running updates or calling external APIs via NAT gateway's static IP, with no inbound exposure)
* Eliminating SNAT port exhaustion for high-connection workloads (e.g., microservices making large numbers of concurrent outbound TCP connections that would exhaust Load Balancer SNAT ports)
* Predictable egress IP allowlisting (e.g., providing a fixed set of public IPs from a /28 prefix to a SaaS partner's firewall allowlist for all outbound traffic from a subnet)
* Zone-redundant outbound connectivity (e.g., using StandardV2 NAT Gateway to maintain outbound connectivity during a single availability zone failure)
* Outbound connectivity for App Service via VNet integration (e.g., routing outbound calls from Azure Web Apps through a NAT Gateway for consistent egress IPs)
* Hub-and-spoke outbound routing (e.g., placing a NAT Gateway in a hub VNet and routing spoke VNet outbound traffic through it for centralized egress management)
* Replacing default outbound access before its retirement (e.g., migrating existing subnets to NAT Gateway as Azure removes default outbound access for new VNets from March 2026 onward)
