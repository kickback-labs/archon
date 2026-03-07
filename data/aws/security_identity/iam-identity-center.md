---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "IAM Identity Center"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS IAM Identity Center

### Description
AWS IAM Identity Center (formerly AWS Single Sign-On) is the recommended service for managing workforce access to AWS accounts and applications centrally. It provides a single place to connect an existing identity source — such as Microsoft Active Directory, Okta, Google Workspace, Microsoft Entra ID, or the built-in IAM Identity Center directory — and gives all integrated AWS applications a shared, consistent view of your users and groups. Users authenticate once and gain SSO access to multiple AWS accounts and supported AWS applications (e.g., Amazon SageMaker Studio, AWS Systems Manager, Amazon Q Developer) through a personalized web portal. IAM Identity Center works alongside existing IAM roles and policies without replacing them. It supports trusted identity propagation, allowing business intelligence tools to pass user identity context through to AWS Analytics services for fine-grained data access auditing. The service is free and runs at no additional charge beyond the underlying AWS services used. Multi-Region replication of the Identity Center instance is supported for increased resilience.

### Use Cases
* Providing workforce single sign-on access across all AWS accounts in an AWS Organization (e.g., developers signing in once via Okta to access dev, staging, and prod accounts)
* Centralizing access management for AWS applications so that adding or revoking a user in the identity source propagates consistently across all integrated services
* Enabling SSO to Amazon EC2 Windows instances using existing corporate credentials and MFA without sharing administrator credentials
* Propagating user identity context from BI tools (e.g., Amazon QuickSight) to AWS data services (e.g., Lake Formation, Redshift) for per-user data access auditing
* Replacing per-application identity source configurations with a single integration point for services like SageMaker Studio, IoT SiteWise, and Systems Manager Change Manager
* Managing access across a multi-account AWS environment with a centralized user portal that shows each user their assigned roles and accounts
