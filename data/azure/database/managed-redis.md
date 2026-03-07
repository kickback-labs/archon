---
cloud_provider: "Azure"
service_category: "database"
service_name: "Azure Managed Redis"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Managed Redis

### Description
Azure Managed Redis is a fully managed, high-performance in-memory data store built on Redis Enterprise software, operated by Microsoft on Azure. It delivers sub-millisecond read/write latency and high throughput for caching, session management, leaderboards, and real-time data pipelines. Four tiers are available — Memory Optimized, Balanced, Compute Optimized, and Flash Optimized — to match workload requirements from cost-sensitive development through extreme-throughput production. It supports Redis Enterprise modules including RedisJSON, RediSearch (vector search), RedisBloom, and RedisTimeSeries, and provides active geo-replication for globally distributed caches.

### Use Cases
* Application caching using the cache-aside pattern to offload relational or NoSQL databases and reduce read latency (e.g., product catalog pages, API responses)
* Distributed session storage for web applications where user state must survive horizontal scaling without relying on sticky sessions
* Vector search and AI inference caching using RediSearch to store and query embeddings alongside application data for RAG or recommendation pipelines
* Real-time leaderboards and sorted rankings using Redis sorted sets in gaming, e-commerce, or sports applications
* Job queuing and pub/sub messaging for decoupling microservices when a lightweight broker is preferred over a full message bus
