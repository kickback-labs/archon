---
cloud_provider: "AWS"
service_category: "analytics"
service_name: "Data Firehose"
pricing_model: "serverless"
managed: true
tier: 1
---
## AWS Data Firehose

### Description
Amazon Data Firehose (formerly Kinesis Data Firehose) is a fully managed, serverless streaming data pipeline service that reliably captures, transforms, and delivers real-time data to destinations within seconds. It automatically provisions and scales to match incoming throughput, requiring no ongoing administration. Data sources include Kinesis Data Streams, Amazon MSK topics, 20+ AWS services (CloudWatch Logs, WAF, SNS, IoT), and direct PUT via the Firehose API. Built-in transformations allow conversion to Apache Parquet or ORC, decompression, and custom Lambda-based processing before delivery. Supported destinations include Amazon S3, Redshift, OpenSearch Service, Splunk, Snowflake, Apache Iceberg Tables, and custom HTTP endpoints.

### Use Cases
* Streaming data lake ingestion (e.g., loading raw clickstream or IoT data into S3 in Parquet format without custom pipelines)
* Near-real-time data warehouse loading (e.g., continuously delivering events into Redshift for BI reporting)
* Security log aggregation (e.g., streaming WAF and CloudTrail logs to an OpenSearch Service SIEM)
* Enrich streaming data with ML (e.g., invoking a Lambda function to score records before delivery to S3)
