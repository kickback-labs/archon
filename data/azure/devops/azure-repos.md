---
cloud_provider: "Azure"
service_category: "devops"
service_name: "Azure Repos"
pricing_model: "subscription"
managed: true
tier: 2
---
## Azure Repos

### Description
Azure Repos is the version control component of Azure DevOps, providing cloud-hosted Git repositories and the legacy Team Foundation Version Control (TFVC) system for managing source code. Git repositories in Azure Repos are standard Git, meaning developers can use any compatible client — Visual Studio, VS Code, IntelliJ, Xcode, or the command line — without vendor lock-in. Branch policies enforce code review requirements, build validation, status checks from external services, and merge strategies (squash, rebase, merge commit) before changes reach protected branches. Pull requests support inline comments, threaded discussions, and diff views, with the ability to link work items and require a minimum number of approvals. Forks allow contributors to isolate experimental or sensitive changes in a full copy of the repository before proposing a pull request back to the upstream. Azure Repos integrates natively with Azure Pipelines for CI triggers and with Azure Boards for end-to-end traceability from commit to work item to deployment.

### Use Cases
* Hosting private Git repositories for enterprise teams with fine-grained branch permissions and organization-level access controls via Microsoft Entra ID
* Enforcing code quality gates on protected branches (e.g., requiring a passing CI build and two reviewer approvals before merging to `main`)
* Managing open-source or cross-team contributions via repository forks with controlled pull request workflows back to the upstream
* Linking commits and pull requests to Azure Boards work items for full traceability from requirement to deployed feature
* Using TFVC for teams migrating legacy TFS projects that rely on centralized, path-based version control and workspace mappings
* Triggering Azure Pipelines CI builds automatically on push or pull request events, with status posted back to the pull request
* Applying pull request status policies from external systems (e.g., a security scanner or custom validation service) to block merges until checks pass
