---
cloud_provider: "GCP"
service_category: "integration_messaging"
service_name: "Cloud Composer"
pricing_model: "on-demand"
managed: true
tier: 2
---
## GCP Cloud Composer

### Description
Cloud Composer is a fully managed workflow orchestration service built on Apache Airflow, enabling you to create, schedule, monitor, and manage pipeline workflows that span across clouds and on-premises data centers. Each environment is a self-contained Airflow deployment running on Google Kubernetes Engine, with GKE clusters, an Airflow web server, an Airflow metadata database, and a Cloud Storage bucket provisioned automatically. Cloud Composer 3 (the current major version) supports Airflow 2 and provides autoscaling, highly resilient multi-zone configurations, and environment snapshots for disaster recovery. Because Airflow DAGs are written in Python, teams get full programmatic control over pipeline logic, branching, and retries, alongside a rich operator ecosystem for Google Cloud services. Cloud Composer integrates natively with BigQuery, Dataflow, Dataproc, Cloud Storage, Pub/Sub, and many other GCP services through built-in Airflow operators, and supports custom Python dependencies and plugins via Artifact Registry. Logs and metrics flow automatically to Cloud Logging and Cloud Monitoring, giving operators visibility into DAG health, scheduler performance, and task-level execution details.

### Use Cases
* Complex multi-step ETL pipelines (e.g., extract from Cloud Storage → transform in Dataflow → load into BigQuery on a daily schedule)
* Cross-cloud and hybrid workflow orchestration (e.g., coordinating jobs across GCP, AWS, and on-premises systems in a single DAG)
* ML pipeline automation (e.g., triggering Vertex AI training jobs, evaluation, and model deployment in sequence)
* Dataproc and Spark job scheduling (e.g., running nightly batch processing jobs with dependency chaining and automatic retries)
* CI/CD-driven DAG deployment (e.g., syncing DAGs from GitHub to Cloud Storage on merge, with test cases validated before publishing)
* Event-triggered workflows (e.g., kicking off a DAG when a file lands in a Cloud Storage bucket via a Cloud Functions trigger)
* Long-running approval workflows (e.g., human-in-the-loop review steps gated by Airflow sensors waiting for external signals)
* Data quality and compliance pipelines (e.g., orchestrating data validation, lineage capture via Dataplex, and audit reporting)
