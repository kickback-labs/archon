---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "Security Lake"
pricing_model: "on-demand"
managed: true
tier: 3
---
## Amazon Security Lake

### Description
Amazon Security Lake is a fully managed service that automatically centralizes security log and event data from AWS services, SaaS providers, on-premises sources, and third-party cloud environments into a purpose-built, customer-owned data lake stored in Amazon S3. Security Lake adopts the Open Cybersecurity Schema Framework (OCSF), an open standard co-developed by AWS and industry partners, which normalizes security data from diverse sources into a consistent schema — eliminating the need for custom parsers when combining logs from different vendors. Supported native AWS sources include CloudTrail management and data events, VPC Flow Logs, Route 53 Resolver query logs, Security Hub findings, AWS WAF logs, Amazon EKS audit logs, and Lambda execution logs. Third-party log sources from partners (SIEMs, EDRs, identity providers, firewalls) can be integrated via the OCSF-normalized contribution model. Security Lake supports rollup Regions, where data from multiple source Regions can be aggregated into a single Region for centralized analysis and compliance reporting. Lifecycle policies allow automatic partitioning and tiering of security data in S3 (Standard to Glacier) to optimize storage costs over time. Subscriber integrations let analytics tools such as Amazon Athena, Amazon OpenSearch, or third-party SIEMs (Splunk, IBM QRadar, Palo Alto XSIAM) query the data lake directly without data duplication. Pricing is based on the volume of data ingested and processed, plus standard S3 storage costs; AWS sources are ingested at no additional charge beyond the cost of the underlying service generating the logs.

### Use Cases
* Centralize multi-source, multi-account security telemetry (e.g., aggregate CloudTrail, VPC Flow Logs, and GuardDuty findings from 200 AWS accounts across 10 regions into a single S3-based data lake in a central security account)
* Normalize and correlate heterogeneous security data using OCSF (e.g., ingest logs from AWS, CrowdStrike EDR, and Okta identity provider into a common schema, enabling cross-source correlation without custom ETL)
* Enable long-term security data retention for compliance (e.g., retain 12+ months of CloudTrail and VPC Flow Logs with automated S3 lifecycle tiering to Glacier for cost-effective storage, satisfying SOC 2 or PCI DSS audit requirements)
* Power SIEM analytics without data duplication (e.g., configure Splunk as a Security Lake subscriber so it can query normalized OCSF data directly from S3 without copying data into a separate Splunk index)
* Conduct cross-environment threat hunting (e.g., query petabytes of historical network flow, API call, and DNS query data using Amazon Athena to identify indicators of compromise that span both AWS and on-premises environments)
* Simplify multi-region compliance reporting (e.g., configure a rollup Region to aggregate security events from all source Regions so a compliance team can query a single dataset for regulatory reporting)
* Reduce time-to-investigation for security incidents (e.g., give SOC analysts a single query interface over all normalized security data rather than requiring them to log into multiple consoles or maintain separate log pipelines)
* Integrate on-premises and third-party cloud sources via custom log contributions (e.g., forward syslog data from an on-premises firewall, normalize it to OCSF format, and ingest it into Security Lake for unified visibility across hybrid environments)
