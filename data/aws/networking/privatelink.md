---
cloud_provider: "AWS"
service_category: "networking"
service_name: "PrivateLink"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS PrivateLink

### Description
AWS PrivateLink provides private, one-way connectivity between VPCs, AWS services, and on-premises networks using private IP addresses, without requiring internet gateways, NAT devices, VPC peering, or public IPs. It is the underlying technology powering Interface VPC Endpoints (for AWS services and AWS Marketplace SaaS products), Resource VPC Endpoints (for RDS databases, IP addresses, and domain names across accounts), and Service Network VPC Endpoints (for VPC Lattice service networks). Gateway Load Balancer endpoints are powered by PrivateLink for traffic insertion to third-party appliances. PrivateLink supports overlapping CIDR blocks between connected VPCs, making it suitable for multi-account and multi-tenant architectures without the routing complexity of VPC peering. Traffic traverses only the AWS network and never touches the public internet, supporting HIPAA, PCI-DSS, and other compliance requirements.

### Use Cases
* Privately accessing AWS services (e.g., S3, DynamoDB, SQS) from a VPC without traversing the internet via Interface VPC Endpoints
* Exposing a SaaS service hosted on AWS to customers without peering their VPCs or exposing it publicly (e.g., a data provider selling access via AWS Marketplace)
* Connecting to RDS databases or other VPC resources across accounts without VPC peering (e.g., centralised data platform accessed by multiple teams)
* Inserting security appliances into traffic flows using Gateway Load Balancer endpoints
* Meeting compliance requirements mandating that sensitive data never cross the internet (e.g., HIPAA-regulated health record access)
