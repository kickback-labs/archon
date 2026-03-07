---
cloud_provider: "Azure"
service_category: "storage"
service_name: "Blob Storage"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Blob Storage

### Description
Azure Blob Storage is Microsoft's massively scalable object storage service for unstructured data—text, images, video, audio, log files, backups, and any other binary or text content. Data is organized into storage accounts, containers, and blobs; blob types include block blobs (general-purpose, up to ~190.7 TiB), append blobs (optimized for log append), and page blobs (random-access, used for Azure VM disks). Blob Storage supports multiple access tiers—Hot, Cool, Cold, and Archive—enabling cost optimization by automatically moving infrequently accessed data to cheaper tiers. It is accessible via HTTPS REST API, Azure SDKs, Azure CLI, PowerShell, SFTP, and NFS 3.0, and integrates natively with Azure Data Lake Storage Gen2 for hierarchical namespace and big-data analytics workloads.

### Use Cases
* Static asset and media hosting (e.g., serving images, videos, and JavaScript bundles directly to web browsers via CDN)
* Backup, archiving, and disaster recovery (e.g., storing database backups and VM snapshots in the Archive tier for long-term, low-cost retention)
* Big data and analytics landing zone (e.g., ingesting raw event logs into Data Lake Storage Gen2-enabled Blob Storage for processing with Azure Databricks)
* Application log and telemetry storage (e.g., writing append blobs from VM fleets or IoT devices for later analysis)
