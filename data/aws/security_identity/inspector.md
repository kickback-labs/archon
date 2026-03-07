---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "Inspector"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Amazon Inspector

### Description
Amazon Inspector is a fully managed vulnerability management service that continuously scans AWS workloads for software vulnerabilities and unintended network exposure. It automatically discovers and assesses EC2 instances (both agent-based and agentless), container images in Amazon ECR, AWS Lambda functions, and code repositories for known CVEs using over 50 sources of vulnerability intelligence. Inspector generates an Inspector risk score — a contextual score combining CVE severity, network reachability, and exploitability — to help teams prioritize remediation by actual risk rather than raw CVE score. It integrates with CI/CD pipelines to shift security left, enabling vulnerability scanning of container images and code before deployment. Inspector also supports centralized Software Bill of Materials (SBOM) export for all monitored resources, which is useful for compliance and supply chain security. Findings are aggregated in the Inspector console and can be forwarded to AWS Security Hub for centralized security operations. The service requires no agents for agentless EC2 scanning and uses the Amazon SSM Agent for agent-based scanning.

### Use Cases
* Continuously scanning EC2 instances and container images in ECR for known CVEs without managing scanning infrastructure (e.g., automatic re-scan triggered when a new CVE is published)
* Prioritizing vulnerability remediation using contextual risk scores that factor in network exposure and exploitability (e.g., deprioritizing a critical CVE on a non-internet-reachable instance)
* Embedding container image vulnerability scanning in a CI/CD pipeline to block deployment of images with high-severity vulnerabilities
* Scanning Lambda function packages for vulnerable dependencies before and after deployment
* Generating and exporting SBOMs for all monitored resources to support supply chain security audits or regulatory requirements (e.g., FedRAMP, PCI DSS)
* Meeting compliance requirements for automated vulnerability scanning under frameworks such as NIST CSF, PCI DSS, and CIS benchmarks
* Routing Inspector findings to Security Hub for unified prioritization alongside GuardDuty and Macie findings
