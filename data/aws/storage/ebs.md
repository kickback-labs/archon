---
cloud_provider: "AWS"
service_category: "storage"
service_name: "EBS"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS Elastic Block Store (EBS)

### Description
Amazon Elastic Block Store (Amazon EBS) provides durable, high-performance block storage volumes for use with Amazon EC2 instances. EBS volumes are placed in a specific Availability Zone and automatically replicated within that AZ to protect against single-component failure. Volume types span from cost-effective HDD options to high-IOPS SSD volumes, including io2 Block Express which offers up to 256,000 IOPS and 99.999% durability. Volumes can be snapshotted to S3 for backup, cross-region replication, and disaster recovery, with lifecycle management automated via Amazon Data Lifecycle Manager.

### Use Cases
* Primary block storage for EC2-hosted relational and NoSQL databases (e.g., Oracle, PostgreSQL, MySQL, MongoDB)
* Boot volumes for EC2 instances across all operating systems and workload types
* High-performance storage for SAP HANA, Microsoft SQL Server, and other mission-critical enterprise applications
* Big data analytics cluster storage for Hadoop and Spark with the ability to detach and reattach volumes
