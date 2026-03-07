---
cloud_provider: "Azure"
service_category: "devops"
service_name: "Microsoft Dev Box"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Microsoft Dev Box

### Description
Microsoft Dev Box provides developers with self-service access to ready-to-code cloud workstations (called *dev boxes*) that are preconfigured with project-specific tools, source code, and binaries, so developers can begin work immediately without local environment setup. Dev boxes are Azure virtual machines running Windows with Premium SSD storage; compute and storage SKUs are chosen per pool, giving team leads control over performance tiers. Configuration is managed through three roles: platform engineers set organizational policies, network configurations, and security controls; project admins create dev box pools using YAML-based image definitions, custom images from Azure Compute Gallery, or Marketplace images (including Visual Studio pre-installed); and developers self-serve dev boxes from the developer portal or Windows App. Dev boxes enroll automatically in Microsoft Intune for device management, and access is gated through Microsoft Entra ID with support for conditional access and MFA. Autostop schedules and hibernation settings help control idle compute costs. Note: As of November 2025, Microsoft Dev Box is no longer accepting net-new direct customers; its capabilities are being integrated into Windows 365, and new tenants require allowlisting through Azure Support.

### Use Cases
* Providing project-specific, ready-to-code workstations to distributed development teams so that onboarding to a new project takes minutes rather than days (e.g., a dev box pool for a .NET microservices project with Visual Studio, Docker, and the repo pre-cloned)
* Isolating separate workloads or projects into distinct dev boxes on the same account, allowing developers to switch contexts without environment conflicts (e.g., one dev box for a legacy Java service and another for a Python ML service)
* Enabling contractors and short-term contributors to access a fully configured development environment from any device without installing company tooling locally
* Enforcing consistent, governance-approved development environments via YAML-based image definitions that lock down approved tools, configurations, and security baselines
* Managing dev boxes like any other corporate device through Microsoft Intune — applying policies, deploying patches, and isolating compromised machines
* Reducing hardware procurement cycles for rapidly growing engineering teams by scaling cloud workstations on demand rather than shipping physical laptops
* Supporting globally distributed teams by creating dev box pools in Azure regions closest to each developer sub-team to minimize latency to internal services
