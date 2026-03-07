---
cloud_provider: "Azure"
service_category: "database"
service_name: "Cosmos DB"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Cosmos DB

### Description
Azure Cosmos DB is a fully managed, globally distributed NoSQL and vector database designed for modern, latency-sensitive, and AI-driven applications. It offers single-digit millisecond read/write latency, 99.999% availability SLA with multi-region writes and automatic failover, and instant elastic scaling with no manual capacity planning. It supports multiple data models — document, vector, key-value, graph, and table — through a single service, and exposes APIs for NoSQL, MongoDB, Cassandra, Gremlin, and Table. Integrated vector indexing and hybrid similarity search (DiskANN) make it a unified operational store for AI agent architectures, RAG pipelines, and LLM caching without a separate vector database. Data is automatically indexed schema-agnostically, and change feed enables event-driven and streaming integration patterns. Synapse Link provides no-ETL HTAP by mirroring operational data to an isolated analytical store for near-real-time analytics without impacting transactional performance.

### Use Cases
* Global consumer-facing applications (e.g., e-commerce, gaming, social platforms) requiring low-latency reads/writes distributed across multiple Azure regions with automatic failover
* AI agent backends and RAG applications storing embeddings alongside operational data in a single database using integrated vector search (DiskANN)
* IoT telemetry ingestion where millions of device events per second are written and queried with unpredictable burst traffic, using serverless or autoscale throughput
* Multi-tenant SaaS platforms using hierarchical partition keys (subpartitioning) to scale high-cardinality workloads beyond single logical partition limits
* Event-driven microservices architectures using Cosmos DB change feed to trigger Azure Functions or populate downstream streaming pipelines
* Session state and distributed caching at global scale (e.g., user session stores, shopping cart persistence) with geo-replicated low-latency reads
