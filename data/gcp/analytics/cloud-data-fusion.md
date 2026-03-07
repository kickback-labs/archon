---
cloud_provider: "GCP"
service_category: "analytics"
service_name: "Cloud Data Fusion"
pricing_model: "subscription"
managed: true
tier: 2
---
## GCP Cloud Data Fusion

### Description
Cloud Data Fusion is GCP's fully managed, cloud-native enterprise data integration service for building and orchestrating ETL/ELT pipelines through a visual, no-code/low-code interface. It is powered by the open-source CDAP project and runs pipelines on ephemeral Dataproc clusters (provisioned automatically per run), keeping infrastructure invisible to the user. The Studio web interface allows drag-and-drop pipeline design using a rich library of source, transform, and sink plugins covering Google services (BigQuery, Cloud Storage, Cloud SQL, Pub/Sub), databases (PostgreSQL, MySQL, SQL Server), SaaS systems (Salesforce, SAP ERP, SAP HANA, SAP BW), and JDBC-compatible stores. Cloud Data Fusion supports both batch and streaming (real-time) pipelines, data wrangling via the built-in Wrangler interface, transformation pushdown to BigQuery, and replication (CDC) from operational databases. Instances are available in Developer, Basic, and Enterprise editions with different pricing and SLA tiers; all run in a tenant project isolated from the customer VPC.

### Use Cases
* Visual ETL pipeline development — enabling data engineers and analysts to build complex multi-step data pipelines from 150+ pre-built plugins without writing Spark or SQL code
* SAP data integration — extracting data from SAP ERP, SAP BW Open Hub, SAP ODP, and SAP SuccessFactors into BigQuery or Cloud Storage using purpose-built SAP connectors
* Database replication (CDC) — using the Replication Accelerator to capture change data from MySQL, PostgreSQL, or SQL Server databases and stream it continuously into BigQuery
* Data migration and modernization — moving on-premises data warehouse tables or Hadoop datasets to BigQuery through batch pipelines with schema mapping and type coercion
* Salesforce analytics — ingesting Salesforce lead, opportunity, and account data via SOQL queries into BigQuery for sales performance reporting in Looker
* Data quality and masking — using Wrangler directives and Sensitive Data Protection integration to cleanse, validate, and redact PII fields before landing data in BigQuery
* Multi-cloud pipeline orchestration — scheduling interdependent batch pipelines with triggers, runtime arguments, and Cloud Composer (Airflow) integration for end-to-end data workflow management
