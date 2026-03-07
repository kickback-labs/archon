---
cloud_provider: "Azure"
service_category: "analytics"
service_name: "HDInsight"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure HDInsight

### Description
Azure HDInsight is a fully managed, cloud-based big data analytics service that makes it easy to deploy and run popular open-source analytics frameworks in the cloud. It supports Apache Spark, Apache Hadoop, Apache Kafka, Apache HBase, Apache Hive (including interactive LLAP), and others—all running on managed clusters that Azure provisions and maintains. HDInsight decouples compute from storage by using Azure Blob Storage or Data Lake Storage Gen2 as the persistence layer, allowing clusters to be created on demand and torn down after use to minimize cost. It integrates with Microsoft Entra ID for enterprise-grade security, Azure Monitor for logging and diagnostics, and familiar BI tools such as Power BI via ODBC or Power Query connectors. HDInsight supports multiple programming languages including Java, Python, Scala, and .NET, and can be extended with script actions or pre-installed tools such as Hue and Presto. It meets industry and government compliance standards and maintains in-region data residency for Kafka and HBase workloads.

### Use Cases
* Large-scale batch ETL pipelines (e.g., extracting and transforming petabytes of raw log data into structured Parquet in Data Lake Storage)
* Interactive SQL analytics over big data using Hive LLAP or Spark SQL for sub-second query response times
* Real-time streaming ingestion and processing with Apache Kafka clusters feeding downstream analytics
* Machine learning and data science workflows at scale using Apache Spark MLlib
* NoSQL workloads requiring wide-column access patterns at massive scale with Apache HBase
* Hybrid big data architectures that extend existing on-premises Hadoop investments to Azure
* IoT data processing pipelines where device telemetry is ingested via Kafka and processed with Spark or Hadoop
