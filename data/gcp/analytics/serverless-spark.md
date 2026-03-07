---
cloud_provider: "GCP"
service_category: "analytics"
service_name: "Serverless for Apache Spark"
pricing_model: "serverless"
managed: true
tier: 2
---
## GCP Serverless for Apache Spark

### Description
Google Cloud Serverless for Apache Spark (formerly Dataproc Serverless) is a fully managed, serverless runtime for running Apache Spark workloads without provisioning or managing clusters. It supports batch workloads (PySpark, Spark SQL, Spark R, Spark Java/Scala) and interactive Jupyter notebook sessions, with resources that auto-provision on submission and are released immediately on completion, so you pay only for the compute used. A Lightning Engine acceleration layer provides native vectorized query execution that can significantly speed up Spark SQL and DataFrame workloads without code changes. The service integrates natively with BigQuery via the BigQuery connector, Cloud Storage for staging, and Dataproc Metastore or BigLake Metastore for Hive-compatible metadata. Interactive sessions support Serverless Spark Connect, allowing remote Spark clients (including BigQuery Studio notebooks) to attach to a managed Spark environment. Custom container images enable installing additional libraries and dependencies. Autoscaling and Autotune automatically adjust resources and Spark properties to optimize cost and throughput for each workload. GPU support and Dataproc templates (pre-built pipelines for common data movement patterns like Cloud Storage to BigQuery) further reduce development overhead.

### Use Cases
* Running large-scale PySpark ETL jobs without managing clusters (e.g., transforming raw event logs from Cloud Storage into structured BigQuery tables on a per-job serverless basis)
* Interactive data exploration with Jupyter notebooks (e.g., data scientists running Spark SQL queries on petabyte-scale datasets in BigQuery Studio without cluster setup)
* Accelerating Spark SQL analytics with Lightning Engine (e.g., speeding up dashboard aggregation queries by 2–10x with vectorized execution, no code changes required)
* Migrating on-premises Spark workloads to the cloud with minimal refactoring (e.g., running existing PySpark scripts as serverless batch jobs with custom containers carrying the same dependencies)
* Using Dataproc templates for standardized data pipelines (e.g., JDBC-to-BigQuery template to move relational data from Cloud Spanner or MySQL into BigQuery without writing custom Spark code)
* Cost-optimizing periodic batch jobs (e.g., nightly ML feature engineering jobs that spin up, process, and shut down with per-second billing rather than running persistent clusters)
* Running GPU-accelerated Spark workloads (e.g., distributed model inference or large-scale feature extraction using RAPIDS on serverless Spark GPUs)
