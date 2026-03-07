# Regional Deployment

## Description

A regional deployment spreads the workload across multiple availability zones within a single geographic cloud region. A regional load balancer distributes traffic across compute replicas in different zones; if one zone fails, traffic is automatically rerouted to the surviving zones. Managed databases are provisioned with synchronous cross-zone replication so a standby can promote automatically on primary failure.

This is the standard production archetype for most applications. It provides high availability without the latency, cost, and complexity of multi-region replication, and it keeps data within a single geographic boundary — a common requirement for data sovereignty and regulatory compliance.

## When to Use

- Standard production workloads requiring high availability (target SLA ≥ 99.9%)
- Data sovereignty or regulatory residency constraints that mandate data stays within a specific country or region
- Teams that need resilience without the cost or operational complexity of multi-region architectures
- The user base is concentrated in a single geography with no strict global latency requirements

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Multi-zone auto-scaling groups, Kubernetes node pools spread across zones, or PaaS with multi-zone deployment |
| `database` | Multi-AZ database with synchronous standby replica (RDS Multi-AZ, Cloud SQL HA, Azure SQL Zone Redundant) |
| `networking` | Regional load balancer (ALB, Azure Load Balancer, GCP Regional LB) distributing across zones; CDN for static assets |
| `security_identity` | Regional IAM, secrets manager with replication within region |
| `devops` | Health checks and auto-healing across zones; zone-aware deployment strategies (rolling, blue-green) |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Availability** | Tolerates zone-level failures; does not survive full regional outage |
| **Latency** | Users in the same geography get good latency; distant users experience higher RTT |
| **Data residency** | Data stays within the region — satisfies most EU, APAC, and national data sovereignty laws |
| **Cost** | Cross-zone data transfer fees apply; standby database replica doubles storage cost |
| **Complexity** | Significantly simpler than multi-regional — manageable for small to medium teams |

## Common Pitfalls

- Placing all compute in one zone despite selecting a regional archetype — defeats the purpose
- Not testing zone failover explicitly — many teams discover failover gaps only during actual outages
- Forgetting CDN for public-facing assets — a regional deployment without a CDN delivers poor performance to remote users
