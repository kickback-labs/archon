---
cloud_provider: "AWS"
service_category: "analytics"
service_name: "EMR"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS Elastic MapReduce (EMR)

### Description
Amazon EMR (Elastic MapReduce) is a fully managed big data platform for running large-scale distributed data processing workloads using open-source frameworks including Apache Spark, Apache Hive, Apache Flink, Trino, and HBase. EMR's performance-optimized Spark runtime is up to 5.4x faster than open-source Spark while maintaining full API compatibility and supporting open table formats like Apache Iceberg, Hudi, and Delta Lake. Three deployment modes are available: EMR Serverless (fully managed, no cluster management), EMR on EC2 (fine-grained cluster control with Spot Instance savings), and EMR on EKS (Spark jobs submitted natively to Kubernetes). Auto-scaling, intelligent monitoring, and managed infrastructure eliminate operational overhead at petabyte scale.

### Use Cases
* Petabyte-scale batch analytics and ETL (e.g., processing multi-TB data lake files with Apache Spark)
* Real-time stream processing (e.g., long-running Apache Flink pipelines on EMR on EKS)
* Interactive SQL analytics on data lakes (e.g., ad-hoc Trino queries across S3 and Glue catalog)
* ML workload acceleration (e.g., distributed training with Spark MLlib or TensorFlow on EMR clusters)
