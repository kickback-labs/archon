---
cloud_provider: "GCP"
service_category: "analytics"
service_name: "Looker"
pricing_model: "subscription"
managed: true
tier: 2
---
## GCP Looker

### Description
Looker is GCP's enterprise business intelligence and analytics platform that lets organizations explore, analyze, and share data-driven insights through interactive dashboards, reports, and embedded analytics. At its core, Looker uses LookML — a proprietary semantic modeling language — to define reusable data models, metrics, and relationships on top of any SQL-compatible data source, ensuring a single source of truth across an organization. It is available as a fully managed SaaS offering in two variants: Looker (Google Cloud core), which runs natively in GCP with IAM-based authentication and VPC connectivity options, and Looker (original), which supports customer-hosted or Looker-hosted deployments. Looker connects natively to BigQuery and supports dozens of other dialects including Redshift, Snowflake, Databricks, and PostgreSQL. Gemini in Looker adds AI-powered natural language querying (Conversational Analytics), LookML generation, and automated Explore summaries. Pricing is subscription-based, varying by edition and user count.

### Use Cases
* Enterprise BI dashboards — building organization-wide KPI dashboards with drill-down capabilities sourced from BigQuery or other data warehouses, with row-level security enforced via LookML access filters
* Self-service analytics — enabling business users to explore curated data models without SQL knowledge, using Looker's point-and-click Explore interface and custom fields
* Embedded analytics — white-labeling dashboards and Explores inside SaaS applications or customer portals using signed embedding or the Embed SDK, with per-user attribute-level data isolation
* Standardized metrics governance — defining business metrics (revenue, churn, conversion) once in LookML and reusing them across all reports to prevent definitional inconsistencies
* Scheduled data delivery — automatically sending refreshed reports, dashboard snapshots, or CSV exports to email, Slack, Google Drive, or S3 on a recurring schedule with conditional alerting
* AI-assisted querying — allowing analysts to ask questions in natural language via Conversational Analytics powered by Gemini, which generates and executes SQL against the LookML model
* Cross-database exploration — merging results from multiple data sources (e.g., joining BigQuery production data with a Salesforce report) using Looker's merged results feature
