---
cloud_provider: "AWS"
service_category: "analytics"
service_name: "QuickSight"
pricing_model: "subscription"
managed: true
tier: 2
---
## AWS QuickSight

### Description
Amazon QuickSight is a fully managed, cloud-native business intelligence (BI) service that delivers AI-powered analytics and interactive dashboards to users across an organization. It uses SPICE (Super-fast, Parallel, In-memory Calculation Engine) to cache data for fast query performance at scale, and connects directly to data sources including Amazon S3, Redshift, Athena, RDS, and third-party databases without requiring data movement for live query mode. QuickSight supports natural language Q&A (QuickSight Q) and AI-generated narratives, enabling non-technical users to explore data conversationally and receive auto-generated executive summaries. Dashboards and visualizations can be embedded into external applications and portals via the Embedding SDK, and the service supports role-based access control, single sign-on, and compliance with FedRAMP, HIPAA, PCI DSS, ISO, and SOC standards. Pricing is per-user (Reader or Author) with no per-query charges, and the serverless architecture auto-scales to tens of thousands of concurrent dashboard users.

### Use Cases
* Enterprise BI dashboards (e.g., executive KPI scorecards pulling from Redshift and Athena with row-level security per business unit)
* Self-service analytics for non-technical users (e.g., natural language Q&A over sales data without SQL knowledge)
* Embedded analytics in SaaS products (e.g., embedding interactive charts into a customer-facing portal via the QuickSight Embedding SDK)
* Operational reporting at scale (e.g., auto-scaling dashboards to thousands of concurrent retail store managers during peak season)
* AI-generated business narratives (e.g., automatically producing written summaries of weekly revenue trends for executive reports)
* Multi-source unified reporting (e.g., joining data from S3, RDS, and Salesforce in a single dashboard without a separate ETL step)
