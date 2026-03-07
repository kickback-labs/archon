# FinOps Batch Loading

## Description

FinOps Batch Loading is an architectural cost-optimisation pattern that identifies workloads currently using expensive, continuous real-time streaming architectures — where immediacy is not a genuine business requirement — and converts them to scheduled, high-volume batch processing jobs executed during off-peak hours or when spot/preemptible compute is cheapest.

Real-time streaming infrastructure (Kafka, Kinesis, Flink, Spark Streaming) runs 24/7 and carries continuous per-hour infrastructure costs regardless of data volume. For analytics pipelines, reporting jobs, model retraining, and data exports where the business only requires freshness measured in hours, not seconds, this cost is unjustified. Batch processing jobs run on demand, consume compute only during execution, and can leverage spot/preemptible instances for significant cost reductions.

## When to Use

- Existing streaming pipelines where the downstream consumer only checks results hourly or daily — the streaming latency advantage is unused
- ML model retraining pipelines where nightly or weekly retraining is sufficient — no need for continuous streaming feature computation
- Analytics reporting pipelines that generate reports on a schedule — batch ETL is an order of magnitude cheaper than streaming
- Large-scale data exports, data migrations, or bulk API sync operations where immediacy is not required
- Cloud cost overruns are identified in streaming infrastructure that cannot be justified by business SLAs

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `analytics` | Batch ETL/ELT job scheduler (Airflow, Cloud Composer, MWAA, Glue workflows); batch processing engine (Spark on EMR/Dataproc, AWS Glue, Cloud Dataflow in batch mode) |
| `compute` | Spot/preemptible instances for batch workloads — typically 60–80% cheaper than on-demand |
| `storage` | Staging area for batch inputs and outputs; object storage as the primary data movement layer |
| `devops` | Job scheduling, monitoring, alerting on job failure; SLA tracking for batch completion deadlines |

## Cost Optimisation Levers

| Lever | Typical Savings |
|---|---|
| Spot/Preemptible compute | 60–80% reduction in compute cost |
| On-demand execution (no idle streaming cluster) | 70–90% reduction vs. continuous cluster |
| Off-peak scheduling (lower demand pricing) | 10–30% additional reduction for committed compute |
| Serverless batch (Glue, Cloud Run Jobs) | No idle cost — pay only per job execution second |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Cost** | Dramatic reduction in infrastructure cost for latency-tolerant workloads |
| **Latency** | Data freshness degrades from seconds/minutes to hours — acceptable only if the business SLA permits |
| **Spot interruption** | Spot/preemptible compute can be interrupted — batch jobs must be checkpointed and restartable |
| **Simplicity** | Batch pipelines are significantly simpler to build, test, and debug than streaming equivalents |

## Common Pitfalls

- Applying batch loading to genuinely real-time requirements — this pattern is only appropriate when latency requirements are truly relaxed
- Not implementing job checkpointing — a 6-hour batch job that fails at hour 5 and must restart from scratch costs double
- Ignoring batch completion SLAs — a batch job that was supposed to complete by 06:00 for morning reports but fails silently at 08:00 is a business incident
- Not monitoring spot interruption rates — if a job is interrupted frequently, the effective cost savings may be lower than expected
