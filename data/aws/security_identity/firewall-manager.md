---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "Firewall Manager"
pricing_model: "subscription"
managed: true
tier: 3
---
## AWS Firewall Manager

### Description
AWS Firewall Manager is a security management service that lets a designated administrator account centrally configure and enforce firewall rules across all accounts and resources in an AWS Organizations structure. It supports AWS WAF, AWS Shield Advanced, Amazon VPC security groups, AWS Network Firewall, and Amazon Route 53 Resolver DNS Firewall as policy types, allowing a single control plane to govern all these defenses simultaneously. Firewall Manager automatically applies policies to newly created accounts and resources as they join the organization, eliminating the risk of new workloads being deployed without baseline protections. It provides a centralized compliance dashboard that shows which accounts and resources are in or out of compliance with defined security policies, and it can remediate non-compliant resources automatically. The service requires AWS Organizations to be enabled and uses a single Firewall Manager administrator account. Per-account costs for each Firewall Manager policy apply in addition to the costs of the underlying services (WAF, Network Firewall, etc.). It is purpose-built for multi-account enterprises that need consistent, organization-wide firewall governance rather than manually coordinating rule deployments across dozens or hundreds of accounts.

### Use Cases
* Enforce baseline WAF rules across all accounts in an organization (e.g., apply AWS Managed Rules for common vulnerabilities to every ALB and CloudFront distribution in a company's AWS organization from one policy)
* Centrally deploy AWS Network Firewall policies across VPCs in multiple accounts (e.g., create a common set of stateful intrusion detection rules and push them to all production VPCs across business units)
* Automatically enroll all accounts in AWS Shield Advanced for DDoS protection (e.g., ensure every new account that joins the organization immediately receives Shield Advanced coverage without manual action)
* Audit and remediate security group misconfigurations at scale (e.g., detect security groups with 0.0.0.0/0 open on port 22 or 3389 across all accounts and auto-remediate them)
* Enforce Route 53 Resolver DNS Firewall rules organization-wide (e.g., block known malware domains from all VPCs using a centrally managed DNS Firewall policy)
* Generate organization-wide compliance reports (e.g., produce a dashboard showing which accounts have WAF enabled on their ALBs and which do not, for audit and governance purposes)
* Reduce operational burden in large organizations by replacing manual, per-account firewall rule management with a single declarative policy definition
