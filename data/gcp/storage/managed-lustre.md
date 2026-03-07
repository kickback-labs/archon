---
cloud_provider: "GCP"
service_category: "storage"
service_name: "Google Cloud Managed Lustre"
pricing_model: "on-demand"
managed: true
tier: 3
---
## GCP Google Cloud Managed Lustre

### Description
Google Cloud Managed Lustre is a fully managed, high-performance parallel file system service developed in collaboration with DDN, optimized for AI training, HPC simulations, and other throughput-intensive workloads. It delivers up to 1.5 TBps aggregate throughput and up to 5,800 read IOPS per TiB with storage capacity scaling from 9,000 GiB up to approximately 12.24 PiB (11.67 PiB). The service is POSIX-compliant, ensuring compatibility with existing applications, tools, and workflows without modification. Managed Lustre integrates natively with Compute Engine VMs (mounted via the Lustre client) and Google Kubernetes Engine (via the Managed CSI driver), making it suitable for both VM-based and containerized workloads. High-speed bidirectional data transfers with Cloud Storage are built in, enabling efficient staging of training datasets from object storage to the parallel file system and exporting results back. Data at rest and in transit are encrypted; customer-managed encryption keys (CMEK) via Cloud KMS are supported. IP-based access control and VPC Service Controls integration provide additional network-level security. The service is managed via the Google Cloud Console, gcloud CLI, REST API, and Terraform.

### Use Cases
* Large-scale AI/ML model training that requires high-throughput, low-latency access to multi-terabyte datasets shared across many GPU or TPU nodes simultaneously (e.g., LLM pre-training on hundreds of accelerators)
* HPC simulations and scientific computing workloads where parallel I/O from many compute nodes to a shared file system is critical for performance (e.g., computational fluid dynamics, weather modeling)
* EDA (Electronic Design Automation) workloads requiring high IOPS and low metadata latency for chip design simulation scratch storage
* Data staging pipelines that import training data from Cloud Storage into Lustre before a compute job starts, then export results back to object storage post-job
* Genomics and life sciences processing pipelines that generate and consume large intermediate files across many parallel tasks
* GKE-based ML workflows using the Managed Lustre CSI driver to provision and mount high-performance persistent storage for Kubernetes pods without manual instance management
* Media and VFX rendering pipelines requiring a high-throughput shared scratch space accessible by a render farm (e.g., multi-node compositing or simulation jobs)
