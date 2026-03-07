---
cloud_provider: "AWS"
service_category: "devops"
service_name: "CodeArtifact"
pricing_model: "on-demand"
managed: true
tier: 3
---
## AWS CodeArtifact

### Description
AWS CodeArtifact is a fully managed artifact repository service for storing, publishing, and sharing software packages within your organization. It supports major package formats including npm, PyPI, Maven, Gradle, NuGet, Swift, and generic packages. CodeArtifact can be configured as an upstream proxy to public repositories (npm Registry, Maven Central, PyPI, NuGet Gallery, Crates.io) so that build systems automatically fetch and cache packages on demand while the organization retains control over which packages are available. Domains provide a top-level namespace for organizing multiple repositories across accounts and sharing packages via cross-account access. Access is controlled by IAM policies, and all packages are encrypted at rest using AWS KMS. CodeArtifact integrates with AWS CodeBuild for pulling dependencies and publishing artifacts, with Amazon EventBridge for triggering approval workflows on package publish events, and with AWS CloudTrail for auditing package access and mutations. Pricing is based on storage (GB/month), number of requests, and data transferred out of AWS.

### Use Cases
* Private package hosting for internal libraries (e.g., publishing a shared Python utility library to a CodeArtifact PyPI repository and consuming it across multiple microservice projects)
* Upstream proxy and caching for public repositories (e.g., configuring CodeArtifact as a PyPI upstream so that Lambda build environments pull packages through CodeArtifact, ensuring air-gapped or VPC-restricted builds still succeed)
* Organization-wide package sharing (e.g., creating a domain with a central repository that all team repositories inherit from, enabling controlled distribution of approved internal packages across 20 AWS accounts)
* Automated package approval workflows (e.g., using EventBridge to trigger a Lambda function that scans newly published npm packages for known CVEs before marking them approved for consumption)
* Audit and compliance for package usage (e.g., using CloudTrail integration to log every package download and publish event for SOC 2 audit trails)
* Integration with CI/CD pipelines (e.g., configuring CodeBuild to authenticate to CodeArtifact via `aws codeartifact get-authorization-token` and pull Maven dependencies during the build phase)
* Multi-format support across polyglot teams (e.g., hosting npm packages for a frontend team, Maven artifacts for a Java backend, and NuGet packages for a .NET service all within a single CodeArtifact domain)
* Reducing dependency on internet connectivity (e.g., caching all upstream packages in CodeArtifact so that builds inside a VPC with no internet gateway still succeed)
