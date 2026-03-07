# Global Deployment

## Description

A global deployment operates as a location-unaware stack. Traffic is ingested via Anycast IP or a globally distributed edge network, and requests are served from the point of presence (PoP) or region closest to the user without any manual DNS configuration. Infrastructure is abstracted to the point where the application does not need to be aware of which region is serving a given request.

This archetype is typically achieved via globally-distributed managed services (Cloudflare Workers, Fastly Compute, AWS CloudFront Functions, or GCP Cloud Run in all regions behind a global LB), paired with globally-distributed databases (Spanner, Cosmos DB multi-master, PlanetScale). It represents the highest tier of availability and geographic performance.

## When to Use

- Massive-scale applications with truly global user bases (millions of concurrent users across all continents)
- Near-zero RTO/RPO requirements across any failure domain
- The business cannot tolerate any perceptible failover delay — traffic rerouting must be instantaneous
- Workloads where global consistency of the compute and data layer is a product requirement, not just an operational preference

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Edge compute or globally deployed containers behind a global load balancer |
| `database` | Globally distributed, synchronously replicated database (Spanner, Cosmos DB, CockroachDB) |
| `networking` | Global Anycast routing, global CDN at the edge, global WAF |
| `security_identity` | Edge-level WAF, DDoS protection at PoP, globally consistent IAM |
| `devops` | Global canary deployments, region-by-region rollout strategies, global observability |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Availability** | Highest achievable; approaches five-nines (99.999%) |
| **Consistency** | Synchronous global replication adds write latency; trade-off between consistency and write throughput |
| **Cost** | Extremely high — globally distributed infrastructure is the most expensive deployment archetype |
| **Operational complexity** | Requires deep expertise in distributed systems, global traffic management, and multi-region data replication |

## Common Pitfalls

- Selecting this archetype for workloads that don't genuinely need it — regional deployment is sufficient for the vast majority of production workloads
- Ignoring write latency penalties imposed by synchronous global database replication
- Not having runbooks and automated responses for global load balancer misconfigurations — a routing error at this scale affects all users simultaneously
