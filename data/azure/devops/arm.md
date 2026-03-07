---
cloud_provider: "Azure"
service_category: "devops"
service_name: "Azure Resource Manager"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Resource Manager (ARM)

### Description
Azure Resource Manager (ARM) is the deployment and management layer for Azure that underpins every interaction with Azure resources via the portal, CLI, PowerShell, and SDKs. It provides a consistent management plane for creating, updating, and deleting resources within resource groups, subscriptions, management groups, and tenants using declarative templates (ARM JSON or Bicep). ARM natively integrates Azure RBAC for access control and supports resource tagging, locks, and dependency ordering during deployment.

### Use Cases
* Deploying entire application stacks (VMs, networking, databases) repeatably using ARM templates or Bicep files as infrastructure-as-code
* Organizing related resources into resource groups to manage them as a lifecycle unit and scope access control
* Applying resource locks at the resource group or subscription level to prevent accidental deletion or modification of critical resources
* Using management groups and subscription hierarchy to inherit RBAC policies and Azure Policy assignments across large enterprise environments
