---
cloud_provider: "AWS"
service_category: "database"
service_name: "MemoryDB for Redis"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS MemoryDB for Redis

### Description
Amazon MemoryDB is a Redis-compatible, durable, in-memory database service purpose-built for modern microservices applications that need microsecond read and single-digit millisecond write latency with primary-database durability. Unlike ElastiCache (which is a cache-aside layer), MemoryDB stores data in memory and persists it durably across multiple Availability Zones using a distributed, multi-AZ transactional log, enabling fast failover, database recovery, and node restarts without data loss. It supports the full Redis API and data structures — strings, hashes, lists, sets, sorted sets, streams, and more — so existing Redis applications require no code changes. MemoryDB supports clusters with up to 500 nodes and 100 TB of storage, and integrates with AWS PrivateLink, AWS KMS, and TLS in-transit for enterprise security.

### Use Cases
* Primary operational database for microservices requiring sub-millisecond response times (e.g., real-time recommendation engines)
* Leaderboards, counters, and real-time scoring systems requiring durability without a separate persistent backing store
* Session management and user state storage for applications that cannot tolerate cache cold-starts after failover
* Durable message queues and pub/sub using Redis Streams with at-least-once delivery guarantees
* Replacing self-managed Redis clusters on EC2 with a fully managed, durably persisted alternative
* Financial applications needing in-memory performance combined with guaranteed data persistence (e.g., risk calculation engines)
* Caching tier that doubles as the primary database, eliminating the cache-aside pattern complexity
