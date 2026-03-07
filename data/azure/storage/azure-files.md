---
cloud_provider: "Azure"
service_category: "storage"
service_name: "Azure Files"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Files

### Description
Azure Files is a fully managed cloud file service that provides shared file storage accessible over SMB, NFS, and the Azure Files REST API. File shares can be mounted concurrently by Windows, Linux, and macOS clients, both in the cloud and on-premises. Azure File Sync can cache SMB shares on Windows servers for low-latency access at the edge.

### Use Cases
* Replacing or supplementing on-premises file servers and NAS devices (e.g., lift-and-shift of shared drives)
* Persistent storage for containerized workloads requiring a shared file system across multiple pods or nodes
* Shared application configuration files and diagnostic logs for distributed cloud applications
* Home directory and profile storage for Azure Virtual Desktop users via FSLogix
* Dev/Test tooling shared across multiple VMs without per-VM provisioning
