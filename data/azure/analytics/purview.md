---
cloud_provider: "Azure"
service_category: "analytics"
service_name: "Microsoft Purview"
pricing_model: "subscription"
managed: true
tier: 2
---
## Microsoft Purview

### Description
Microsoft Purview is a unified data governance, security, and compliance platform that helps organizations discover, classify, protect, and manage data across their entire data estate — spanning on-premises, multi-cloud, and SaaS sources. It combines data governance capabilities (Data Map, Unified Catalog, data lineage, data quality) with data security solutions (Information Protection, Data Loss Prevention, Insider Risk Management) and data compliance tools (Audit, eDiscovery, Compliance Manager, Records Management) in a single portal experience. The Purview Data Map automatically scans and classifies data assets across 200+ supported sources, building a unified catalog with rich metadata, lineage tracking, and business glossary integration. Data stewards can curate assets, apply sensitivity labels, manage data quality rules, and monitor governance health through built-in dashboards. Purview is also built into Microsoft Fabric as its native governance layer, providing consistent policy enforcement across all Fabric workloads via the OneLake Catalog. AI-assisted capabilities help analysts discover data using natural language search and accelerate data curation.

### Use Cases
* Enterprise data catalog — scan and classify data assets across Azure, AWS, on-premises SQL, and SaaS systems into a searchable unified catalog that business users can query with natural language
* Data lineage tracking — automatically map end-to-end data lineage across ETL pipelines (Data Factory, Synapse, Databricks) so teams can trace data origin and understand impact of schema changes
* Sensitivity label enforcement — apply Microsoft Information Protection sensitivity labels to data assets and enforce DLP policies that prevent accidental oversharing of sensitive data in AI apps and Copilot
* Regulatory compliance — use Compliance Manager to assess compliance posture against frameworks (GDPR, HIPAA, ISO 27001) and track remediation tasks across the organization
* Insider risk and eDiscovery — detect risky data exfiltration behaviors with Insider Risk Management and conduct legal hold and eDiscovery workflows without leaving the Purview portal
* Microsoft Fabric governance — govern all Fabric workloads through the built-in OneLake Catalog, enforcing access controls, sensitivity labels, and audit trails across lakehouses, warehouses, and reports
* Data quality management — define and run data quality rules on registered data assets to measure, monitor, and improve data trustworthiness before it reaches downstream analytics consumers
