---
cloud_provider: "AWS"
service_category: "devops"
service_name: "CodeCommit"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS CodeCommit

### Description
AWS CodeCommit is a fully managed, private Git repository hosting service that stores code, binaries, and any other assets in highly available, durable repositories backed by AWS. It eliminates the operational burden of running and scaling self-managed Git servers and integrates natively with IAM for fine-grained, repository-level access control without requiring separate user credentials. Repositories are encrypted at rest using AWS KMS and in transit via HTTPS or SSH. CodeCommit supports standard Git workflows including branching, pull requests, and code reviews, and emits events to SNS and EventBridge for CI/CD trigger automation. **Note:** As of July 2024, AWS has closed CodeCommit to new customers; existing customers can continue using the service.

### Use Cases
* Private Git hosting fully integrated with IAM (e.g., granting developers read-only access to specific repos via IAM policies without managing SSH keys separately)
* Triggering CI/CD pipelines on push (e.g., using a CodeCommit push event via EventBridge to start a CodePipeline execution automatically)
* Code review and pull request workflows (e.g., enforcing branch protection and requiring approval rules before merging to main)
* Co-locating source with AWS deployment targets (e.g., keeping IaC templates in CodeCommit alongside the workload they provision for low-latency access from CodeBuild)
* Storing binary artifacts alongside code (e.g., versioning large ML model configuration files in the same repository as training scripts)
* Cross-account repository access (e.g., sharing a CodeCommit repo with a build account using IAM cross-account roles)
