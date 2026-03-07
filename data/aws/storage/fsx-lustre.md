---
cloud_provider: "AWS"
service_category: "storage"
service_name: "FSx for Lustre"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS FSx for Lustre

### Description
Amazon FSx for Lustre is a fully managed, high-performance parallel file system powered by the open-source Lustre filesystem, optimized for AI/ML, HPC, and data analytics workloads. It delivers up to terabytes per second of throughput, millions of IOPS, and sub-millisecond latencies, and is the fastest storage for GPU instances in the cloud — supporting up to 1,200 Gbps per-client throughput with Elastic Fabric Adapter (EFA) and NVIDIA GPUDirect Storage. FSx for Lustre natively links to Amazon S3 buckets, enabling data in S3 to be accessed and processed transparently through a POSIX-compliant file interface. The FSx Intelligent-Tiering storage class automatically moves data between Frequent Access, Infrequent Access, and Archive tiers starting at less than $0.005 per GB-month. It integrates with Amazon SageMaker HyperPod, Amazon EKS, AWS Batch, and AWS ParallelCluster for orchestrated compute workloads.

### Use Cases
* AI/ML model training with fast data loading, checkpointing, and KV-cache serving for GPU instances (e.g., SageMaker HyperPod clusters)
* High-performance computing (HPC) simulations requiring sustained terabytes-per-second throughput and millions of IOPS
* Genomics and life sciences analysis (e.g., cryo-EM processing, genome sequencing pipelines)
* Quantitative financial analysis and risk modeling processing large datasets at high speed
* Video rendering and visual effects (VFX) pipelines requiring high-throughput shared file access
* Cloud bursting HPC workloads from on-premises Lustre clusters to AWS with S3 as a persistent data layer
