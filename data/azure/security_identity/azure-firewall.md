---
cloud_provider: "Azure"
service_category: "security_identity"
service_name: "Azure Firewall"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Firewall

### Description
Azure Firewall is a cloud-native, fully stateful managed network security service that protects Azure Virtual Network resources. It provides built-in high availability and unlimited cloud scalability, inspecting both east-west (lateral) and north-south (internet-bound) traffic. Three SKUs are available: Basic (for SMBs, ~250 Mbps throughput), Standard (L3–L7 filtering with Microsoft Cyber Security threat intelligence feeds), and Premium (adds signature-based IDPS with 67,000+ signatures across 50+ categories for advanced threat detection including malware, phishing, and coin mining). Azure Firewall Manager enables centralized policy management across multiple subscriptions and Virtual WAN (Secure Virtual Hub) environments. Threat intelligence feeds are updated in real time to block known malicious IPs and domains.

### Use Cases
* Centralized egress filtering for all Azure VNets — enforce FQDN-based application rules and network rules from a single firewall policy managed via Azure Firewall Manager
* Hybrid network security — inspect traffic between on-premises networks and Azure via ExpressRoute or VPN Gateway using a hub-and-spoke topology
* Intrusion detection and prevention (IDPS) with Azure Firewall Premium — detect and block exploits, malware, and command-and-control traffic using signature-based rules
* TLS inspection with Premium SKU — decrypt, inspect, and re-encrypt outbound TLS traffic to detect threats hidden in encrypted sessions
* Secure Virtual WAN hub — deploy firewall policy directly in a Virtual WAN hub (Secure Virtual Hub) to protect branch-to-branch and branch-to-internet traffic
* URL filtering and web categories — restrict user internet access by category (e.g., social media, gambling) using FQDN tags and web category rules
