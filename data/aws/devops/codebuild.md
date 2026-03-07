---
cloud_provider: "AWS"
service_category: "devops"
service_name: "CodeBuild"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS CodeBuild

### Description
AWS CodeBuild is a fully managed build service that compiles source code, runs tests, and produces deployment-ready artifacts without requiring you to provision or manage build servers. Builds execute in ephemeral, isolated compute environments that scale automatically — there is no build queue when multiple builds are triggered simultaneously. Build environments support standard Linux, ARM, Windows Server, and Lambda compute types, and you can use AWS-curated build images or supply your own Docker image. Build specifications are defined in a `buildspec.yml` file committed alongside source code, supporting multi-phase execution (install, pre-build, build, post-build) with environment variable injection and artifact caching in S3. CodeBuild integrates with CodePipeline as a build action and with GitHub, GitLab, Bitbucket, and CodeCommit as source providers, including pull request build triggers. Pricing is based on build minutes consumed per compute type, with 100 free minutes per month under the Free Tier.

### Use Cases
* Automated compile and unit testing (e.g., building a Java Spring Boot application and running JUnit tests on every commit)
* Docker image build and push (e.g., building a container image and pushing it to ECR as part of a CodePipeline stage)
* Security and dependency scanning (e.g., running SAST tools or `npm audit` as a build phase before allowing deployment)
* Multi-architecture builds (e.g., building ARM64 images on Graviton-backed CodeBuild environments for cost-efficient containers)
* Infrastructure validation (e.g., running `terraform plan` or `cdk synth` and failing the build on plan errors)
* Pull request gating (e.g., blocking a GitHub PR merge until a CodeBuild project reports a successful test run)
* Artifact packaging and S3 upload (e.g., packaging a Lambda deployment ZIP and uploading it to S3 for downstream CodeDeploy)
