---
cloud_provider: "GCP"
service_category: "analytics"
service_name: "Dataplex Universal Catalog"
pricing_model: "on-demand"
managed: true
tier: 2
---
## GCP Dataplex Universal Catalog

### Description
Dataplex Universal Catalog is a unified, intelligent data governance solution that helps organizations manage, understand, and use data assets distributed across Google Cloud services and third-party systems. It automatically harvests metadata from BigQuery, Cloud SQL, Spanner, Cloud Storage, Pub/Sub, Vertex AI, and Dataproc Metastore, providing an instant central data catalog without manual ingestion pipelines. The service supports data discovery (scanning Cloud Storage buckets for structured and unstructured data), data profiling (identifying column-level statistics in BigQuery tables), and data quality validation against organizational rules with alerting when data fails criteria. Business glossaries allow teams to define and attach consistent terminology to table columns, promoting a shared understanding of data semantics across the organization. Dataplex Universal Catalog tracks data lineage end-to-end — showing where data originates, how it transforms, and where it flows — and integrates with OpenLineage for cross-system tracking. AI-powered data insights generate natural language questions about datasets to uncover patterns and support statistical analysis. Access control is enforced via IAM, and VPC Service Controls and CMEK are supported for sensitive workloads.

### Use Cases
* Building a central enterprise data catalog (e.g., auto-discovering all BigQuery datasets, Cloud Storage buckets, and Spanner databases across multiple projects and attaching business metadata)
* Enforcing data quality rules at scale (e.g., validating that revenue columns are non-null and within expected ranges, with Cloud Monitoring alerts on failures)
* Tracking data lineage for compliance and debugging (e.g., tracing a customer record from its raw ingestion in Pub/Sub through Dataflow transformations to a final BigQuery reporting table)
* Managing business glossaries to standardize terminology (e.g., linking the term "ARR" to its definition and tagging all relevant columns across finance datasets)
* Profiling datasets to inform data classification (e.g., identifying null rates, value distributions, and potential PII columns before processing sensitive data)
* Enabling data product discovery for self-service analytics (e.g., allowing data consumers to search for certified datasets by domain, owner, or quality score)
* Ingesting metadata from non-Google Cloud systems (e.g., importing custom source metadata via Workflows or custom connectors to build a hybrid catalog spanning on-prem and cloud)
