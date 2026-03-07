---
cloud_provider: "GCP"
service_category: "compute"
service_name: "Google Kubernetes Engine"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Google Kubernetes Engine (GKE)

### Description
Google Kubernetes Engine is GCP's fully managed Kubernetes service for deploying, scaling, and managing containerized workloads. GKE offers two modes of operation: Autopilot (fully managed nodes with built-in hardening, per-Pod billing, and automatic scaling) and Standard (user-managed node pools with full flexibility). It integrates deeply with Google Cloud's networking (VPC-native clusters), security (Workload Identity, Binary Authorization, Shielded Nodes), and observability (Cloud Monitoring, Managed Prometheus) services. GKE supports GPU and TPU accelerators for AI/ML workloads, cluster autoscaling, node auto-provisioning, and multi-cluster fleet management through GKE Enterprise.

### Use Cases
* Microservices and multi-container application deployments (e.g., running stateless services with horizontal autoscaling)
* AI/ML model training and inference at scale (e.g., distributed GPU workloads on A3 node pools)
* Stateful workloads with persistent storage (e.g., databases using Persistent Disk or Filestore CSI drivers)
* Multi-tenant platform hosting with namespace isolation
* Hybrid and multi-cloud workload management via GKE Enterprise fleet APIs
