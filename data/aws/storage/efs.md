---
cloud_provider: "AWS"
service_category: "storage"
service_name: "EFS"
pricing_model: "serverless"
managed: true
tier: 1
---
## AWS Elastic File System (EFS)

### Description
Amazon Elastic File System (Amazon EFS) is a serverless, fully managed NFS file system that scales automatically to petabytes of storage without requiring provisioning or capacity planning. It provides concurrent access from thousands of EC2 instances, containers (ECS/EKS/Fargate), and Lambda functions across multiple Availability Zones using the NFSv4 protocol. EFS is designed for 99.999999999% (11 nines) durability and up to 99.99% availability. Costs can be reduced by up to 97% using automatic lifecycle management that moves infrequently accessed data to lower-cost EFS Infrequent Access and Archive storage classes.

### Use Cases
* Shared file storage for containerized and serverless applications requiring persistent, concurrent access (e.g., Fargate tasks reading/writing a common filesystem)
* DevOps and CI/CD workflows needing shared code repositories or build artifacts across multiple compute nodes
* Content management systems and web serving (e.g., WordPress or Drupal running on multiple EC2 instances behind a load balancer)
* Machine learning training and data science pipelines requiring shared, scalable dataset access across GPU clusters
