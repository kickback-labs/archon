---
cloud_provider: "Azure"
service_category: "networking"
service_name: "Application Gateway"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Application Gateway

### Description
Azure Application Gateway is a fully managed layer-7 (HTTP/HTTPS) web traffic load balancer that routes requests based on URL paths and host headers rather than IP addresses and ports. It provides SSL/TLS termination, autoscaling, zone redundancy, cookie-based session affinity, and URL-path-based or multi-site routing. The v2 SKU integrates natively with Web Application Firewall (WAF) for OWASP-rule-based protection and supports AKS ingress via the Application Gateway Ingress Controller (AGIC). It operates within a VNet and supports Private Link for zero-trust backend connectivity.

### Use Cases
* Layer-7 load balancing for web applications with URL path-based routing (e.g., routing `/api/*` and `/static/*` to separate backend pools)
* SSL/TLS offloading and end-to-end encryption (e.g., terminating TLS at the gateway to reduce backend compute overhead)
* Protecting web applications from OWASP threats (e.g., WAF v2 blocking SQL injection and XSS attacks)
* Multi-site hosting on a single gateway (e.g., routing `app.contoso.com` and `api.contoso.com` to different backend pools)
* AKS ingress controller (e.g., using AGIC to route Kubernetes Ingress resources through Application Gateway)
