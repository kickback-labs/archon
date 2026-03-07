---
cloud_provider: "Azure"
service_category: "analytics"
service_name: "Data Explorer"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Data Explorer (ADX)

### Description
Azure Data Explorer is a fully managed, high-performance big data analytics platform optimized for interactive exploration of large volumes of diverse data with near real-time latency. It is purpose-built for log analytics, time-series analysis, IoT telemetry, and general exploratory analytics over structured, semi-structured (JSON), and unstructured (free-text) data. ADX uses the Kusto Query Language (KQL), an open-source language also used by Azure Monitor Logs, Application Insights, and Microsoft Defender for Endpoint. Ingestion scales to terabytes of data in minutes at up to 12 Mbps per core via queued or streaming ingestion; queries over petabytes return results within milliseconds to seconds. The service organizes data into clusters, databases, and tables with strongly typed schemas; all data is automatically indexed and partitioned at ingest time. ADX includes native support for time-series creation, manipulation, anomaly detection, and forecasting across thousands of series in seconds. It also supports embedded Python code in KQL queries and integrates natively with Power BI, Grafana, Tableau, and Microsoft Fabric's Real-Time Intelligence workload.

### Use Cases
* Log and telemetry analytics — ingest application, infrastructure, or security logs at scale and run ad-hoc KQL queries to identify patterns or root causes within seconds
* IoT time-series monitoring — aggregate and analyze billions of sensor readings from devices with native time-series functions for anomaly detection and predictive maintenance
* Real-time operational dashboards — power Azure Data Explorer dashboards or Power BI reports that refresh continuously against live ingested data
* Multi-tenant SaaS analytics — embed ADX as the data platform for SaaS applications that need per-tenant data isolation and interactive query concurrency
* Security analytics — serve as the analytics backend for security operations (SIEM) scenarios, enabling fast search over raw log data without pre-aggregation
* Clickstream and web analytics — analyze billions of lines of log data from publishers or ad networks to surface real-time user behavior trends and personalization signals
* Geospatial analytics — run geospatial queries (grid systems, proximity, clustering) over event streams that include location data from vehicles or field assets
