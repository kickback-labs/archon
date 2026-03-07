---
cloud_provider: "Azure"
service_category: "database"
service_name: "Table Storage"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Table Storage

### Description
Azure Table Storage is a fully managed NoSQL key-value store for storing large volumes of semi-structured, schemaless data in the cloud at low cost. Data is organized into tables containing entities (rows), each identified by a composite key of a partition key and row key; entities within the same partition can be queried fast and updated atomically. The service is schemaless, meaning each entity in a table can carry a different set of up to 252 user-defined properties in addition to the three system properties (PartitionKey, RowKey, Timestamp). It supports access via OData protocol and REST API, and is accessible through the unified Azure Tables SDK alongside Azure Cosmos DB for Table. For workloads requiring higher performance, global distribution, and automatic secondary indexing, Azure Cosmos DB for Table is the recommended upgrade path with API compatibility; Table Storage remains cost-effective for straightforward, high-volume key-value access patterns where advanced NoSQL features are not needed.

### Use Cases
* Storing user profile data, session state, or device metadata for web-scale applications where cost per GB must be minimized and access is primarily by partition and row key
* Persisting flexible, schema-evolving datasets (e.g., IoT telemetry tags, application configuration blobs) where relational tables would require costly schema migrations
* Serving as a lightweight audit log or event journal for applications that write append-only records keyed by time-bucketed partition keys for efficient range queries
* Storing entity-relationship data that doesn't require complex joins or stored procedures and can be effectively denormalized for direct key-based access
* Backing simple lookup tables (e.g., reference data, feature flags, routing tables) where consistent low-latency point reads by composite key are the dominant access pattern
