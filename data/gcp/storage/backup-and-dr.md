---
cloud_provider: "GCP"
service_category: "storage"
service_name: "Backup and DR Service"
pricing_model: "on-demand"
managed: true
tier: 2
---
## GCP Backup and DR Service

### Description
Google Cloud Backup and DR Service is a centrally managed, fully managed backup and recovery service that protects Google Cloud workloads against ransomware, accidental deletion, and data corruption. It supports a broad range of workload types including Compute Engine VMs, VMware VMs (via VMware Engine), databases (SAP HANA, SQL Server, MySQL, PostgreSQL, Oracle), and file systems—all managed from a single integrated console within the Google Cloud Console. Backup vaults provide immutable, indelible backup storage in a Google-managed environment, preventing modification or early deletion even by privileged administrators, which is critical for cyber resilience. Backup plans support automated intraday, daily, weekly, monthly, and yearly schedules with configurable retention policies and cross-region storage for disaster recovery and compliance. The service integrates with gcloud CLI, REST APIs, and Terraform for at-scale infrastructure-as-code automation. Comprehensive monitoring, alerting, and customizable compliance reporting are built in, with Security Command Center integration for ransomware threat detection.

### Use Cases
* Ransomware recovery using immutable backup vaults that prevent backup modification or deletion, with isolated recovery environments (IRE) for forensic analysis
* Compute Engine VM backup and restore via automated backup plans with configurable RPO/RTO and cross-region replication for disaster recovery
* SAP HANA and enterprise database backup using app-consistent snapshots, reducing full backup durations from hours to minutes (e.g., Persistent Disk Snapshot integration)
* Multi-project workload recovery enabling cross-project restores for disaster recovery drills and workload migration
* Compliance-driven backup governance with centralized policy enforcement, automated retention, and audit-ready reporting across the entire Google Cloud organization
* VMware Engine VM protection within a unified backup service, extending on-premises-style backup operations to cloud-hosted VMware workloads
