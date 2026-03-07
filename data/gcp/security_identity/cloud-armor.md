---
cloud_provider: "GCP"
service_category: "security_identity"
service_name: "Cloud Armor"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Cloud Armor

### Description
Google Cloud Armor is GCP's managed DDoS protection and Web Application Firewall (WAF) service that protects applications running behind Cloud Load Balancing from volumetric DDoS attacks and application-layer (L7) threats such as SQLi, XSS, and OWASP Top 10 vulnerabilities. Security policies contain prioritized rules with configurable match conditions (IP ranges, geographic origin, ASNs, HTTP headers, request body content, custom expressions) and actions (allow, deny, redirect, rate-limit). Cloud Armor enforces policies at Google's global network edge, blocking malicious traffic before it reaches VPC networks or backend resources. Cloud Armor Enterprise adds managed protection with Adaptive Protection (ML-based L7 DDoS detection and auto-suggested mitigation rules), Google Threat Intelligence (known-malicious IP feeds), and advanced network DDoS protection for network load balancers and VMs with public IPs.

### Use Cases
* Protecting public-facing web applications from volumetric DDoS attacks at Google's edge before traffic reaches backend VMs, GKE pods, or serverless backends
* Enforcing WAF rules based on OWASP CRS 3.3.2 preconfigured signatures to block SQLi, XSS, and remote file inclusion attacks without writing custom rules
* Restricting access to applications by IP allowlist/denylist, geographic region, or ASN (e.g., block all traffic from outside allowed countries for compliance)
* Using Adaptive Protection to automatically detect anomalous L7 traffic patterns and generate suggested blocking rules during an active DDoS event
* Applying Cloud Armor edge security policies to Media CDN to protect streaming content delivery from malicious IP ranges and threat intelligence feeds
