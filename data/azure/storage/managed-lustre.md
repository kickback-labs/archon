---
cloud_provider: "Azure"
service_category: "storage"
service_name: "Azure Managed Lustre"
pricing_model: "on-demand"
managed: true
tier: 3
---
## Azure Managed Lustre

### Description
Azure Managed Lustre is a fully managed parallel file system based on the open-source Lustre protocol, purpose-built for high-performance computing (HPC) and data-intensive workloads requiring high throughput, low latency, and massive parallel I/O. It eliminates the operational complexity of self-managing a Lustre cluster — setup, patching, and infrastructure management are handled by Azure, while customers interact with a standard Lustre client interface. The underlying data disks are Azure Premium SSD (LRS), replicated three times locally within the datacenter to protect against drive and rack failures. All data is encrypted at rest using Azure managed keys by default, with optional customer-managed key support for additional security assurance. Azure Managed Lustre natively integrates with Azure Blob Storage via Lustre hierarchical storage management (HSM): data can be imported from and exported to blob containers so that the high-performance scratch tier is only populated for active compute jobs, with cold data remaining in lower-cost blob storage between runs. An Azure Lustre CSI driver is available for AKS, enabling Kubernetes pods to mount Managed Lustre file systems with automated client software installation and mount-point propagation via a DaemonSet. For broader data redundancy beyond LRS, users can export finished results to Azure Blob Storage configured with ZRS or GRS.

### Use Cases
* Large-scale HPC simulation jobs (e.g., computational fluid dynamics, seismic processing) requiring aggregate throughput of hundreds of GB/s across thousands of parallel processes with Lustre protocol compatibility
* AI/ML training pipelines with large datasets (e.g., image or genomic datasets) that need a high-speed shared scratch file system across many GPU nodes during training, with cold data staged from blob storage between jobs
* Genomics and life-sciences workflows where many parallel compute nodes must simultaneously read and write large intermediate files (e.g., BAM/FASTQ files in variant calling pipelines)
* Scientific rendering farms and media content processing pipelines that require a shared, high-bandwidth file system accessible from hundreds of VMs simultaneously
* Financial risk and quantitative analysis workloads running Monte Carlo simulations or backtesting across large parameter sets, where I/O throughput to a shared scratch file system is the bottleneck
* Kubernetes-based HPC workloads on AKS that require a Lustre-compatible shared file system mounted via the CSI driver without manual Lustre client configuration on each node
* Burst HPC scenarios where a temporary high-performance file system is provisioned for the duration of a compute job and then torn down, with data archived back to Azure Blob Storage via HSM export
