---
cloud_provider: "GCP"
service_category: "compute"
service_name: "Cloud GPUs"
pricing_model: "on-demand"
managed: false
tier: 2
---
## GCP Cloud GPUs

### Description
Cloud GPUs are NVIDIA GPU accelerators that can be attached to Compute Engine VMs (or used via purpose-built accelerator-optimized machine series) to deliver high-performance compute for AI/ML training, inference, HPC, and graphics workloads. Google Cloud offers a broad GPU portfolio across several machine series: the **A4** (NVIDIA GB200 NVL72) and **A3 Ultra** (NVIDIA H200) series are designed for the largest frontier AI training and inference clusters with NVLink interconnects and GPUDirect RDMA networking; **A3 High/Mega** (NVIDIA H100) and **A2** (NVIDIA A100) target large-scale distributed training; **G2** (NVIDIA L4) and **G4** (NVIDIA L40S) suit inference, media transcoding, and workstation graphics; and legacy **N1** instances support attaching NVIDIA T4, V100, or P100 GPUs for general ML workloads. GPUs are also available in Cloud Batch jobs and Cloud Run jobs for serverless GPU inference. GPUDirect Storage and GPUDirect RDMA (via InfiniBand-class networking) are supported on A3/A4 clusters for maximum bandwidth. Pricing is per-second with sustained-use discounts available on on-demand GPUs; Spot GPU VMs reduce cost by up to 60–91% for preemption-tolerant workloads.

### Use Cases
* Large language model (LLM) and foundation model training (e.g., distributed pre-training across A3 Ultra H200 clusters with GPUDirect RDMA)
* AI inference serving at scale (e.g., real-time LLM inference on G2 L4 or A3 instances behind a load balancer)
* High-performance computing and scientific simulations (e.g., molecular dynamics, CFD on GPU-accelerated VMs)
* Batch ML experimentation and hyperparameter tuning (e.g., using Cloud Batch with A2 GPU VMs and Spot pricing)
* Media transcoding and rendering (e.g., GPU-accelerated video encoding pipelines using G2 L4 instances)
* Virtual workstations with GPU graphics acceleration (e.g., NVIDIA RTX Virtual Workstations on G2 instances for CAD/3D design)
* Serverless GPU inference using Cloud Run jobs with attached GPUs for on-demand, scale-to-zero inference workloads
