---
cloud_provider: "AWS"
service_category: "devops"
service_name: "Service Catalog"
pricing_model: "on-demand"
managed: true
tier: 3
---
## AWS Service Catalog

### Description
AWS Service Catalog enables organizations to create, organize, and govern a curated catalog of approved AWS infrastructure-as-code (IaC) templates that end users can self-service provision without needing direct access to underlying AWS services. Administrators define products — CloudFormation templates, Terraform configurations, or AWS CDK apps — and organize them into portfolios that are shared with specific IAM principals or entire AWS Organizations OUs. End users see only the products they are permitted to deploy, and provisioning is constrained by the administrator-defined template and any additional launch constraints (e.g., a specific IAM role, a tag policy, or a notification ARN). Service Catalog AppRegistry allows teams to maintain a metadata registry of application definitions, associating AWS resources and CloudFormation stacks with logical application identifiers for cost tracking and operational insight. The service integrates with ServiceNow and Jira Service Management via AWS Connector, enabling end users to request cloud resources through their existing ITSM workflows. Pricing is based on the number of API calls (first 1,000 per month are free under the Free Tier).

### Use Cases
* Self-service provisioning of approved resources (e.g., allowing developers to launch pre-approved VPC + EC2 + RDS stacks from a catalog without needing IAM permissions for the underlying services)
* Governance and compliance at scale (e.g., enforcing that all provisioned EC2 instances use an approved AMI list and mandatory cost-center tags via Service Catalog constraints)
* Account vending and baseline provisioning (e.g., using a Service Catalog product to deploy baseline networking, security groups, and IAM roles whenever a new AWS account is created via Control Tower Account Factory)
* CI/CD pipeline standardization (e.g., publishing a "Standard CI/CD Pipeline" product backed by a CloudFormation template so all teams provision compliant CodePipeline + CodeBuild setups from a single source of truth)
* Multi-account resource sharing (e.g., sharing a portfolio containing approved database products from a central governance account to all production accounts in an AWS Organization)
* ITSM integration (e.g., allowing ServiceNow users to request a new SageMaker notebook environment through a ServiceNow catalog item backed by AWS Service Catalog)
* Application metadata registry (e.g., using AppRegistry to tag all CloudFormation stacks and S3 buckets belonging to a "payments" application, enabling Cost Explorer filtering by application)
* Terraform and CDK support (e.g., publishing Terraform configurations or CDK apps as Service Catalog products so non-CloudFormation teams can still benefit from governed self-service provisioning)
