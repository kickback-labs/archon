# Data Fabric

## Description

Data Fabric is an architecture that provides a unified, intelligent data access and integration layer across a heterogeneous, distributed data estate — spanning on-premises databases, multiple cloud providers, SaaS applications, and data lakes — without physically moving or copying the data. It relies on automated metadata management, AI-driven data discovery, and virtualisation to create a single logical view of the enterprise's data regardless of where it physically lives.

Unlike a Data Lakehouse (which consolidates data into one physical store) or Data Mesh (which distributes ownership), Data Fabric federates access: data stays where it is, and the Fabric layer makes it appear unified to consumers.

Key capabilities: active metadata (AI that learns data relationships and automates curation), data virtualisation (query across sources without ETL), automated lineage tracking, and policy-driven governance across all connected systems.

## When to Use

- Enterprise data is highly fragmented across many systems (on-premises data warehouses, multiple cloud providers, legacy databases, SaaS tools) and physically consolidating it is impractical or too slow
- Regulatory or contractual constraints prevent data from being moved or copied across boundaries
- The primary challenge is data discovery and access governance across a complex, multi-cloud environment — not processing speed or query performance
- As a bridge architecture during long-term cloud migration — query legacy data in place while building cloud-native replacements

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `analytics` | Data virtualisation layer (Denodo, Dremio, Starburst) or managed equivalents; centralised metadata catalog with active AI-driven curation |
| `migration_hybrid` | Connectors to on-premises and multi-cloud data sources; hybrid network connectivity for federated query routing |
| `networking` | Private connectivity to all data sources (VPN, ExpressRoute, Direct Connect) for secure federated queries |
| `security_identity` | Centralised, policy-driven access control applied uniformly across all connected data sources |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Unification without migration** | Data stays in place — no ETL required, no data duplication |
| **Query performance** | Federated queries crossing network boundaries are slower than collocated queries — not suited for high-throughput analytics |
| **Complexity** | Requires maintaining connectors, metadata synchronisation, and access policies across many disparate systems |
| **Cost** | Virtualisation infrastructure and network egress costs for cross-boundary queries can be significant |

## Common Pitfalls

- Using Data Fabric for high-performance analytics — the network latency of federated queries makes this impractical for large-scale OLAP workloads
- Not investing in metadata management — a Fabric without accurate, automated metadata becomes as ungovernable as a data swamp
- Treating Data Fabric as a permanent architecture rather than a transitional one — most organisations eventually consolidate to a lakehouse or mesh
