---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "Security Hub"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Security Hub

### Description
AWS Security Hub is a cloud security posture management (CSPM) and security operations hub that centralizes visibility across AWS accounts and regions, aggregates findings from multiple security services, and prioritizes the most critical issues for response. It ingests findings from native AWS services (GuardDuty, Inspector, Macie, IAM Access Analyzer, Firewall Manager, and others) as well as third-party security tools via a standardized finding format (ASFF — AWS Security Finding Format). Security Hub correlates and enriches these signals using near-real-time risk analytics to surface actionable insights rather than raw alert noise. It continuously evaluates resource configurations against security standards including AWS Foundational Security Best Practices, CIS AWS Benchmarks, PCI DSS, and NIST 800-53, generating automated compliance findings. Automated response workflows can be triggered via Amazon EventBridge and integrated with ticketing systems (e.g., Jira, ServiceNow) or AWS Systems Manager Automation runbooks. Security Hub supports multi-account and multi-region deployments through AWS Organizations, with a designated administrator account aggregating findings across the entire organization.

### Use Cases
* Centralizing security findings from GuardDuty, Inspector, Macie, and third-party tools into a single pane of glass across all AWS accounts in an Organization
* Continuously monitoring resource configurations against CIS, PCI DSS, or AWS Foundational Security Best Practices standards and receiving automated compliance findings
* Prioritizing which security issues require immediate remediation using correlated risk analytics and attack path visualization (e.g., identifying a publicly exposed EC2 instance with critical CVEs and GuardDuty findings)
* Automating response workflows for common findings (e.g., automatically revoking overly permissive S3 bucket policies via an EventBridge rule + Lambda remediation)
* Aggregating and normalizing findings from third-party security tools (e.g., Palo Alto Prisma, CrowdStrike) using the ASFF standard format
* Monitoring exposure and attack paths to understand how threats, vulnerabilities, and misconfigurations could chain together to reach critical resources
* Integrating with SIEM or ticketing systems (e.g., Splunk, Jira) for security operations workflow automation at scale
