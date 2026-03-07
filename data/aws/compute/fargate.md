---
cloud_provider: "AWS"
service_category: "compute"
service_name: "Fargate"
pricing_model: "serverless"
managed: true
tier: 1
---
## AWS Fargate

### Description
AWS Fargate is a serverless, pay-as-you-go compute engine for containers that eliminates the need to provision or manage EC2 instances. It works natively with both Amazon ECS and Amazon EKS, running each task or pod in its own isolated runtime environment for enhanced security. Resource allocation is defined per task, scaling to up to 16 vCPU and 120 GB memory, and cost optimization is available through Savings Plans, Fargate Spot, and AWS Graviton-based instances.

### Use Cases
* Containerized microservices and APIs (e.g., independent service deployment without server management)
* Event-driven data processing pipelines (e.g., image or video processing triggered by S3 uploads)
* AI/ML model training and inference in containers (e.g., portable ML environments on ECS)
* Application modernization from VMs to containers (e.g., migrating Windows workloads via ECS Windows containers)
