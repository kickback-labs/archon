---
cloud_provider: "AWS"
service_category: "devops"
service_name: "License Manager"
pricing_model: "on-demand"
managed: true
tier: 3
---
## AWS License Manager

### Description
AWS License Manager is a fully managed service that helps organizations track, manage, and control the use of software licenses across their AWS and on-premises environments. It supports license management for products licensed per vCPU, physical core, socket, number of instances, or user, including commercial software from vendors such as Microsoft, Oracle, IBM, and SAP. License rules can be created to enforce hard or soft limits on license consumption, automatically blocking new EC2 instance launches when a hard limit is reached. For Bring Your Own License (BYOL) deployments, License Manager manages Dedicated Host resource groups — allocating, releasing, and recovering hosts automatically so Windows Server and SQL Server licenses can be used on dedicated hardware without manual host tracking. It integrates with AWS Marketplace to automate the distribution and activation of software entitlements to end users across accounts. User-based subscriptions allow organizations to subscribe to and manage per-user licenses for Microsoft products (Office, Visual Studio, Remote Desktop Services) on EC2 instances. License Manager is available at no additional charge; you pay only for the underlying AWS resources used.

### Use Cases
* Tracking and enforcing license limits (e.g., creating a rule that caps SQL Server Standard edition deployments at 20 vCPUs and blocks new instance launches that would exceed the limit)
* Windows Server BYOL on Dedicated Hosts (e.g., using a host resource group to automatically allocate Dedicated Hosts for Windows Server instances, satisfying Microsoft's Dedicated Host BYOL requirement without manual host management)
* Oracle licensing on EC2 (e.g., associating Oracle Database licenses with specific EC2 instance families and tracking core-based consumption against the purchased entitlement count)
* Automated discovery of existing licenses (e.g., running License Manager discovery to identify all EC2 instances using Oracle or SQL Server AMIs across an AWS Organization for a license audit)
* AWS Marketplace entitlement distribution (e.g., activating software purchased from the AWS Marketplace for specific IAM users or accounts without requiring end users to navigate Marketplace directly)
* Microsoft user-based subscriptions on EC2 (e.g., subscribing to Microsoft Office through License Manager and assigning it to specific Active Directory users who RDP into EC2 instances, with AWS handling the license compliance tracking)
* Cross-account license visibility (e.g., aggregating license consumption data across all accounts in an AWS Organization into a central account for a consolidated license compliance report)
* License type switching (e.g., converting an existing EC2 instance from a license-included AMI to a BYOL configuration when an organization purchases its own SQL Server licenses)
