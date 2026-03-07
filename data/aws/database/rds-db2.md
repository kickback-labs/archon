---
cloud_provider: "AWS"
service_category: "database"
service_name: "RDS for Db2"
pricing_model: "on-demand"
managed: true
tier: 3
---
## AWS RDS for Db2

### Description
Amazon RDS for Db2 is a fully managed database service that makes it easy to set up, operate, and scale IBM Db2 databases in the cloud. It automates time-consuming database administration tasks such as hardware provisioning, software installation, backups, patching, and monitoring, so customers can focus on application development rather than infrastructure management. RDS for Db2 supports Multi-AZ deployments for high availability with automatic failover, Read Replicas for horizontal read scaling, and integrates with AWS services such as Amazon CloudWatch, AWS CloudTrail, AWS KMS, AWS Secrets Manager, and Amazon VPC. Customers must bring their own IBM Db2 license (BYOL). Supported Db2 versions include Db2 Standard Edition and Db2 Advanced Edition. RDS for Db2 is available in all major AWS Regions and supports instance types ranging from db.t3 (development/test) to db.r6i and db.m6i (production workloads).

### Use Cases
* Lift-and-shift migration of on-premises IBM Db2 databases to a fully managed cloud environment without changing application SQL or stored procedures
* Enterprises running core banking, ERP (e.g., SAP), or mainframe-adjacent workloads that are dependent on Db2 as their relational engine
* Organizations reducing operational burden of Db2 DBA tasks (patching, backups, failover) by migrating to RDS for Db2
* Multi-AZ production deployments requiring automatic failover for mission-critical Db2 workloads with strict RTO requirements
* Development and test environments for Db2-based applications where developers need self-service, isolated database instances
* Organizations standardizing on AWS-managed relational databases while retaining Db2 SQL compatibility during phased migrations
