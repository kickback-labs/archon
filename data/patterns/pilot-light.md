# Pilot Light

## Description

The Pilot Light DR pattern keeps the most critical, stateful components of an application — primarily databases and object storage — continuously running and replicating in a secondary region, while application compute servers (instances, Kubernetes nodes, serverless functions) are defined but not provisioned or powered off. In a disaster, the "pilot light" is ignited: compute is provisioned and scaled up to production capacity, then pointed at the continuously-replicated data layer.

The name derives from the small gas flame kept continuously burning in a furnace — enough to quickly ignite the full burner without starting from cold.

## When to Use

- Production workloads requiring reasonable RTO (15–60 minutes) without the cost of running full standby compute 24/7
- Data RPO must be in minutes — databases replicate continuously, so very little data is lost even if compute takes time to restart
- Budget constraints prevent Warm Standby but Backup and Restore's RTO is too slow for the business
- The workload is stateful — the data is the most critical component to protect

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `database` | Continuously replicating database across regions (RDS read replica + promotion, Aurora Global Database, Cloud SQL cross-region replica) |
| `storage` | Cross-region replication for object storage (S3 CRR, GCS dual-region, Azure Blob GRS) |
| `compute` | IaC definitions for compute resources, ready to deploy on demand; pre-configured AMIs or container images ready to pull |
| `networking` | DNS TTL pre-configured for fast cutover; Route 53 health checks, Azure Traffic Manager, or GCP Cloud DNS |
| `devops` | Automated DR runbooks; regular DR drills; database promotion automation; compute scale-out automation |

## RTO/RPO Profile

| Metric | Typical Range |
|---|---|
| RTO (Recovery Time) | 15 minutes to 1 hour |
| RPO (Recovery Point) | Minutes (continuous replication lag) |
| Infrastructure cost | Low — only data layer runs continuously in secondary region |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Cost** | Significantly cheaper than Warm Standby — no idle compute in secondary region |
| **RTO** | Better than Backup/Restore — database is live; only compute needs provisioning |
| **RPO** | Near-zero data loss — continuous replication means very recent point-in-time recovery |
| **Complexity** | Database promotion and compute scale-out automation must be pre-built and regularly tested |

## Common Pitfalls

- Not automating the compute scale-up — a manual process that takes 45 minutes because an engineer is following a checklist defeats the purpose
- Not testing database promotion (replica → primary) — this is the most failure-prone step and must be rehearsed
- Forgetting that compute images may be outdated — AMIs and container images in the secondary region must be kept current with the primary
