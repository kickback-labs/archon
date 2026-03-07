---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "Network Firewall"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Network Firewall

### Description
AWS Network Firewall is a managed, stateful network firewall and intrusion detection/prevention service (IDS/IPS) that protects Amazon VPCs against network threats. It supports stateless and stateful packet inspection, deep packet inspection (DPI), TLS inspection (decrypt, inspect, re-encrypt), domain-based filtering, geographic IP filtering, and an intrusion prevention system (IPS) with Suricata-compatible rule sets. Network Firewall scales automatically with traffic volume, eliminating the need to manage firewall appliances. It integrates with AWS Firewall Manager for centralized policy deployment across multiple accounts and VPCs, and with AWS Transit Gateway for hub-and-spoke inspection architectures. AWS managed threat intelligence rules powered by Amazon's threat data can automatically block known-malicious IPs and domains. Third-party rule sets from AWS Marketplace partners (covering web filtering, known-bad-IP blocking, and other use cases) can also be applied. Firewall endpoints are deployed per Availability Zone and traffic is routed through them using VPC routing.

### Use Cases
* Filtering inbound and outbound VPC traffic using stateful rules to block unauthorized protocols and ports (e.g., blocking all outbound traffic except HTTPS and DNS)
* Preventing data exfiltration by restricting outbound HTTP/HTTPS traffic to an allowlist of approved domains (e.g., only permitting traffic to known package registries and SaaS endpoints)
* Deploying an IPS to detect and block known attack signatures and exploit attempts against EC2 or container workloads
* Inspecting and filtering East-West traffic between VPCs through AWS Transit Gateway in a centralized inspection architecture
* Using geographic IP filtering to block or allow traffic based on source or destination country (e.g., restricting access to a service to specific regions)
* Applying TLS inspection to decrypt, monitor, and re-encrypt encrypted traffic flows for threat visibility
* Centralizing firewall policy management across multiple AWS accounts using AWS Firewall Manager integration
