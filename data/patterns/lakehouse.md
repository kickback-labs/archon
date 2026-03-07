# Data-Intensive / Lakehouse

## Description

The Lakehouse pattern converges the data lake and the data warehouse into a single unified storage and compute layer. Historically, organisations maintained separate systems: a data lake (cheap object storage like S3/GCS/ADLS) for raw ML training data, and a data warehouse (Snowflake, BigQuery, Redshift) for SQL-based BI reporting. The gap between them required fragile, expensive ETL pipelines.

The Lakehouse solves this by placing open table formats (Delta Lake, Apache Iceberg, Apache Hudi) directly on top of cheap object storage. These formats add ACID transactions, schema enforcement, time-travel queries, and efficient partition pruning to object storage — making it suitable for both ML training workloads and high-concurrency SQL analytics from a single storage layer, eliminating the ETL duplication.

## When to Use

- Analytics is a primary use case — the system must serve both data scientists (ML training) and business analysts (SQL BI)
- Large or growing data volumes make separate lake and warehouse systems economically unsustainable
- Historical data must be queryable and auditable (time-travel is a first-class requirement)
- The organisation wants to standardise on open formats (no proprietary data lock-in)
- Streaming and batch ingestion both feed the same analytical dataset

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `storage` | Object storage as the primary data layer (S3, GCS, ADLS Gen2) with open table format on top |
| `analytics` | Query engine for SQL analytics (Spark SQL, Trino/Athena, BigQuery, Databricks SQL) + ML training (Spark MLlib, Vertex AI, SageMaker) |
| `integration_messaging` | Ingestion pipelines — batch (AWS Glue, Dataflow) and streaming (Kinesis, Kafka, Pub/Sub) feeding the Bronze layer |
| `database` | Data catalog (AWS Glue Catalog, Unity Catalog, Dataplex) for schema management and discovery |
| `security_identity` | Column-level and row-level access controls via the table format's fine-grained permission model |
| `devops` | Pipeline orchestration (Airflow, Cloud Composer, MWAA), data quality monitoring |

## Commonly Paired Patterns

| Pattern | Why |
|---|---|
| Medallion Architecture | Structures the lakehouse into Bronze/Silver/Gold quality tiers |
| Real-Time Streaming | Streaming data lands in the Bronze layer before being processed to Silver/Gold |
| MLOps Pipeline | Uses the Gold layer as the feature store / training data source |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Unification** | Single source of truth eliminates ETL duplication between lake and warehouse |
| **Cost** | Object storage is dramatically cheaper than managed warehouse storage at scale |
| **Query performance** | Requires careful partitioning and file size management — poorly maintained lakehouses degrade significantly |
| **Complexity** | Open table format management (compaction, vacuum, schema evolution) requires dedicated data engineering |

## Common Pitfalls

- Not running regular compaction — small file accumulation kills query performance
- Missing the data catalog — without a catalog, the lakehouse becomes an ungoverned data swamp
- Not enforcing schema on write in the Silver layer — bad data propagates to Gold and corrupts BI reports
