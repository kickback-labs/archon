---
cloud_provider: "AWS"
service_category: "database"
service_name: "Redshift"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS Redshift

### Description
Amazon Redshift is a fully managed, petabyte-scale cloud data warehouse based on columnar storage and massively parallel processing (MPP). It delivers fast analytical query performance over structured and semi-structured data using standard SQL and integrates natively with popular BI tools. Redshift Serverless provides automatic scaling with no infrastructure management, while provisioned clusters offer RA3 nodes with managed storage that decouples compute from storage. Zero-ETL integrations with Amazon Aurora, DynamoDB, and other sources enable near-real-time data loading without custom pipelines, and Amazon Redshift Spectrum extends queries directly to data in Amazon S3.

### Use Cases
* Enterprise data warehousing and OLAP workloads over terabytes to petabytes of structured data
* Ad-hoc and scheduled analytics via standard SQL with BI tools (e.g., QuickSight, Tableau, Looker)
* Near-real-time analytics on transactional data via zero-ETL integrations with Aurora MySQL/PostgreSQL
* Data lake analytics on S3 using Redshift Spectrum without loading data into the warehouse
* Business reporting, financial analytics, and customer behavior analysis at scale
