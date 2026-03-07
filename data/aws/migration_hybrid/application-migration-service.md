---
cloud_provider: "AWS"
service_category: "migration_hybrid"
service_name: "Application Migration Service"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Application Migration Service (MGN)

### Description
AWS Application Migration Service (MGN) is the primary AWS service recommended for lift-and-shift (rehost) migrations to AWS. It continuously replicates source servers — physical, virtual (VMware vSphere, Microsoft Hyper-V), or cloud-based — to AWS, using a lightweight agent that keeps replication in sync without interrupting normal business operations. After a short cutover window, the application launches on AWS with the same data as the source. MGN also supports modernization actions during migration such as cross-Region disaster recovery setup, Windows Server version upgrades, and MS-SQL BYOL-to-AWS license conversion. You can also use MGN to migrate EC2 workloads between AWS Regions, Availability Zones, or accounts. The service is available at no additional cost during the first 90 days of replication per server.

### Use Cases
* Lift-and-shift migration of on-premises physical servers to EC2 (e.g., migrating SAP, Oracle, or SQL Server workloads with minimal changes)
* Migrating VMware vSphere or Hyper-V VMs to AWS (e.g., consolidating on-premises virtualization to the cloud)
* Cross-cloud migration from other public clouds to AWS (e.g., moving Azure or GCP workloads to gain access to AWS-native services)
* Intra-AWS migrations across Regions or accounts (e.g., consolidating workloads from multiple AWS accounts into a single landing zone)
* Application modernization during migration (e.g., automatically upgrading Windows Server versions or converting SQL Server licenses at cutover)
* Large-scale migrations with wave planning (e.g., grouping hundreds of servers into migration waves with dependency tracking)
