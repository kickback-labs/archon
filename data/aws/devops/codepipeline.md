---
cloud_provider: "AWS"
service_category: "devops"
service_name: "CodePipeline"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS CodePipeline

### Description
AWS CodePipeline is a fully managed continuous delivery service that models, visualizes, and automates the steps required to release software. Pipelines are defined declaratively in JSON and consist of ordered stages, each containing one or more actions such as source checkout, build, test, approval, and deploy. CodePipeline integrates natively with AWS developer tools (CodeCommit, CodeBuild, CodeDeploy), third-party systems (GitHub, GitLab, Jenkins, Bitbucket), and virtually any AWS deployment target (ECS, Lambda, Elastic Beanstalk, CloudFormation, EC2). Manual approval actions can gate promotions between environments, and EventBridge notifications provide real-time pipeline status. Pricing is per active pipeline per month, with the first active pipeline free under the Free Tier. CodePipeline V2 pipelines support additional trigger types, variables, and git-based filtering for more flexible automation.

### Use Cases
* End-to-end CI/CD for containerized applications (e.g., source from CodeCommit → build and push image with CodeBuild → deploy to ECS with CodeDeploy blue/green)
* Multi-environment promotion with manual gates (e.g., auto-deploy to staging on merge, then require human approval before production)
* Infrastructure as code delivery (e.g., running CloudFormation changeset creation and execution as pipeline stages)
* Lambda function deployment pipeline (e.g., building a deployment package with CodeBuild and deploying with a CloudFormation stack update)
* Third-party source integration (e.g., triggering a pipeline on a GitHub pull request merge using a CodeConnections connection)
* Cross-region deployments (e.g., using pipeline actions to deploy the same artifact to multiple AWS regions sequentially)
* Custom action integration (e.g., calling an external security scanning tool via a custom action before allowing deployment to proceed)
