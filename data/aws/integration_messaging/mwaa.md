---
cloud_provider: "AWS"
service_category: "integration_messaging"
service_name: "MWAA"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Managed Workflows for Apache Airflow (MWAA)

### Description
Amazon Managed Workflows for Apache Airflow (MWAA) is a fully managed service for running Apache Airflow at scale without managing infrastructure. It supports two deployment modes: Serverless (usage-based pricing, automatic scaling, no Airflow configuration required, ideal for variable or low-frequency workloads) and Provisioned (full control over Airflow environment size, dependencies, and plugins, backed by dedicated worker infrastructure). MWAA handles patching, scaling, high availability, and VPC security automatically, and supports Apache Airflow versions through 3.0. DAGs (Directed Acyclic Graphs) are authored in Python and stored in S3, with workers executing tasks across ECS-backed compute. It integrates natively with S3, Redshift, EMR, Glue, and SageMaker for data pipeline orchestration. MWAA is also available as a managed environment within Amazon SageMaker for ML workflow orchestration.

### Use Cases
* Orchestrating complex multi-step ETL pipelines across AWS services (e.g., S3 ingestion → Glue transform → Redshift load in dependency-aware DAGs)
* Data engineering and lake house pipeline coordination (e.g., daily data quality checks, compaction, and partition management on S3)
* MLOps workflow orchestration — coordinating data preparation, model training, evaluation, and SageMaker endpoint deployment in a single DAG
* Lift-and-shift of existing on-premises Airflow workflows to AWS with no code changes required
* Cross-system BI and analytics scheduling (e.g., triggering Redshift refreshes, QuickSight SPICE ingestion, and report delivery on a schedule)
* Multi-cloud or multi-system orchestration using Airflow operators for GCP, Azure, Databricks, dbt, and external APIs
