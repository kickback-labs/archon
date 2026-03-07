---
cloud_provider: "Azure"
service_category: "migration_hybrid"
service_name: "Azure Database Migration Service"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Database Migration Service (DMS)

### Description
Azure Database Migration Service (Azure DMS) is a fully managed service that enables seamless, low-downtime migrations of databases from multiple sources to Azure data platforms. It supports both offline (one-time cutover) and online (continuous replication with minimal downtime) migration modes. Currently, DMS focuses on SQL Database modernization, supporting migrations to Azure SQL Database (offline), Azure SQL Managed Instance (online and offline), and SQL Server on Azure VMs (online and offline). The service is available via the Azure portal, PowerShell, and Azure CLI, and integrates with the broader Azure Migrate hub for end-to-end migration tracking. It uses private endpoints for secure connectivity between source and target and applies Microsoft best practices automatically during the migration process.

### Use Cases
* Migrating on-premises SQL Server databases to Azure SQL Database with minimal downtime using continuous online replication before cutover
* Lifting SQL Server workloads to SQL Server on Azure VMs for compatibility with features not supported in Azure SQL Database or Managed Instance
* Migrating to Azure SQL Managed Instance online to take advantage of near 100% SQL Server compatibility with a fully managed PaaS model
* Automating schema migration as part of a database modernization pipeline using DMS PowerShell or CLI integration in CI/CD workflows
* Tracking migration progress and validating schema compatibility through the Azure portal's unified migration experience
