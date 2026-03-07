---
cloud_provider: "Azure"
service_category: "compute"
service_name: "Red Hat OpenShift"
pricing_model: "on-demand"
managed: true
tier: 3
---
## Azure Red Hat OpenShift (ARO)

### Description
Azure Red Hat OpenShift (ARO) is a fully managed OpenShift service on Azure, co-engineered and co-supported by Microsoft and Red Hat. It extends Kubernetes with a complete enterprise platform that includes built-in CI/CD pipelines, container image registry, service mesh, monitoring, logging, and authentication—all pre-integrated and tested together. There are no virtual machines to patch or manage: control plane, infrastructure, and application nodes are all maintained by Microsoft and Red Hat on your behalf. Clusters are deployed into your own Azure subscription and billed through Azure, requiring no separate Red Hat contract. ARO integrates natively with Microsoft Entra ID for identity and RBAC, and supports ExpressRoute and VNet peering for private networking. It provides a 99.95% uptime SLA and can deploy clusters across more than 60 Azure regions. OpenShift Virtualization (GA) allows traditional VM workloads to run alongside containers on the same platform, and Confidential Containers (GA) enable hardware-based encryption for sensitive workloads.

### Use Cases
* Enterprise Kubernetes platform with integrated developer tooling (e.g., teams migrating from on-premises OpenShift to cloud without retraining)
* Regulated-industry container deployments requiring compliance certifications (e.g., healthcare or financial services applications needing HIPAA or PCI-DSS controls)
* Hybrid cloud application delivery (e.g., extending on-premises OpenShift clusters to Azure using HCX and consistent tooling)
* CI/CD-driven microservices delivery (e.g., using built-in OpenShift Pipelines to go from source code to production containers automatically)
* Co-managed enterprise support scenarios (e.g., joint Microsoft and Red Hat SRE response to cluster incidents via a single Azure support ticket)
* VM and container co-location modernization (e.g., running legacy VMs alongside containerized microservices on ARO with OpenShift Virtualization)
* Zero-trust workload protection for sensitive data (e.g., encrypting data-in-use with Confidential Containers for AI inference in regulated industries)
