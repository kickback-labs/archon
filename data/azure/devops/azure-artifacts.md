---
cloud_provider: "Azure"
service_category: "devops"
service_name: "Azure Artifacts"
pricing_model: "subscription"
managed: true
tier: 2
---
## Azure Artifacts

### Description
Azure Artifacts is the package management service within Azure DevOps, providing hosted artifact feeds that store, version, and share packages across teams and organizations. It supports NuGet (.NET), npm (JavaScript), Maven and Gradle (Java), Python (pip/twine), Cargo (Rust), and Universal Packages (arbitrary binaries). Each feed can include upstream sources that proxy and cache packages from public registries such as nuget.org, npmjs.com, Maven Central, and PyPI, so that builds always pull from a consistent, auditable source rather than directly from the internet. Feeds have configurable visibility (private, organization-wide, or public) and access is controlled via Azure DevOps permissions integrated with Microsoft Entra ID. Each organization receives 2 GiB of storage at no additional cost; additional storage can be purchased as needed. Azure Artifacts integrates tightly with Azure Pipelines so that build artifacts produced by CI jobs can be published to a feed and consumed downstream without manual intervention.

### Use Cases
* Publishing internal NuGet packages (e.g., shared .NET libraries) to a private organizational feed so that multiple teams can consume a consistent version without duplicating code
* Caching npm or PyPI packages from public registries through upstream sources to ensure reproducible builds and reduce exposure to public registry outages
* Distributing versioned Maven JARs and Gradle artifacts across Java microservice teams from a shared organizational feed
* Storing Cargo crates for Rust projects internally to manage private or patched dependencies not available on crates.io
* Publishing Universal Packages to store and version arbitrary build outputs (e.g., compiled binaries, Terraform modules, or Helm charts) and retrieve them in downstream pipelines
* Using Artifacts feeds as the single source of truth for all third-party dependencies to satisfy software supply chain compliance requirements (e.g., SBOM generation, vulnerability scanning)
* Integrating feed publishing and consumption steps directly into Azure Pipelines YAML definitions so that every build produces versioned, traceable packages
