---
cloud_provider: "GCP"
service_category: "devops"
service_name: "Cloud Build"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Cloud Build

### Description
Cloud Build is GCP's fully managed, serverless CI/CD build platform that executes builds on Google Cloud infrastructure without any server provisioning or management. Each build runs as a series of Docker container steps defined in a YAML or JSON build config file, and the environment is ephemeral — a fresh VM is provisioned per build and destroyed on completion, ensuring clean, reproducible builds. Cloud Build integrates with GitHub, GitLab, Bitbucket, and Cloud Source Repositories via build triggers to automate CI/CD pipelines on code pushes or pull requests. It produces SLSA level 3 build provenance for container images, integrates with Binary Authorization to gate deployments, and supports customer-managed encryption keys (CMEK). Private pools provide dedicated, VPC-connected build workers for access to private network resources.

### Use Cases
* Automated container image builds and pushes (e.g., triggering a build on GitHub pull request that runs tests, builds a Docker image, and pushes it to Artifact Registry)
* Multi-language application CI pipelines (e.g., running unit tests, static analysis, and packaging for Node.js, Java, Python, or Go applications using community builder images)
* GitOps-style continuous delivery (e.g., build triggers that update Kubernetes manifests in a config repo and trigger Cloud Deploy to roll out to GKE environments)
* Secure software supply chain (e.g., generating SLSA level 3 build provenance and using Binary Authorization to block deployments of images not built by Cloud Build)
* Infrastructure-as-code pipelines (e.g., running Terraform plan and apply steps in a Cloud Build pipeline to provision GCP resources on merge to main)
