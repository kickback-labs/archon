---
cloud_provider: "GCP"
service_category: "devops"
service_name: "Infrastructure Manager"
pricing_model: "on-demand"
managed: true
tier: 2
---
## GCP Infrastructure Manager

### Description
Infrastructure Manager (Infra Manager) is GCP's fully managed Infrastructure-as-Code service that automates the deployment and management of Google Cloud resources using Terraform. It acts as a managed Terraform execution environment: you supply a Terraform configuration (stored in a Cloud Storage bucket or a Git repository), and Infra Manager handles plan, apply, and destroy operations within an ephemeral Cloud Build runtime, storing state files, revision history, and audit logs automatically. This eliminates the need to self-host Terraform state backends, manage Terraform binary versions, or maintain separate CI/CD tooling for infrastructure provisioning. Infra Manager integrates with Cloud Audit Logs for governance, IAM for access control, and supports preview (plan) operations before applying changes. It supports Git-based automation so that pushes to a repository branch can trigger infrastructure deployments.

### Use Cases
* Managed Terraform execution without self-hosted backends (e.g., running `gcloud infra-manager deployments apply` to provision a VPC, subnets, and firewall rules from a Terraform module stored in Cloud Storage, with Infra Manager handling state locking and storage)
* GitOps-driven infrastructure automation (e.g., configuring Infra Manager to watch a Git repository branch so that merges to `main` automatically trigger a deployment revision)
* Infrastructure drift detection and preview (e.g., using Infra Manager's preview feature to run `terraform plan` and review the proposed diff before approving an update to a production environment)
* Multi-environment infrastructure lifecycle management (e.g., creating separate Infra Manager deployments for dev, staging, and prod that each reference the same Terraform module but different variable files)
* Audit and compliance for infrastructure changes (e.g., reviewing Cloud Audit Logs to see every Terraform apply operation, which service account performed it, and which resources were created or modified)
* Importing existing resources into managed deployments (e.g., using the import feature to bring manually created GCP resources under Terraform/Infra Manager management without recreating them)
* Enforcing IaC governance (e.g., using IAM policies to restrict `infra-manager.deployments.apply` to a dedicated CI service account, preventing ad-hoc manual resource creation)
