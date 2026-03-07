---
cloud_provider: "Azure"
service_category: "storage"
service_name: "Data Lake Storage Gen2"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Data Lake Storage Gen2 (ADLS Gen2)

### Description
Azure Data Lake Storage Gen2 (ADLS Gen2) is a set of big-data analytics capabilities built on top of Azure Blob Storage, enabled by activating the hierarchical namespace feature on a storage account. It converges the scalability and economics of Azure Blob Storage with a POSIX-compatible hierarchical directory structure and Hadoop-compatible access via the Azure Blob File System (ABFS) driver. ADLS Gen2 supports massive scale—hundreds of gigabits of throughput, petabytes of data—with near-constant per-request latencies. Access control is enforced through both Azure RBAC and POSIX-style ACLs, and all data is encrypted at rest. Because the hierarchical namespace stores directory metadata atomically, operations like rename or delete of a directory are O(1) metadata operations rather than expensive enumeration-and-process loops, which dramatically improves ETL performance. ADLS Gen2 is not a separate account type; it is standard Blob Storage with the hierarchical namespace toggle enabled, so all standard Blob Storage features (lifecycle management, access tiers, soft delete) remain available.

### Use Cases
* Enterprise data lake foundation for storing raw, structured, and semi-structured analytics data at petabyte scale (e.g., ingesting IoT telemetry from thousands of devices)
* Big data processing with Apache Spark, Hadoop, and Presto via the ABFS driver (e.g., Azure HDInsight or Azure Databricks reading from ADLS Gen2)
* ETL staging area for Azure Data Factory or Synapse Analytics pipelines, leveraging atomic directory renames for transactional landing zones
* Multi-tier data lake patterns (raw → curated → serving zones) with folder-level POSIX ACLs for team-based access control
* Machine learning training data repositories where data scientists need hierarchical organization and fine-grained security alongside large file access (e.g., Parquet datasets for Azure Machine Learning)
* Cost-optimized cold analytics storage using Blob Storage lifecycle policies to tier infrequently accessed data to Cool or Archive automatically
