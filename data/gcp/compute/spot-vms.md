---
cloud_provider: "GCP"
service_category: "compute"
service_name: "Spot VMs"
pricing_model: "on-demand"
managed: false
tier: 2
---
## GCP Spot VMs

### Description
Spot VMs are short-lived, heavily discounted Compute Engine instances that use Google Cloud's spare capacity and can be reclaimed (preempted) with a 30-second shutdown notice when that capacity is needed elsewhere. They offer discounts of up to 60–91% compared to on-demand (standard) VM pricing, making them well-suited for fault-tolerant, stateless, or restartable workloads. Spot VMs succeed the older Preemptible VMs (which had a fixed 24-hour maximum runtime) and have no maximum runtime limit; however, they still carry preemption risk that varies by zone, region, and machine type. Unlike preemptible VMs, Spot VMs also support live migration for maintenance events when the machine type supports it. Spot VMs are supported across general-purpose, compute-optimized, memory-optimized, and accelerator-optimized machine series, including GPU instances.

### Use Cases
* Batch and HPC workloads with checkpoint/restart capability (e.g., simulation jobs that save intermediate state and resume after preemption)
* Large-scale ML model training with fault-tolerant frameworks (e.g., distributed TensorFlow or PyTorch training using Spot GPU VMs)
* CI/CD build and test pipelines where individual jobs can be retried cheaply on preemption
* Data processing pipelines on Dataproc or Cloud Batch where tasks are idempotent and can tolerate node loss
* Cost-sensitive development and staging environments that don't require guaranteed uptime
* Autoscaling managed instance groups (MIGs) mixing on-demand and Spot VMs to balance cost and availability
