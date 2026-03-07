---
cloud_provider: "Azure"
service_category: "compute"
service_name: "AKS"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Kubernetes Service (AKS)

### Description
Azure Kubernetes Service (AKS) is a fully managed Kubernetes service that automates cluster provisioning, upgrades, scaling, and health monitoring, letting teams focus on application delivery rather than infrastructure operations. It offers multiple tiers — Free (dev/test), Standard (production with SLA-backed control plane), and Premium (long-term support) — as well as AKS Automatic mode, which applies best-practice defaults and automates node provisioning and network configuration out of the box. AKS integrates with Azure Monitor, Microsoft Entra ID, Azure Policy, and the Kubernetes AI toolchain operator (KAITO) for deploying AI/ML models on GPU nodes.

### Use Cases
* Production microservices platforms (e.g., deploying and auto-scaling containerized services with zero-downtime rolling updates)
* AI and ML model serving (e.g., running GPU inference workloads with KAITO on AKS GPU node pools)
* Lift-and-shift containerization (e.g., migrating existing VMs to containers using AKS)
* Cloud-to-edge deployments (e.g., Arc-enabled AKS for IoT and on-premises Kubernetes clusters)
* Internal developer platforms (e.g., standardized self-service Kubernetes environments with GitHub Actions CI/CD)
