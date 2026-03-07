---
cloud_provider: "AWS"
service_category: "devops"
service_name: "CloudFormation"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS CloudFormation

### Description
AWS CloudFormation is the native infrastructure-as-code (IaC) service for AWS, allowing teams to model, provision, and manage AWS resources using JSON or YAML templates. Stacks and StackSets enable repeatable, versioned deployments across single or multiple accounts and regions from a single operation. The CloudFormation Registry extends the service to third-party and custom resources, making it the foundational IaC layer for automating AWS environments.

### Use Cases
* Repeatable environment provisioning (e.g., deploying identical staging and production stacks from the same template)
* Multi-account/multi-region rollouts (e.g., using StackSets to enforce a VPC baseline across all organization accounts)
* CI/CD infrastructure automation (e.g., triggering CloudFormation deployments from CodePipeline on every merge to main)
* Drift detection and compliance (e.g., identifying resources that have been manually modified outside the template)
* Blue/green infrastructure swaps (e.g., creating a new stack and updating a Route 53 record before deleting the old stack)
