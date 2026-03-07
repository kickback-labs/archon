---
cloud_provider: "Azure"
service_category: "networking"
service_name: "Front Door"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Front Door

### Description
Azure Front Door is Microsoft's modern cloud-native Content Delivery Network (CDN) and global application delivery service that combines CDN caching, Layer-7 global HTTP/HTTPS load balancing, SSL/TLS offloading, and integrated security (WAF, bot protection, DDoS protection) in a single globally distributed platform. It operates at the network edge using Microsoft's private global network, accelerating both static and dynamic content delivery by routing requests to the fastest available origin based on latency, health probes, and configurable routing rules. Front Door supports Azure Private Link for zero-trust backend connectivity, a fully customizable rules engine, and real-time traffic and security analytics. It is the strategic replacement for the classic Azure CDN Standard from Microsoft, which is being retired on September 30, 2027. HTTP, HTTPS, and HTTP/2 protocols are supported.

### Use Cases
* Global layer-7 load balancing and failover for web applications (e.g., routing users to the nearest healthy origin across multiple Azure regions)
* Static and dynamic content acceleration (e.g., caching static assets at edge PoPs and accelerating dynamic API responses over the Microsoft private backbone)
* Web application security at the edge (e.g., attaching WAF policies with OWASP rules, bot protection, and DDoS mitigation to protect public-facing APIs)
* Blue/green and canary deployments via weighted traffic routing (e.g., gradually shifting traffic from one app version to another using weighted backend pools)
* Private origin connectivity (e.g., using Azure Private Link to expose internal App Service or AKS backends through Front Door without public IP exposure)
* Replacing classic Azure CDN (e.g., migrating CDN endpoints to Front Door for unified CDN, WAF, and load balancing management)
* SaaS application delivery with multi-tenant routing (e.g., routing requests for different customer subdomains to isolated backend pools)
