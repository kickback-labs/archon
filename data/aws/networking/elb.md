---
cloud_provider: "AWS"
service_category: "networking"
service_name: "Elastic Load Balancing"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS Elastic Load Balancing (ELB)

### Description
Elastic Load Balancing automatically distributes incoming application traffic across multiple targets — EC2 instances, containers, IP addresses, and Lambda functions — across one or more Availability Zones. ELB offers four types: Application Load Balancer (ALB) for HTTP/HTTPS at Layer 7, Network Load Balancer (NLB) for TCP/UDP/TLS at Layer 4, Gateway Load Balancer (GWLB) for deploying third-party virtual network appliances, and the legacy Classic Load Balancer. ALB supports advanced routing rules, host/path-based routing, WebSocket, gRPC, and native AWS WAF integration. NLB handles millions of requests per second with ultra-low latency and supports static and elastic IP addresses. All load balancers integrate with Auto Scaling, AWS Certificate Manager, and CloudWatch.

### Use Cases
* Distributing HTTP/HTTPS traffic to microservices or containers (e.g., routing by URL path or hostname with ALB)
* Exposing Kubernetes services externally via the AWS Load Balancer Controller (e.g., NLB for EKS node ports)
* High-throughput TCP/UDP applications requiring static IPs and extreme performance (e.g., gaming servers, financial services APIs)
* Inserting third-party security appliances (e.g., firewalls and IDS/IPS) into traffic flows with GWLB
* Enabling blue/green and canary deployments via weighted target groups
* Load balancing across AWS and on-premises resources in hybrid architectures using NLB
