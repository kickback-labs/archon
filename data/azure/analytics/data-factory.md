---
cloud_provider: "Azure"
service_category: "analytics"
service_name: "Data Factory"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Data Factory (ADF)

### Description
Azure Data Factory is a fully managed, serverless cloud ETL and data integration service that orchestrates and automates data movement and transformation at scale. It enables the creation of data-driven pipelines that ingest data from 90+ heterogeneous sources — on-premises and cloud, relational and non-relational — and deliver it to destination stores such as Azure Data Lake Storage, Azure Synapse Analytics, or Azure SQL Database. Pipelines can be authored visually with a code-free UI, or by writing transformation logic using mapping data flows backed by Spark; external compute such as Azure Databricks and HDInsight Hadoop is also supported. ADF provides native CI/CD integration via Azure DevOps and GitHub, built-in monitoring through Azure Monitor, and trigger options including scheduled, event-based (blob arrival), and tumbling-window triggers.

### Use Cases
* ETL/ELT pipelines — extract data from on-premises databases, SaaS APIs, or cloud stores and load into a data warehouse (e.g., nightly loads from SQL Server into Azure Synapse)
* Hybrid data integration — connect on-premises sources to the cloud using a self-hosted Integration Runtime without opening inbound firewall ports
* Code-free data transformation — build visual mapping data flows that run on managed Spark clusters without writing Spark code
* Orchestration of complex workflows — chain Databricks notebooks, Spark jobs, stored procedures, and ML scoring activities into a single pipeline
* Data lake ingestion — fan-in data from many upstream systems into Azure Data Lake Storage Gen2 as the central analytics landing zone
* Event-driven pipelines — trigger a pipeline when a new file lands in Blob Storage or an event fires in Event Grid
