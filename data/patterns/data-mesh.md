# Data Mesh

## Description

Data Mesh is a decentralised, socio-technical data architecture that distributes ownership of analytical data to the business domains that generate it. Rather than centralising all data engineering through a single platform team (a bottleneck as organisations scale), Data Mesh assigns each domain (e.g., marketing, logistics, customer success) the responsibility of producing, governing, and serving its own analytical datasets as self-contained "data products."

A Data Mesh is built on four core principles:
1. **Domain ownership** — Analytical data is owned by the domain that produces it, not a central IT team
2. **Data as a product** — Each domain treats its datasets as a product with SLAs, documentation, and discoverability
3. **Self-serve platform** — A central platform team provides shared infrastructure tooling (storage, query engines, cataloging) so domains can operate autonomously without building infrastructure from scratch
4. **Federated governance** — Cross-domain standards (naming, PII handling, access control, SLAs) are centrally defined but locally applied

## When to Use

- Large enterprises where a central data engineering team has become a bottleneck — business domains wait months for data pipeline changes
- Organisations where different domains have drastically different data freshness, quality, and access pattern requirements
- When data ownership and accountability are unclear and "data quality is someone else's problem"
- Highly regulated environments where data governance must be applied at the source domain, not retroactively in a central pipeline

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `analytics` | Per-domain data pipelines and query infrastructure; a centralised data catalog for cross-domain discovery (Dataplex, Unity Catalog, Collibra) |
| `storage` | Shared object storage infrastructure (or isolated per-domain buckets) with open table formats |
| `security_identity` | Federated access control — cross-domain data product access governed by centralised policy but enforced locally |
| `devops` | Self-serve platform tooling enabling domains to provision pipelines, run quality checks, and publish data products without platform team involvement |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Scalability** | Removes the central bottleneck — data pipeline velocity scales with the number of domain teams |
| **Organisational maturity** | Requires domains to accept data engineering responsibility — many teams are not ready for this |
| **Consistency** | Federated governance is hard to enforce consistently — cross-domain data quality gaps are a real risk |
| **Platform investment** | The self-serve platform is a significant upfront infrastructure investment |

## Common Pitfalls

- Adopting Data Mesh as a technical architecture without the organisational change required — it fails without domain ownership culture
- Confusing Data Mesh with a technology choice (it is an organisational pattern, not a specific tool)
- Not investing in the self-serve platform — domains that must build their own infrastructure from scratch produce poor-quality data products
- Allowing domains to define their own governance standards — federated governance requires central standards even if local enforcement
