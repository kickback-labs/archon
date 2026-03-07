# Backup and Restore

## Description

Backup and Restore is the simplest and lowest-cost Disaster Recovery (DR) strategy. Database snapshots, application data, configuration, and Infrastructure-as-Code (IaC) templates are periodically replicated to a geographically isolated secondary region or storage account. In the event of a disaster, engineers execute the IaC templates to provision new compute infrastructure from scratch in the secondary region, then restore data from the most recent backup.

This pattern has the highest RTO (hours to days) and RPO (hours to the last backup interval) of all DR patterns, but the lowest infrastructure cost — the secondary region consumes no ongoing compute resources.

## When to Use

- Non-critical internal workloads where extended downtime (hours to days) is acceptable
- Minimal DR budget — this pattern requires only backup storage costs, not standby compute
- Development, staging, or internal tooling environments
- Compliance requires geo-redundant backups but imposes no RTO/RPO SLA

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `storage` | Cross-region backup storage (S3 Cross-Region Replication, Azure Blob GRS, GCS dual-region) |
| `database` | Automated database snapshots with cross-region copy (RDS automated backups, Cloud SQL export, Azure SQL geo-backup) |
| `devops` | IaC templates (Terraform, CloudFormation, Bicep) for full environment rebuild; DR runbooks; backup restoration testing |

## RTO/RPO Profile

| Metric | Typical Range |
|---|---|
| RTO (Recovery Time) | 4 hours to multiple days |
| RPO (Recovery Point) | Time since last backup (1 hour to 24 hours typical) |
| Infrastructure cost | Very low — backup storage only |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Cost** | Lowest DR cost — no standby compute running in the secondary region |
| **RTO** | Slowest recovery — full environment rebuild from IaC + data restore takes hours minimum |
| **Simplicity** | Easiest to implement and maintain |
| **Testing** | DR runbooks must be regularly tested — untested restore procedures fail during actual disasters |

## Common Pitfalls

- Not testing the restore process regularly — a backup that cannot be restored is not a backup
- Not versioning and storing IaC alongside the backups — if the recovery procedure depends on undocumented manual steps, recovery time increases dramatically
- Not accounting for application state outside the database — message queues, in-flight transactions, and configuration that live outside the DB may not be in the backup
