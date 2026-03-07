# Sharding

## Description

Sharding horizontally partitions a large dataset across multiple independent database instances (shards). Each shard holds a non-overlapping subset of the data, determined by a shard key (e.g., tenant ID, user ID range, geographic region). A routing layer maps each incoming query to the correct shard and directs the operation accordingly. Because each shard is an independent database, the total write throughput and storage capacity of the system scales linearly with the number of shards.

Most major managed database services now offer native sharding: Amazon DynamoDB (partition keys), Google Bigtable, Cassandra, MongoDB Atlas sharding, and CockroachDB automatic range sharding.

## When to Use

- A single database instance has reached its maximum vertical scaling limit for write throughput or storage
- A single table has grown so large that query latency degrades despite indexing and query optimisation
- Multi-tenant SaaS architectures where each tenant's data can be cleanly isolated on a per-tenant shard
- Horizontal scaling of write-heavy workloads where read replicas alone are insufficient

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `database` | Multiple shard instances (same DB engine); a routing layer (application-level, proxy, or native DB sharding) |
| `compute` | Application must include shard-routing logic if not using a managed sharded database |
| `devops` | Shard rebalancing tooling, monitoring per-shard capacity, cross-shard query orchestration |

## Shard Key Selection Criteria

| Criterion | Guidance |
|---|---|
| **Cardinality** | The shard key must have high cardinality — low-cardinality keys create hot shards |
| **Distribution** | Keys should distribute writes evenly — monotonically increasing keys (timestamps, auto-increment IDs) cause hot shard problems |
| **Query alignment** | Queries that include the shard key are routed to a single shard (efficient); queries without it fan out across all shards (expensive) |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Scalability** | Theoretically unlimited horizontal scaling of storage and write throughput |
| **Cross-shard queries** | Queries that span multiple shards (joins, aggregations) are expensive — must fan out and merge results |
| **Transactions** | Cross-shard transactions are either impossible or require distributed transaction coordination |
| **Resharding** | Growing the number of shards or changing the shard key is operationally expensive |
| **Hotspot risk** | A poorly chosen shard key concentrates load on a single shard, defeating the purpose |

## Common Pitfalls

- Choosing a low-cardinality shard key (e.g., country code with 2 values) — most writes land on one or two shards
- Using a monotonically increasing key (auto-increment ID, timestamp) as the shard key — all writes go to the last shard
- Not accounting for cross-shard queries in the application design — these become performance bottlenecks that are hard to fix after launch
- Sharding prematurely — most databases scale much further than expected with vertical scaling, read replicas, and query optimisation before sharding is truly needed
