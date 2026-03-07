---
cloud_provider: "Azure"
service_category: "analytics"
service_name: "Microsoft Fabric"
pricing_model: "subscription"
managed: true
tier: 2
---
## Microsoft Fabric

### Description
Microsoft Fabric is a fully managed, end-to-end analytics SaaS platform that unifies data engineering, data integration, data warehousing, real-time intelligence, data science, and business intelligence into a single product. All workloads share OneLake — a tenant-wide logical data lake built on Azure Data Lake Storage Gen2 — as a common storage layer, eliminating data silos and removing the need to move or copy data between services. Fabric delivers role-specific workloads including Data Factory (data integration and pipelines), Data Engineering (Apache Spark-based processing and notebooks), Data Warehouse (SQL-based warehouse with Delta Lake storage), Real-Time Intelligence (streaming ingestion and KQL-based analytics via Azure Data Explorer), Fabric Data Science (ML experiment tracking and model deployment integrated with Azure Machine Learning), Databases (SQL and Cosmos DB-compatible transactional stores with OneLake mirroring), Power BI (BI and reporting), and IQ (semantic layer / ontology). Microsoft Purview governance is built in natively via the OneLake Catalog. Fabric integrates with Microsoft 365, Microsoft Foundry for AI/ML, and GitHub/Azure DevOps for CI/CD. Capacity is licensed via Fabric SKUs (F-SKUs) or Power BI Premium, and compute scales independently of storage.

### Use Cases
* Unified analytics platform — consolidate disparate tools (Databricks, Synapse, Power BI, Azure ML) into a single Fabric tenant where data engineers, scientists, and analysts share the same OneLake storage without data duplication
* Modern data lakehouse — ingest raw data into OneLake via Data Factory pipelines, transform it with Spark notebooks, and expose curated Delta Lake tables directly to Power BI and SQL endpoints
* Real-time intelligence — stream IoT or application events into Fabric's Real-Time hub, process with KQL eventstreams, and power live dashboards without leaving the platform
* Enterprise data warehousing — use Fabric Data Warehouse to run large-scale SQL analytics over Delta-format data in OneLake with compute-storage separation and T-SQL compatibility
* ML model development and operationalization — train models with Fabric Data Science (Spark + MLflow experiment tracking), register them in the integrated model registry, and embed predictions into Power BI reports
* OneLake mirroring for operational data — mirror Azure SQL Database, Cosmos DB, Snowflake, or Databricks data continuously into OneLake to enable analytics without burdening operational systems
* Governed enterprise BI — centralize Power BI semantic models in Fabric workspaces with Purview-enforced sensitivity labels, row-level security, and lineage visibility across the entire analytics chain
