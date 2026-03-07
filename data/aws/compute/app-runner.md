---
cloud_provider: "AWS"
service_category: "compute"
service_name: "App Runner"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS App Runner

### Description
AWS App Runner is a fully managed service that builds, deploys, and scales containerized web applications and APIs automatically, requiring no infrastructure experience. Developers point App Runner at a container image (Amazon ECR) or a source code repository, and the service handles everything from building the image to provisioning compute, load balancing with HTTPS, and auto-scaling based on traffic. App Runner integrates with Amazon VPC, enabling applications to connect privately to databases, caches, and other resources within a VPC. It is well-suited for teams that need the operational simplicity of PaaS with the flexibility of containers.

### Use Cases
* Rapid deployment of containerized web APIs and REST services without configuring infrastructure
* Frontend and backend web application hosting with automatic HTTPS and built-in scaling
* Microservices that need quick deployment cycles and per-service independent scaling
* Connecting web services securely to Amazon RDS, ElastiCache, or SQS within a private VPC
* Prototyping and proof-of-concept deployments where container management overhead is undesirable
