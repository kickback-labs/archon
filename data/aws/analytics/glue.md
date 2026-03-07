---
cloud_provider: "AWS"
service_category: "analytics"
service_name: "Glue"
pricing_model: "serverless"
managed: true
tier: 1
---
## AWS Glue

### Description
AWS Glue is a serverless data integration service that makes it easy to discover, prepare, and combine data for analytics, ML, and application development. It connects to more than 100 diverse data sources and manages a centralized metadata repository called the AWS Glue Data Catalog, which is compatible with Apache Hive and shared across Amazon Athena, EMR, and Redshift Spectrum. ETL jobs run on Apache Spark, PySpark, Python, or Ray with auto-scaling and no cluster management. Glue also supports streaming ETL for micro-batch processing, interactive development via notebooks, and AI-assisted code generation and Spark upgrade tooling. It is the primary ETL and data catalog service in AWS analytics architectures.

### Use Cases
* ETL pipeline automation (e.g., extracting data from RDS/S3, transforming to Parquet, and loading into Redshift)
* Centralized data catalog for a data lake (e.g., crawling S3 buckets to auto-discover schemas for Athena queries)
* Streaming ETL for near-real-time data preparation (e.g., micro-batch processing of Kinesis Data Streams records)
* Data quality monitoring and enforcement (e.g., auto-computing statistics and alerting on missing or stale data)
