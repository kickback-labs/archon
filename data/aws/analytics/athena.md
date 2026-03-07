---
cloud_provider: "AWS"
service_category: "analytics"
service_name: "Athena"
pricing_model: "per-request"
managed: true
tier: 1
---
## AWS Athena

### Description
Amazon Athena is a serverless, interactive query service that enables SQL and Apache Spark-based analysis of data directly in Amazon S3 and other sources without loading or transforming the data first. There is no infrastructure to provision or manage; you pay only per query (5 USD per TB of data scanned, with savings possible via columnar formats). Athena is integrated out-of-the-box with the AWS Glue Data Catalog for schema discovery and uses Presto/Trino under the hood for SQL workloads. Federated queries via data source connectors allow joining data across relational databases, NoSQL stores, and SaaS applications in a single SQL statement. Results are delivered within seconds even for petabyte-scale datasets.

### Use Cases
* Ad-hoc SQL queries on data lake files in S3 (e.g., querying Parquet or ORC files without ETL or loading)
* Log analytics (e.g., analyzing CloudTrail, ALB, or VPC Flow Logs stored in S3 using standard SQL)
* Federated queries across hybrid data sources (e.g., joining S3 data with an RDS table in a single query)
* ML data preparation (e.g., running SQL transformations on raw S3 data before training a SageMaker model)
