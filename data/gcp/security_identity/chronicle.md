---
cloud_provider: "GCP"
service_category: "security_identity"
service_name: "Google Security Operations"
pricing_model: "subscription"
managed: true
tier: 2
---
## GCP Google Security Operations (Chronicle)

### Description
Google Security Operations (formerly Chronicle) is a cloud-native SIEM (Security Information and Event Management) and security analytics platform, built as a specialized layer on top of Google's core infrastructure. It ingests, normalizes, indexes, and correlates massive volumes of security and network telemetry — retaining it for months or longer — and provides instant analysis, threat detection, and investigation capabilities. Data can be ingested via a lightweight forwarder (supporting syslog, packet capture, and existing SIEM repositories), collector agents, direct ingestion APIs, or third-party cloud integrations (e.g., Office 365, Azure AD logs). The platform normalizes raw logs using a Unified Data Model (UDM) for consistent querying across sources. The built-in Detection Engine lets security teams author YARA-L rules to automate detection of known and novel threats across all incoming data. Investigation views (asset, IP, domain, hash, user) and procedural filtering allow analysts to rapidly contextualize potential compromises. VirusTotal integration is available for enriching indicators of compromise. Google Security Operations also integrates with the broader Google SecOps suite (SOAR capabilities, curated threat intelligence) for end-to-end SecOps workflows.

### Use Cases
* Centralize and retain security telemetry (firewall logs, EDR events, cloud audit logs, DNS traffic) across an enterprise at petabyte scale for months or years, enabling historical threat hunting without data expiry constraints
* Author YARA-L detection rules in the Detection Engine to automatically alert on lateral movement patterns, privilege escalation, or custom threat signatures across all normalized log sources
* Investigate a suspected breach by pivoting through asset, IP, domain, and user views to reconstruct the full attack timeline and determine the blast radius within minutes
* Correlate cloud audit logs (GCP, AWS, Azure) with endpoint and network telemetry to detect cross-environment threats such as credential theft followed by cloud resource exfiltration
* Perform raw log scans and regex searches across unparsed logs to hunt for IoCs (e.g., a newly identified C2 domain) across all ingested data without requiring pre-parsed schemas
* Replace or augment an on-premises SIEM to eliminate hardware and index management overhead while achieving Google-scale query performance for large enterprises (millions of EPS)
* Feed Google SecOps SOAR playbooks with detections from the SIEM to automate analyst workflows such as ticket creation, IP blocking, and stakeholder notifications
