---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "WAF"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS WAF (Web Application Firewall)

### Description
AWS WAF is a managed web application firewall that protects web applications and APIs against common exploits and bots. It allows you to create rules that filter HTTP/S requests based on IP addresses, HTTP headers, URI paths, query strings, and body content, and provides managed rule groups maintained by AWS and AWS Marketplace partners. WAF integrates with Amazon CloudFront, Application Load Balancer, API Gateway, and AWS AppSync. It provides automatic layer 7 DDoS protection, bot control, and account takeover prevention.

### Use Cases
* Blocking common OWASP web attack patterns (e.g., SQL injection and cross-site scripting) on public-facing APIs
* Rate-limiting or blocking bot traffic using the Bot Control managed rule group
* Preventing account takeover fraud by monitoring login endpoints for credential stuffing attacks
* Geo-blocking or geo-restricting web traffic by country
* Centralizing WAF policies across multiple accounts using AWS Firewall Manager
