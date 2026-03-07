---
cloud_provider: "Azure"
service_category: "database"
service_name: "Synapse Analytics"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Synapse Analytics

### Description
Azure Synapse Analytics is an enterprise analytics service that unifies data warehousing and big data processing in a single platform, combining dedicated SQL pools (MPP data warehouse), serverless SQL, Apache Spark, and Data Explorer runtimes within one workspace. It includes built-in data integration pipelines equivalent to Azure Data Factory, enabling code-free ETL/ELT from 90+ sources without leaving the service. Synapse Studio provides a unified authoring, monitoring, and management experience across SQL, Spark, and KQL workloads with integrated role-based access control. It integrates directly with Power BI, Azure Machine Learning, and Azure Cosmos DB for end-to-end analytics and AI scenarios.

### Use Cases
* Enterprise data warehousing using dedicated SQL pools to run complex analytical queries over petabyte-scale structured data with predictable, high-concurrency performance
* Big data processing and data lake analytics using serverless SQL or Apache Spark to query Parquet, CSV, and JSON files in Azure Data Lake Storage Gen2 without moving data
* Hybrid HTAP (Hybrid Transactional/Analytical Processing) via Synapse Link, replicating operational data from Cosmos DB or Azure SQL into Synapse for near-real-time analytics without ETL
* Code-free ETL/ELT pipeline authoring to ingest, transform, and orchestrate data across cloud and on-premises sources at scale
