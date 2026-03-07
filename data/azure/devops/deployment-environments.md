---
cloud_provider: "Azure"
service_category: "devops"
service_name: "Azure Deployment Environments"
pricing_model: "on-demand"
managed: true
tier: 3
---
## Azure Deployment Environments

### Description
Azure Deployment Environments empowers development teams to self-serve preconfigured, project-scoped cloud infrastructure environments defined by platform engineers using infrastructure-as-code templates called *environment definitions*. An environment is a collection of Azure resources (e.g., App Service, database, storage account) deployed from a template stored in a source control repository (GitHub, Azure Repos) and associated with a project in a Dev Center. Platform engineers control which environment definitions are available per project, which Azure subscriptions back each environment type (sandbox, staging, production), and what governance policies (RBAC, resource types, cost limits) apply. Developers self-serve environments from the Azure portal, Azure CLI, developer portal, or CI/CD pipelines via REST API without needing Azure subscription-level permissions. Environment types map to different subscription and permission scopes: sandbox environments give developers contributor access for free exploration; staging and production environments enforce tighter constraints. The service integrates with Microsoft Dev Box — sharing the Dev Center and project hierarchy — so that organizations managing cloud workstations and cloud environments do so through a unified control plane. Environment definitions support ARM templates, Bicep, Terraform (via extensibility providers), and Pulumi. Cost tracking per environment and automatic expiry (time-to-live on environments) help prevent resource sprawl.

### Use Cases
* Spinning up isolated, short-lived test environments per pull request (e.g., a full web app stack with App Service + Azure SQL) that are automatically deleted when the PR is closed, eliminating shared staging environment contention
* Providing sandbox environments for developers to investigate new Azure services or prototype infrastructure designs without needing direct subscription access, with costs tracked centrally per project
* Creating on-demand preproduction environments for QA teams that mirror production topology by using the same Bicep/Terraform templates that define the production deployment
* Enabling CI/CD pipelines to programmatically provision and tear down environments via the Deployment Environments REST API or Azure CLI, so that integration test runs get a fresh, isolated environment every time
* Running workshops, hackathons, or training sessions where each participant needs an identical, isolated Azure environment that is automatically deleted at the end of the event
* Enforcing enterprise governance by mapping environment types to specific Azure subscriptions with pre-approved policies, resource type constraints, and spending limits, while giving developers self-service access within those guardrails
* Supporting platform engineering teams that need to manage a catalog of reusable environment definitions (inner-source model) so that application teams can find and deploy approved infrastructure patterns without writing IaC from scratch
* Integrating with Azure DevOps or GitHub Actions pipelines to gate deployments on environment creation success and capture deployed resource references (e.g., connection strings) as pipeline outputs
