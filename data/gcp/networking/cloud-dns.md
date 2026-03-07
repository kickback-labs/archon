---
cloud_provider: "GCP"
service_category: "networking"
service_name: "Cloud DNS"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Cloud DNS

### Description
Cloud DNS is a fully managed, highly available, and scalable authoritative DNS service built on Google's global anycast network infrastructure. It provides 100% uptime SLA for authoritative DNS resolution and automatically scales to handle millions of DNS zones and records without capacity planning. Cloud DNS supports both public and private managed zones, DNS forwarding (for hybrid environments bridging on-premises and GCP DNS namespaces), DNS peering between VPC networks, DNSSEC for public zones, and native integration with GKE for container-native DNS resolution. Cloud Domains, which is tightly integrated, allows domain registration and management directly within GCP.

### Use Cases
* Public authoritative DNS hosting for internet-facing domains with low-latency global resolution via anycast (e.g., serving records for a SaaS product's domain)
* Private DNS zones for internal GCP resources, eliminating the need to expose service endpoints publicly (e.g., resolving internal service hostnames within a VPC)
* Hybrid DNS bridging on-premises and GCP name spaces using DNS forwarding and inbound/outbound server policies (e.g., resolving on-premises hostnames from GCP VMs)
* DNS peering to share a private DNS zone across VPC networks (e.g., shared services VPC exposing internal endpoints to spoke VPCs)
* DNSSEC enablement on public zones to protect against spoofing and cache poisoning attacks
* Container-native DNS for GKE clusters providing scalable in-cluster service discovery without CoreDNS bottlenecks
