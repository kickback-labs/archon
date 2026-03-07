---
cloud_provider: "Azure"
service_category: "storage"
service_name: "Azure Container Storage"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Container Storage

### Description
Azure Container Storage is a cloud-native volume management, deployment, and orchestration service built for stateful containerized workloads on Kubernetes. It integrates with Azure Kubernetes Service (AKS) and self-managed Kubernetes clusters, enabling dynamic provisioning of persistent volumes without manual CSI driver installation. Storage is backed by two underlying types: local NVMe disks (for ultra-low latency, highest-throughput workloads such as AI/ML frameworks and databases) and Azure Elastic SAN (for durable, network-attached block storage with LRS and ZRS redundancy). Volumes are exposed via NVMe over Fabrics (NVMe-oF) or iSCSI, speeding up pod attach/detach operations and enabling fast pod recovery at scale. A single Elastic SAN-backed cluster can provision thousands of persistent volumes, bypassing the per-VM disk attachment limits (e.g., 64 disks per VM) that constrain traditional Azure Managed Disk CSI approaches. Volume lifecycle — provisioning, expansion, snapshots, and deletion — is managed through standard Kubernetes `kubectl` commands and StorageClass objects.

### Use Cases
* High-performance stateful databases on AKS (e.g., PostgreSQL) using local NVMe disks for near-native I/O latency without managing underlying disk provisioning
* AI/ML training workloads requiring fast local scratch storage (e.g., Ray, Kubeflow) on GPU-accelerated or storage-optimized VM SKUs
* General-purpose tier-1 and tier-2 stateful applications (e.g., streaming pipelines, CI/CD artifact stores) backed by Elastic SAN for durable, zone-redundant block volumes
* Large-scale multi-tenant Kubernetes clusters where thousands of pods need independent persistent volumes beyond Azure Managed Disk per-VM attachment limits
* Applications requiring Kubernetes-native snapshot and restore workflows for point-in-time recovery without additional storage management tooling
* Dev/test Kubernetes environments needing cost-efficient, consolidated block storage with volume expansion support via standard PVC resize operations
