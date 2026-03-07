---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "GuardDuty"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Amazon GuardDuty

### Description
Amazon GuardDuty is a fully managed threat detection service that continuously monitors AWS accounts, workloads, and data sources for malicious activity and unauthorized behaviour. It uses machine learning, anomaly detection, and integrated threat intelligence feeds from AWS and third-party partners to identify threats without requiring the deployment of any agents or software. GuardDuty analyzes VPC Flow Logs, CloudTrail management and data events, DNS logs, EKS audit logs, ECS runtime telemetry, and S3 access events. Findings are delivered to the AWS Security Hub and Amazon EventBridge for automated remediation.

### Use Cases
* Detecting compromised EC2 instances communicating with known command-and-control servers or mining cryptocurrency
* Identifying anomalous IAM credential usage, such as logins from unusual geolocations or API calls at unusual times
* Monitoring Amazon EKS and ECS container workloads for runtime threats (e.g., container escape, privilege escalation)
* Scanning S3 buckets and EBS volumes for malware using integrated Malware Protection
* Detecting brute-force attacks and suspicious login patterns against Amazon Aurora RDS databases
