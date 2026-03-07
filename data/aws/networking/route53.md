---
cloud_provider: "AWS"
service_category: "networking"
service_name: "Route 53"
pricing_model: "per-request"
managed: true
tier: 1
---
## AWS Route 53

### Description
Amazon Route 53 is a highly available and scalable cloud DNS service that combines authoritative DNS, domain name registration, and health-based traffic routing in a single product. It resolves domain names using globally distributed DNS servers and supports routing policies including Simple, Weighted, Latency-based, Failover, Geolocation, Geoproximity, IP-based, and Multi-value Answer routing. Route 53 health checks continuously monitor endpoints and automatically failover traffic to healthy targets. Route 53 Resolver provides recursive DNS for VPCs, with inbound and outbound endpoints for hybrid DNS resolution. The Resolver DNS Firewall allows blocking of malicious domains at the DNS layer. Pricing is per hosted zone and per million queries.

### Use Cases
* Routing end-user traffic to internet-facing applications with high availability (e.g., active-active multi-region with latency routing)
* Automated DNS failover when primary endpoints become unhealthy (e.g., redirecting to secondary region)
* Private DNS resolution inside VPCs for internal services (e.g., microservices resolving each other by name)
* Domain name registration and management within AWS
* Blocking DNS queries to known malicious domains using Route 53 Resolver DNS Firewall
