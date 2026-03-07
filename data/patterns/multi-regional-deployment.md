# Multi-Regional Deployment

## Description

A multi-regional deployment replicates the full application stack across two or more geographically separated cloud regions. A global load balancer routes each user to the nearest healthy region, minimising round-trip latency. Databases replicate asynchronously (or via specialised globally-distributed database services) across regions. If one region experiences a complete outage, the global load balancer redirects traffic to the surviving regions.

This archetype is appropriate when the user base is genuinely global and latency is a first-class concern, or when the workload requires protection against the rare but possible failure of an entire cloud region.

## When to Use

- Geographically dispersed global user base with strict latency requirements (< 100ms from any major continent)
- Regional disaster resilience is explicitly required (RTO < 15 minutes, RPO < 1 minute)
- Business continuity requirements mandate surviving a complete cloud region failure
- Compliance requires data to be replicated across regions for backup or DR purposes

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Identical compute stack deployed independently in each region; auto-scaling within each |
| `database` | Globally distributed database (Spanner, Cosmos DB, Aurora Global Database, CockroachDB) or async cross-region replication with failover |
| `networking` | Global load balancer / Anycast routing (AWS Global Accelerator, Azure Front Door, GCP Cloud Load Balancing) + CDN |
| `security_identity` | Cross-region IAM replication, secrets replication, WAF at global edge |
| `devops` | Multi-region deployment pipelines; chaos engineering / regional failover testing; cross-region observability |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Availability** | Survives full regional outage; highest commercially viable availability tier |
| **Latency** | Users routed to nearest region — global p50 latency dramatically reduced |
| **Data consistency** | Async replication means a brief window of potential data loss (RPO > 0 unless using synchronous globally distributed DB) |
| **Write conflicts** | Multi-region writes require conflict resolution strategy (last-write-wins, CRDT, or designated write region) |
| **Cost** | Doubles or triples infrastructure cost; cross-region egress fees are significant |
| **Operational complexity** | Multi-region deployment orchestration, failover testing, and observability are substantially more complex |

## Common Pitfalls

- Selecting this archetype purely for prestige when users are concentrated in one region
- Not testing regional failover — failover procedures left untested until a real outage are rarely reliable
- Underestimating cross-region egress costs — these can be a significant fraction of total cloud spend
- Using a standard relational database with async replication and not accounting for RPO in the architecture
