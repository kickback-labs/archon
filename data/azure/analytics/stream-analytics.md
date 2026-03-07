---
cloud_provider: "Azure"
service_category: "analytics"
service_name: "Stream Analytics"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Stream Analytics

### Description
Azure Stream Analytics is a fully managed, serverless real-time stream processing engine that analyzes and processes high volumes of streaming data with submillisecond latencies. It uses a SQL-based query language augmented with temporal constraints, and is extensible via JavaScript and C# user-defined functions (UDFs) for advanced scenarios. Jobs can be authored with a no-code drag-and-drop editor or with familiar SQL syntax and deployed with CI/CD pipelines to Azure or to the IoT Edge runtime for hybrid architectures. Stream Analytics ingests data from sources such as Azure Event Hubs, Azure IoT Hub, and Blob Storage, and routes output to sinks including Azure SQL Database, Cosmos DB, Data Lake Storage, Synapse Analytics, Power BI, and Event Hubs. It offers built-in machine learning capabilities for anomaly detection and supports geospatial analytics. The service scales automatically via Streaming Units (billed hourly based on peak selection) with at-least-once delivery guarantees and a 99.9% availability SLA.

### Use Cases
* Real-time IoT telemetry processing — ingest millions of sensor events per second from IoT Hub and detect anomalies using built-in ML models
* Low-latency dashboarding — route processed event streams directly to Power BI for live operational dashboards without a separate ingestion layer
* Streaming ETL — transform, filter, and enrich event streams from Event Hubs before landing enriched data in Azure Data Lake Storage Gen2 or Synapse Analytics
* Real-time alerting — apply temporal windowing queries (tumbling, hopping, session) to trigger downstream alerts via Event Grid or Service Bus when thresholds are breached
* Geospatial analytics — use built-in geospatial functions to track fleet positions, detect geofence crossings, or aggregate location-based metrics in motion
* Edge stream processing — deploy the same SQL query to IoT Edge devices for ultra-low-latency local analytics before forwarding aggregated results to the cloud
* Clickstream analytics — aggregate and sessionize web clickstream data from Event Hubs to derive real-time user behavior metrics
