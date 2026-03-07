---
cloud_provider: "GCP"
service_category: "analytics"
service_name: "Dataproc"
pricing_model: "on-demand"
managed: true
tier: 2
---
## GCP Dataproc

### Description
Dataproc is GCP's fully managed Apache Spark and Hadoop service that lets you run open-source big data workloads—batch processing, querying, streaming, and machine learning—without managing infrastructure. Clusters start, scale, and shut down in 90 seconds or less, and second-by-second billing with a one-minute minimum means you only pay for what you use. Dataproc natively integrates with BigQuery, Cloud Storage, Cloud Bigtable, Cloud Logging, and Cloud Monitoring, enabling seamless ETL, analytics, and ML pipelines. It supports optional components including Jupyter, Flink, Trino, Presto, Delta Lake, Apache Hudi, and Apache Iceberg, and clusters can run on Compute Engine VMs or inside GKE (Dataproc on GKE). Cluster autoscaling adjusts worker count automatically based on YARN metrics, and preemptible/Spot VMs can significantly reduce compute costs for fault-tolerant jobs. Pricing is $0.01 per vCPU per hour on top of underlying Compute Engine costs.

### Use Cases
* Migrating on-premises Hadoop and Spark workloads to GCP without rewriting application code (lift-and-shift using familiar Spark, Hive, Pig, and Hadoop APIs)
* Large-scale ETL pipelines that read raw data from Cloud Storage or BigQuery, transform it with Spark or Hive, and land results back into BigQuery or Bigtable
* Interactive data exploration and ML model training using Jupyter notebooks on ephemeral Dataproc clusters with GPU support
* Batch log analytics — processing terabytes of application or clickstream logs with Spark SQL and writing aggregated results to BigQuery for business reporting
* Open table format workloads (Apache Iceberg, Delta Lake, Apache Hudi) for data lakehouse architectures on Cloud Storage
* Genomics and scientific computing — running parallel batch jobs across large node counts using workflow templates orchestrated by Cloud Composer
* Cost-optimized analytics using secondary preemptible workers that scale out for peak compute demand and are released when the job completes
