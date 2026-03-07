---
cloud_provider: "AWS"
service_category: "compute"
service_name: "EC2 Image Builder"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS EC2 Image Builder

### Description
EC2 Image Builder is a fully managed service that simplifies the creation, maintenance, testing, distribution, and lifecycle management of Amazon Machine Images (AMIs) and container images. It automates the image pipeline — from base OS selection and software installation to security hardening, validation testing, and multi-region distribution — eliminating the need for custom automation scripts or manual EC2 snapshot workflows. Image Builder applies AWS-provided and custom security policies (e.g., full disk encryption, firewall rules, strong password enforcement) and supports AWS-provided and custom tests for compliance validation before production use. The service itself is free; customers pay only for the underlying EC2 instances and storage used during image builds. It integrates with AWS Organizations, AWS Resource Access Manager (RAM), and Amazon ECR for cross-account image sharing.

### Use Cases
* Building and maintaining golden AMIs with security patches applied automatically on a schedule
* Enforcing organizational security baselines (e.g., CIS benchmarks, STIG hardening) across all EC2 images
* Creating container base images for ECS and EKS workloads with approved software components
* Distributing standardized images across multiple AWS accounts and regions via AWS Organizations
* Reducing image sprawl and manual toil in large EC2 fleets requiring frequent OS and software updates
* Integrating third-party security agents and monitoring tools from AWS Marketplace into golden images
