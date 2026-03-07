---
cloud_provider: "AWS"
service_category: "database"
service_name: "ElastiCache"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS ElastiCache

### Description
Amazon ElastiCache is a fully managed in-memory caching service compatible with Redis OSS and Memcached. It dramatically reduces latency by serving frequently accessed data from fast, managed in-memory caches rather than disk-based databases. ElastiCache for Redis supports sub-millisecond read and write latency, clustering with up to 500 nodes, Multi-AZ with automatic failover, and read replicas. It is fully integrated with Amazon VPC for network isolation, AWS KMS for encryption at rest, and supports TLS in-transit. ElastiCache Serverless removes the need to manage nodes or shards and scales capacity automatically.

### Use Cases
* Database query result caching to reduce load on relational databases (e.g., RDS or Aurora)
* Real-time session management for web and mobile applications
* Gaming leaderboards and real-time scoring using sorted sets
* Rate limiting, token buckets, and API throttling with atomic Redis operations
* Pub/sub messaging for lightweight real-time communication between application components
