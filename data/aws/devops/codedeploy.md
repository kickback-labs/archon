---
cloud_provider: "AWS"
service_category: "devops"
service_name: "CodeDeploy"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS CodeDeploy

### Description
AWS CodeDeploy is a fully managed deployment service that automates application deployments to EC2 instances, on-premises servers, Lambda functions, and Amazon ECS services. It supports three deployment strategies: in-place (rolling replacement on EC2/on-premises), blue/green (traffic shifting to a new environment), and canary/linear traffic shifting (gradual percentage-based routing for Lambda and ECS). Deployments are driven by an `appspec.yml` file that defines lifecycle event hooks for pre- and post-deployment scripts. CodeDeploy continuously monitors deployment health via CloudWatch alarms and can automatically roll back a deployment when error thresholds are breached. It integrates as a deployment action in CodePipeline and supports deployment to thousands of instances simultaneously. There is no additional charge for EC2 and on-premises deployments; Lambda and ECS deployments are also free.

### Use Cases
* Blue/green deployments to ECS (e.g., shifting traffic from a blue task set to a green task set via an Application Load Balancer with automatic rollback on alarm)
* Canary Lambda deployments (e.g., routing 10% of traffic to a new Lambda version and gradually shifting to 100% over 30 minutes)
* Rolling in-place deployments to EC2 fleets (e.g., updating an application on hundreds of instances in batches with health check validation between rounds)
* Automated rollback on errors (e.g., configuring a CloudWatch alarm threshold so that a 5% error rate triggers an immediate rollback)
* On-premises server deployment (e.g., using the CodeDeploy agent to deploy application updates to data center servers alongside EC2 instances)
* Lifecycle hook scripting (e.g., running database migration scripts in the AfterInstall hook before the new application version receives traffic)
* Integration with CodePipeline (e.g., using CodeDeploy as the final deploy action in a multi-stage pipeline after CodeBuild produces the artifact)
