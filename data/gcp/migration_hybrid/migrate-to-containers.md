---
cloud_provider: "GCP"
service_category: "migration_hybrid"
service_name: "Migrate to Containers"
pricing_model: "per-request"
managed: false
tier: 2
---
## GCP Migrate to Containers

### Description
Google Cloud Migrate to Containers is a migration tool that automates the conversion of existing VM-based workloads—running on VMware on-premises or Compute Engine—into containerized applications deployable on Google Kubernetes Engine (GKE). Rather than a full application rewrite, Migrate to Containers analyzes a running VM, extracts the application layer from the OS, and generates a Dockerfile, Kubernetes manifests, and a migration plan as artifacts that can be reviewed and customized before deployment. It supports both Linux and Windows workloads and is operated primarily through a CLI (`m2c`). The tool performs a fit assessment to identify which workloads are suitable for containerization and flags potential compatibility issues before migration begins. Migrate to Containers does not require persistent cloud infrastructure to run—it is a CLI-driven tool rather than a hosted service, keeping costs primarily tied to the target GKE cluster rather than the migration tooling itself. It integrates with Migration Center for end-to-end migration tracking and with Cloud Build and Artifact Registry for CI/CD pipelines post-migration.

### Use Cases
* Re-platforming legacy monolithic applications from on-premises VMs to GKE containers without a full rewrite (e.g., Java application servers running on VMware)
* Automating the generation of Dockerfiles and Kubernetes manifests from existing VM workloads to accelerate containerization
* Migrating Compute Engine VMs to GKE to reduce VM overhead and take advantage of container-native scaling
* Performing fit assessments to triage which on-premises workloads are container-ready versus requiring refactoring
* Containerizing Windows Server workloads for GKE Windows node pools
* Integrating with Migration Center to coordinate and track VM-to-container migrations alongside broader cloud migration programs
* Enabling incremental modernization where traffic can be served from the container while the original VM remains as a fallback
