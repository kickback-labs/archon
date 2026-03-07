# Multi-Site Active-Active

## Description

The Multi-Site Active-Active pattern runs the application at 100% production capacity simultaneously across two or more geographically isolated regions. A global load balancer actively distributes live user traffic across all regions. Each region is fully capable of handling the entire production load independently. When one region fails, the global load balancer instantly reroutes all traffic to the surviving regions — with zero downtime and near-zero data loss.

This pattern achieves the lowest RTO and RPO of any DR strategy but at the highest cost and complexity. Database writes must be coordinated across regions (using globally distributed databases or active-active replication), which introduces write latency and conflict resolution complexity.

## When to Use

- Mission-critical workloads where any downtime has severe business, safety, or financial consequences — payment processing, healthcare systems, emergency services, financial trading
- RTO must be near-zero (seconds or less) and RPO must be near-zero (seconds of data loss maximum)
- The application already serves a global user base and multi-region deployment is structurally required for performance
- Budget and engineering investment justify the significant cost premium over Warm Standby

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Full production compute stack in every active region; each region independently handles 100% load |
| `database` | Globally distributed, synchronously replicated database (Spanner, Cosmos DB multi-master, Aurora Global Database, CockroachDB) — or carefully managed async replication with conflict resolution |
| `networking` | Global Anycast load balancer (AWS Global Accelerator, Azure Front Door, GCP Global Load Balancing) distributing live traffic across all regions |
| `security_identity` | Cross-region IAM and secrets replication; global WAF at the load balancer edge |
| `devops` | Chaos engineering for regional failover testing; per-region deployment pipelines; cross-region observability; write conflict monitoring |

## RTO/RPO Profile

| Metric | Typical Range |
|---|---|
| RTO (Recovery Time) | Seconds (automatic load balancer rerouting) |
| RPO (Recovery Point) | Near-zero (synchronous replication) to minutes (async replication) |
| Infrastructure cost | Very high — doubles or triples infrastructure cost |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Availability** | Highest achievable — no perceptible failover event for end users |
| **Write consistency** | Synchronous cross-region replication adds write latency; async replication risks data loss on failover |
| **Write conflicts** | Multi-master writes can conflict — requires conflict resolution strategy (last-write-wins, CRDT, designated write region) |
| **Cost** | 2x–3x infrastructure cost compared to single-region deployment |
| **Operational complexity** | Requires deep expertise in distributed databases, global traffic management, and multi-region deployment orchestration |

## Common Pitfalls

- Selecting Active-Active for workloads that could tolerate Warm Standby — the cost and complexity premium is only justified by genuinely near-zero RTO/RPO requirements
- Not testing regional failover and failback — auto-failover that has never been exercised is unreliable in a real disaster
- Using async database replication and assuming near-zero RPO — async replication always has a replication lag window that becomes data loss on failover
- Underestimating egress costs — active traffic across multiple regions generates significant cross-region data transfer fees
