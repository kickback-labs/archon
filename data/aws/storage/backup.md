---
cloud_provider: "AWS"
service_category: "storage"
service_name: "AWS Backup"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Backup

### Description
AWS Backup is a fully managed, centralized data protection service that automates backup and recovery across AWS services and hybrid workloads from a single console. It supports policy-based backup plans for EC2, EBS, RDS, Aurora, DynamoDB, EFS, FSx, S3, Storage Gateway, and VMware workloads on-premises. AWS Backup provides ransomware recovery capabilities through immutable backups, logically air-gapped vaults, and malware scanning. It also includes Backup Audit Manager for compliance monitoring, cross-region and cross-account backup replication, and automated restore testing to validate recovery readiness. There is no additional charge for using the service itself — you pay only for the backup storage consumed and data transferred.

### Use Cases
* Centralized backup management for multi-account, multi-region AWS environments using AWS Organizations integration
* Meeting regulatory and compliance requirements with audit trails, backup reports, and policy enforcement
* Ransomware protection using immutable backup vaults (Backup Vault Lock) that prevent deletion or modification
* Cross-region disaster recovery by replicating backups to a secondary AWS Region automatically
* Hybrid workload data protection including on-premises VMware and Storage Gateway volumes
* Automated restore testing to periodically validate that backups are recoverable without manual effort
