---
cloud_provider: "Azure"
service_category: "analytics"
service_name: "Analysis Services"
pricing_model: "subscription"
managed: true
tier: 3
---
## Azure Analysis Services

### Description
Azure Analysis Services is a fully managed Platform-as-a-Service (PaaS) that hosts enterprise-grade tabular semantic data models in the cloud. It is built on the same engine as SQL Server Analysis Services Enterprise Edition and supports tabular models at compatibility levels 1200 and higher. Analysis Services ingests data from a wide variety of sources—including Azure SQL Database, Synapse Analytics, Data Lake Storage, on-premises databases (via an on-premises data gateway), Oracle, Teradata, and many others—and stores a highly compressed, in-memory cached representation that enables sub-second query response times for large datasets. An alternative DirectQuery mode skips the in-memory cache and executes queries directly against backend relational sources such as SQL Server, Azure SQL, Synapse, and Oracle, making it suitable for extremely large datasets that exceed server memory. Client tools including Power BI Desktop, Excel, SQL Server Management Studio (SSMS), and any XMLA-endpoint-compatible tool connect to Analysis Services to query the model using DAX (Data Analysis Expressions) or MDX. Models support row-level security, object-level security (table and column), partitioning for incremental refresh, and bi-directional relationships. Analysis Services is available in Developer, Basic, and Standard tiers; only the Standard tier supports query scale-out, which distributes read queries across up to seven additional read-only replicas to handle high-concurrency reporting workloads. Processing (data refresh) can be automated through Azure Data Factory, Azure Automation, PowerShell, REST APIs, or TMSL scripts executed via service principals. Microsoft is actively encouraging migration toward Power BI Premium and Microsoft Fabric, which provide XMLA endpoint compatibility and can replace Analysis Services for most BI workloads.

### Use Cases
* Centralized enterprise semantic layer for Power BI reports, providing a single, governed set of business metrics (e.g., revenue, margin, headcount) shared across the organization
* High-concurrency self-service BI with query scale-out, distributing analyst read queries across multiple replicas to avoid resource contention during business hours
* Incremental data refresh pipelines where only changed partitions are re-processed overnight, reducing processing time for large fact tables from hours to minutes
* Migrating SQL Server Analysis Services tabular models to the cloud with minimal reconfiguration, leveraging compatibility-level parity between on-premises SSAS and Azure Analysis Services
* Enforcing row-level and object-level security on sensitive financial or HR data so that users only see records relevant to their region or role
* Serving complex DAX queries from Excel pivot tables via the XMLA endpoint for finance and accounting teams accustomed to multidimensional analysis
* Combining data from heterogeneous sources (e.g., Azure SQL for transactions, on-premises Oracle for ERP, and flat files in Blob Storage) into a unified model without physically moving data to a warehouse
* Supporting regulated industries (finance, healthcare) that require in-region data residency and role-based access control via Microsoft Entra ID
* Query pool scale-out for month-end or year-end reporting peaks where concurrent user load spikes significantly beyond normal capacity
* Bridging legacy BI infrastructure during phased migration to Microsoft Fabric, using the XMLA endpoint to maintain compatibility with existing tools and reports
