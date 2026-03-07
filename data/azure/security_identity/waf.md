---
cloud_provider: "Azure"
service_category: "security_identity"
service_name: "Web Application Firewall"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Web Application Firewall (WAF)

### Description
Azure Web Application Firewall (WAF) provides centralized, managed protection for web applications against common exploits and vulnerabilities such as SQL injection, cross-site scripting (XSS), and OWASP Top 10 threats. Rather than patching each application individually, WAF allows a single policy update to protect all applications simultaneously. It integrates natively with Azure Application Gateway, Azure Front Door, and Azure CDN, and applies rule sets including the OWASP Core Rule Set (CRS) and Microsoft-managed bot protection rules.

### Use Cases
* Protecting public-facing web APIs and applications against OWASP Top 10 attacks (e.g., SQL injection, XSS, command injection) via Application Gateway WAF
* Global edge-based WAF enforcement at Azure Front Door to protect apps distributed across multiple regions from a single policy
* Bot mitigation — blocking malicious bots and scrapers while allowing legitimate crawlers (e.g., search engines) using bot manager rule sets
* Custom rule authoring — allow/deny or rate-limit traffic based on geo-location, IP ranges, HTTP headers, or URI patterns
* Centralized WAF logging to Azure Monitor or Log Analytics for threat visibility, alerting, and compliance auditing
