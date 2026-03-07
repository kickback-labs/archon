# Medallion Architecture

## Description

The Medallion Architecture organises a data lakehouse into three logically distinct quality tiers, each with a specific contract around data completeness, cleanliness, and transformation state. Data flows directionally from Bronze to Silver to Gold; each tier is a stable, queryable snapshot of the data at that level of refinement.

- **Bronze (Raw):** The ingestion landing zone. Data arrives exactly as it was received from source systems — no transformations, no deduplication. The Bronze layer is append-only and serves as the immutable audit record and disaster recovery source.
- **Silver (Cleansed):** Data is deduplicated, null-handled, schema-conformed, and validated. This is the single source of truth for data scientists running exploratory analysis and ad-hoc queries. It represents what the enterprise believes the data actually is.
- **Gold (Business-Ready):** Highly curated, denormalised, domain-specific aggregates. Star schemas, pre-computed KPIs, and feature tables for ML models. Optimised for high-speed reporting, executive dashboards, and production ML feature serving.

## When to Use

- Any organisation building or operating a data lakehouse that needs a structured data quality framework
- When the team needs to separate raw ingest concerns from data quality concerns from business logic concerns
- Regulatory environments requiring immutable raw data audit trails (Bronze) alongside clean reporting (Gold)
- Data science teams that need a stable, cleansed dataset (Silver) that is distinct from the raw ingest chaos
- When different teams (engineering, analytics, data science, product) consume data at different quality levels

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `storage` | Object storage hosts all three layers; open table format (Delta/Iceberg) provides ACID guarantees at each tier |
| `analytics` | ETL/ELT pipelines transforming Bronze → Silver → Gold (Spark, Glue, Dataflow, dbt); query engines for each layer |
| `integration_messaging` | Streaming or batch ingestion feeds Bronze; orchestration (Airflow) triggers tier-to-tier transformations |
| `devops` | Data quality monitoring at Silver, pipeline SLAs, lineage tracking across tiers |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Data quality** | Clear, progressive quality contracts make debugging pipelines straightforward |
| **Storage cost** | Data is stored at all three tiers — approximately 2–3x the raw data size |
| **Latency** | Bronze-to-Gold pipeline adds processing latency — Gold is not real-time unless streaming pipelines are used end-to-end |
| **Governance** | Clear tier boundaries make access control, data lineage, and compliance auditing manageable |

## Common Pitfalls

- Skipping the Silver tier and transforming directly from Bronze to Gold — losing the cleansed intermediate layer makes debugging and reprocessing very difficult
- Not enforcing schema evolution policy at Silver — downstream Gold consumers break when Silver schemas change without notice
- Treating Gold as a place for all possible queries rather than specific high-value use cases — Gold should be narrow and fast, not general-purpose
