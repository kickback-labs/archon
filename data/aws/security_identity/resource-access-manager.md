---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "Resource Access Manager"
pricing_model: "on-demand"
managed: true
tier: 3
---
## AWS Resource Access Manager (RAM)

### Description
AWS Resource Access Manager (RAM) is a service that enables you to securely share AWS resources across AWS accounts within your organization, organizational units (OUs), or with specific external accounts — without needing to create duplicate resources in each account. RAM eliminates the operational overhead and cost of provisioning the same resource multiple times; instead, a single resource is created once and shared to authorized consumers. Supported shareable resource types include Amazon VPC subnets, Transit Gateway attachments, AWS License Manager configurations, Amazon Route 53 Resolver rules, AWS Glue catalogs, AWS Network Firewall policies, EC2 Capacity Reservations, Amazon Aurora clusters, and many others. Resource sharing is governed by resource shares, which define the resource(s) to share, the principals (accounts, OUs, or the entire organization) to share with, and optional managed permissions that constrain what actions recipients can perform on shared resources. Within an AWS Organization, resource shares are accepted automatically; cross-account shares outside the organization require manual acceptance. RAM itself is free to use — you pay only for the underlying shared resources. RAM does not copy or move resources; it grants access to the original resource, meaning all accounts consuming the resource see the same data and configuration state. This is particularly important for shared VPC subnets, where multiple accounts deploy workloads into the same network without each managing their own subnet.

### Use Cases
* Share VPC subnets across accounts in a multi-account organization (e.g., a networking team creates a shared VPC with carefully configured subnets and route tables, then uses RAM to allow application teams in separate accounts to deploy EC2, ECS, or RDS resources into those subnets without managing their own VPC)
* Centrally manage Transit Gateway attachments (e.g., share a Transit Gateway from a network hub account to spoke accounts so all accounts can route traffic through a single Transit Gateway without each account owning one)
* Share private certificate authorities across accounts (e.g., share an ACM Private CA from a security account to application accounts so they can issue TLS certificates without each account running its own CA, reducing cost and centralizing PKI governance)
* Share EC2 Capacity Reservations to guarantee compute availability across teams (e.g., share a Capacity Reservation for GPU instances from a central capacity account to ML team accounts that need guaranteed access to GPU capacity during peak training periods)
* Distribute Route 53 Resolver rules for consistent DNS resolution (e.g., share DNS forwarding rules from a central DNS account to all organizational accounts so every account resolves internal domain names via a consistent set of DNS servers)
* Share AWS Glue Data Catalog databases and tables (e.g., allow a data platform team to share a curated Glue catalog with analytics accounts so data consumers can query data lake tables without duplicating metadata)
* Enforce least-privilege on shared resources using managed permissions (e.g., share a VPC subnet with application accounts but restrict them to read-only describe permissions on the subnet, preventing them from modifying route tables or network ACLs)
* Reduce costs by eliminating resource duplication (e.g., share a single NAT Gateway or Network Firewall policy from a central network account to multiple workload accounts, avoiding the fixed per-hour cost of running one per account)
