---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "IAM"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS Identity and Access Management (IAM)

### Description
AWS Identity and Access Management (IAM) enables you to securely manage identities and control access to AWS services and resources. IAM lets you create and manage users, groups, and roles, and define fine-grained permissions using policies attached to those identities. It supports attribute-based access control (ABAC), temporary security credentials via IAM roles, and least-privilege enforcement through access analysis tools. IAM is free to use and is foundational to every AWS architecture.

### Use Cases
* Granting applications running on EC2 or Lambda access to other AWS services (e.g., an EC2 instance role that allows reading from an S3 bucket)
* Enforcing least-privilege access for human users via IAM roles and permission boundaries
* Establishing cross-account access patterns (e.g., a central security account assuming roles in member accounts)
* Using service control policies (SCPs) via AWS Organizations to apply guardrails across all accounts
* Auditing and right-sizing permissions using IAM Access Analyzer and AWS CloudTrail
