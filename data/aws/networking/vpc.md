---
cloud_provider: "AWS"
service_category: "networking"
service_name: "VPC"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS Virtual Private Cloud (VPC)

### Description
Amazon VPC gives you full control over a logically isolated virtual network in the AWS cloud, including IP address range selection, subnet creation, route table configuration, and network gateway attachment. Every AWS account has a default VPC per region, and resources such as EC2 instances, RDS databases, and Lambda functions all run inside VPCs. Security Groups and Network ACLs provide stateful and stateless traffic filtering respectively, and VPC Flow Logs enable network traffic visibility.

### Use Cases
* Isolating workloads by environment (e.g., separate VPCs for dev, staging, and production)
* Hosting multi-tier web applications (e.g., public subnet for load balancers, private subnet for app servers and databases)
* Connecting to on-premises data centers over Direct Connect or Site-to-Site VPN
* Providing private connectivity to AWS services via VPC endpoints (e.g., S3 access without traversing the internet)
