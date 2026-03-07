# Zonal Deployment

## Description

A zonal deployment confines the entire workload to a single physical zone (data centre) within a cloud region. All compute, storage, and networking resources colocate in one facility. The provider manages the physical infrastructure, but a single zone represents a single fault domain — a power outage, cooling failure, or network partition in that zone takes the entire deployment offline.

This archetype is not intended for production availability. Its value is in the extremely low intra-zone network latency (sub-millisecond between resources in the same zone), minimal egress costs, and simplicity of deployment.

## When to Use

- Development, staging, or test environments where downtime is acceptable
- Non-critical internal tooling where SLAs do not apply
- High-performance computing or tightly coupled workloads that require the absolute minimum network round-trip between components
- Cost optimisation: avoiding cross-zone data transfer fees when resiliency is genuinely not required

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Single-zone VM fleet, container cluster, or FaaS — no cross-zone replication |
| `database` | Single-zone database instance (no standby replica in another zone) |
| `networking` | Zonal load balancer; no global or regional routing; traffic stays within the zone |
| `security_identity` | Standard IAM and secrets management; no geo-replication of credentials needed |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Availability** | Single point of failure — any zone-level event causes full outage |
| **Latency** | Lowest achievable network latency between components |
| **Cost** | No cross-zone data transfer fees; minimal redundancy overhead |
| **Recovery** | No automatic failover — manual restore or re-deploy on zone failure |

## Common Pitfalls

- Using a zonal deployment for a production workload with implicit availability expectations
- Forgetting to document the single-zone constraint so future maintainers don't assume multi-zone resilience
