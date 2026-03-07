---
cloud_provider: "Azure"
service_category: "devops"
service_name: "Azure Policy"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Policy

### Description
Azure Policy is a governance service that enforces organizational standards and assesses compliance at scale across Azure subscriptions and management groups. It evaluates resources against business rules expressed as JSON policy definitions and takes configurable effects — such as Deny, Audit, Modify, or DeployIfNotExists — when resources are found non-compliant. Policy definitions can be grouped into initiatives (policy sets) to address compliance frameworks such as CIS, NIST, or PCI-DSS, and can be assigned to any scope in the ARM hierarchy, with child scopes inheriting assignments automatically.

### Use Cases
* Enforcing resource deployment to approved Azure regions to meet data-residency and compliance requirements
* Requiring consistent resource tagging (e.g., cost-center, owner) across all subscriptions by using Append or Modify effects
* Automatically auditing or denying resources that lack diagnostic settings, ensuring logs flow to a central Log Analytics workspace
* Using DeployIfNotExists policies to auto-remediate new non-compliant resources, such as deploying a monitoring agent on any newly provisioned VM
