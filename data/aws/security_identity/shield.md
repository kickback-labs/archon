---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "Shield"
pricing_model: "subscription"
managed: true
tier: 2
---
## AWS Shield

### Description
AWS Shield is a managed DDoS protection service that defends AWS-hosted applications against distributed denial-of-service attacks at layers 3, 4, and 7. It offers two tiers: Shield Standard (included at no cost for all AWS customers, providing automatic protection against the most common network and transport layer attacks) and Shield Advanced (a paid subscription providing enhanced protection for EC2, ELB, CloudFront, Global Accelerator, and Route 53 resources). Shield Advanced delivers automatic inline mitigation using Amazon's global threat intelligence, custom traffic baselining to detect anomalies like HTTP floods and DNS query floods, and access to the AWS Shield Response Team (SRT) for expert guidance during active incidents. It also includes a network security director capability (in preview) that analyzes resource configurations, visualizes network topology, identifies security misconfigurations, and provides actionable remediation recommendations. Shield Advanced integrates with AWS WAF to enable application-layer protections as part of a DDoS response. Customers with Shield Advanced receive DDoS cost protection — credits against scaling charges incurred during an attack.

### Use Cases
* Protecting internet-facing applications (e.g., CloudFront distributions, ALBs, API Gateway) against volumetric DDoS attacks automatically with Shield Standard
* Subscribing to Shield Advanced for high-value, latency-sensitive workloads that require sub-second mitigation and SRT support (e.g., financial trading platforms, gaming backends)
* Defending against application-layer (L7) attacks such as HTTP floods by combining Shield Advanced with AWS WAF rules
* Using the Shield network security director to identify misconfigured or overly permissive network resources before they are exploited
* Mitigating SYN floods, UDP reflection attacks, and DNS query floods across EC2 and Route 53 resources
* Receiving DDoS cost protection credits to offset auto-scaling charges triggered by attack traffic
