# Warm Standby

## Description

The Warm Standby DR pattern runs a fully functional, exact replica of the production environment in a secondary region, but scaled down to its minimum viable footprint (smallest instance sizes, minimum auto-scaling group sizes). The standby is always live, always accepting health checks, and capable of receiving traffic immediately — it simply needs to scale out to handle full production load after a failover event.

This is the sweet spot between Pilot Light (compute not running) and Active-Active (full production scale in both regions). RTO is measured in minutes because there is no compute cold-start — only scaling out an already-running environment.

## When to Use

- RTO of minutes is required but the cost of running a full Active-Active setup is prohibitive
- The application is stateful and cannot tolerate the data loss inherent in Backup/Restore or the compute start-up time of Pilot Light
- Business continuity requirements mandate a hot environment in a secondary region at all times
- Regulatory compliance requires a demonstrable, live DR environment — not just theoretical recovery procedures

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Full compute stack running at minimum scale in secondary region (smallest instance type, min=1 ASG, minimal node pool) |
| `database` | Continuously replicating database in secondary region, ready for immediate read/write promotion |
| `networking` | Global load balancer or DNS failover (Route 53 health checks, Azure Traffic Manager, GCP Cloud Load Balancing) configured for automated cutover |
| `devops` | Auto-scaling configuration for fast scale-out; runbook automation for failover; regular DR drill schedule |

## RTO/RPO Profile

| Metric | Typical Range |
|---|---|
| RTO (Recovery Time) | 5–15 minutes |
| RPO (Recovery Point) | Minutes (continuous replication lag) |
| Infrastructure cost | Moderate — secondary region runs minimal-scale compute continuously |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **RTO** | Near-instant — standby is already running, just needs to scale out |
| **Cost** | Higher than Pilot Light — all infrastructure tiers run continuously at minimum scale |
| **Scale-out speed** | Auto-scaling must be validated to handle the production load within the RTO window |
| **Consistency** | Application configuration, secrets, and non-database state must be kept in sync between regions |

## Common Pitfalls

- Not load-testing the secondary region at full scale — a standby that cannot handle production load under pressure is not a standby
- Setting minimum auto-scaling to zero — "warm" requires at least one healthy instance running; zero instances is Pilot Light
- Forgetting to replicate application secrets and configuration — an application that starts but cannot connect to any external dependency is useless
- Not automating DNS/load balancer failover — manual DNS changes during a disaster add minutes and human error risk to the RTO
