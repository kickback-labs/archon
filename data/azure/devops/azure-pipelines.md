---
cloud_provider: "Azure"
service_category: "devops"
service_name: "Azure Pipelines"
pricing_model: "subscription"
managed: true
tier: 2
---
## Azure Pipelines

### Description
Azure Pipelines is the CI/CD service within Azure DevOps that automatically builds, tests, and deploys code to any target — cloud, on-premises, or PaaS — across every major language and platform (Node.js, Python, Java, .NET, Go, Android, iOS, and more). Pipelines are defined in YAML and committed alongside source code, enabling pipeline-as-code workflows with full version history. It supports both Microsoft-hosted agents (pre-provisioned Linux, Windows, macOS VMs) and self-hosted agents on custom machines or containers. Pipelines integrates natively with Azure Repos and GitHub for source control, and with Azure Artifacts for package management.

### Use Cases
* Running multi-stage CI pipelines that compile code, execute unit and integration tests, and publish build artifacts on every pull request or commit (e.g., .NET or Node.js web apps)
* Deploying containerised workloads to AKS, Azure Container Apps, or Azure App Service via environment-scoped release gates with manual approval steps
* Building cross-platform mobile apps (iOS on macOS agents, Android on Linux agents) and publishing them to stores in a single unified pipeline definition
* Running parallel test jobs across multiple OS matrices to shorten build times (e.g., pytest on Python 3.10/3.11 × Linux/Windows simultaneously)
* Integrating with Azure Artifacts to publish and consume NuGet, npm, Maven, or Python packages within the same organization's pipelines
* Triggering infrastructure-as-code deployments (Bicep/Terraform) in sequence after application artifact validation passes in a deployment environment
