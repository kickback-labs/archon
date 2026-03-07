---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "Detective"
pricing_model: "on-demand"
managed: true
tier: 3
---
## Amazon Detective

### Description
Amazon Detective is a fully managed security investigation service that automatically collects, processes, and visualizes log data from AWS sources — including VPC Flow Logs, AWS CloudTrail, Amazon GuardDuty findings, AWS WAF logs, and Amazon EKS audit logs — to help security analysts conduct faster and more effective investigations into potential threats. Detective uses machine learning, statistical analysis, and graph theory to build a behavioral baseline for each entity (IAM users, roles, IP addresses, EC2 instances, S3 buckets, etc.) in your environment, making it easy to spot anomalies and trace the scope of suspicious activity. When GuardDuty generates a finding, analysts can pivot directly into Detective from the GuardDuty console to see correlated activity visualized across a time range with interactive graphs. Detective integrates with AWS Security Hub and supports generative AI-powered summaries that describe the scope, timeline, and impact of a threat in plain language, significantly reducing mean time to investigate (MTTI). It does not require any agents, infrastructure configuration, or manual log aggregation — data collection starts automatically upon enablement. Detective retains up to 12 months of aggregated security data, enabling retrospective investigation of historical events. The service has a 30-day free trial and is priced based on the volume of data ingested (GB per month) across all enabled data sources.

### Use Cases
* Triage GuardDuty findings (e.g., determine whether an "Unauthorized API call" finding is a genuine attack or a misconfigured CI/CD pipeline by examining the IAM principal's behavioral profile and associated API call history)
* Investigate compromised IAM credentials (e.g., visualize all AWS API calls made by a potentially compromised IAM role over the past 30 days, including source IPs, geolocation, and accessed resources)
* Trace lateral movement after an initial compromise (e.g., identify which EC2 instances an attacker pivoted to after gaining initial access, using VPC Flow Log graph visualizations)
* Determine the blast radius of a security incident (e.g., identify all S3 buckets accessed by a suspicious IP address to assess data exfiltration risk)
* Accelerate incident response with generative AI summaries (e.g., receive an automatically generated narrative that describes which resources were involved, what actions were taken, and the likely impact — reducing analyst time from hours to minutes)
* Investigate EKS workload threats (e.g., use Kubernetes audit logs ingested by Detective to trace container escapes or unauthorized API server calls within an EKS cluster)
* Conduct retrospective threat hunting (e.g., search historical network and API activity from the past 12 months to determine whether a newly discovered indicator of compromise (IOC) was present in your environment before it was identified)
* Correlate findings from multiple security services (e.g., link a Security Hub finding, a GuardDuty alert, and VPC flow anomalies into a unified investigation timeline to understand the full attack chain)
