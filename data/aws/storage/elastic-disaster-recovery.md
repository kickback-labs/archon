---
cloud_provider: "AWS"
service_category: "storage"
service_name: "Elastic Disaster Recovery"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Elastic Disaster Recovery (DRS)

### Description
AWS Elastic Disaster Recovery (AWS DRS) is a fully managed disaster recovery service that enables fast, reliable recovery of on-premises and cloud-based applications into AWS with recovery point objectives (RPOs) of seconds and recovery time objectives (RTOs) of minutes. It works by continuously replicating source servers — physical, virtual, or cloud — to a low-cost staging area subnet in the target AWS Region using affordable block storage and minimal compute. In the event of a disaster, recovery instances are launched on EC2 within minutes using the most recent or a previous point-in-time state. Non-disruptive recovery drills can be run at any time without impacting production systems. After recovery, applications can continue running on AWS or fail back to the original site once it is restored. AWS DRS supports on-premises to AWS, cloud-to-AWS, and AWS Region-to-Region recovery scenarios, and integrates with AWS Systems Manager for post-launch automation.

### Use Cases
* On-premises datacenter protection with continuous replication to AWS (e.g., RPO of seconds for business-critical servers)
* Cross-region application resilience for AWS-hosted workloads requiring geographic redundancy
* Cloud-to-AWS recovery for workloads running on other cloud providers migrating to or backing up to AWS
* Compliance-driven DR mandates requiring tested, documented recovery procedures with low RPO/RTO
* Cost-effective DR by eliminating idle standby infrastructure — pay only for staging resources during normal operation
* Replacing legacy DR appliances and replication tools with a unified AWS-native recovery platform
