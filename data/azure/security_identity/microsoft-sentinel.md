---
cloud_provider: "Azure"
service_category: "security_identity"
service_name: "Microsoft Sentinel"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Microsoft Sentinel

### Description
Microsoft Sentinel is a cloud-native SIEM (Security Information and Event Management) and SOAR (Security Orchestration, Automation, and Response) platform built on Azure Monitor Log Analytics. It collects security data at scale across users, devices, applications, and infrastructure spanning Azure, other clouds, and on-premises environments via 200+ built-in data connectors. AI-powered analytics, MITRE ATT&CK framework mapping, and Microsoft threat intelligence are used to detect threats, minimize false positives, and surface high-fidelity incidents. Analysts can investigate incidents using an interactive entity graph, run Jupyter notebook-based threat hunts, and automate response workflows using Logic Apps playbooks and automation rules. Microsoft Sentinel is transitioning from the Azure portal to the unified Microsoft Defender portal (full migration by March 31, 2027), where it integrates with Microsoft Defender XDR for unified security operations.

### Use Cases
* Centralized multicloud SIEM — ingest logs from Azure, AWS, GCP, on-premises systems, and third-party SaaS apps (e.g., Salesforce, ServiceNow) into a single workspace for unified threat visibility
* Threat detection with built-in analytics — use out-of-the-box analytic rules and Microsoft threat intelligence to detect threats such as credential theft, lateral movement, and data exfiltration
* MITRE ATT&CK coverage mapping — visualize gaps in detection coverage across tactics and techniques; build custom hunting queries targeting specific ATT&CK techniques
* Automated incident response (SOAR) — trigger Logic Apps playbooks automatically on incidents to perform actions like blocking IPs, resetting passwords, or opening ServiceNow tickets
* Proactive threat hunting — use KQL-based hunting queries and Jupyter notebooks to search for indicators of compromise before alerts are triggered
* Regulatory compliance and audit — correlate security events with compliance standards; stream data to external SIEMs or long-term storage (e.g., Azure Storage, Splunk) via diagnostic settings
* Unified security operations with Microsoft Defender XDR — combine Sentinel SIEM with Defender XDR telemetry in the Defender portal for end-to-end attack story investigation across endpoints, identities, email, and cloud apps
