---
cloud_provider: "AWS"
service_category: "networking"
service_name: "VPC Lattice"
pricing_model: "on-demand"
managed: true
tier: 3
---
## Amazon VPC Lattice

### Description
Amazon VPC Lattice is an application networking service that simplifies service-to-service connectivity, security, and observability across VPCs and AWS accounts. Services register with a VPC Lattice service network, and clients in any connected VPC or account can reach them without complex peering, custom routing, or load balancer per-service provisioning. VPC Lattice operates at Layer 7 and supports HTTP, HTTPS, gRPC, and TCP protocols. It provides built-in authentication (AWS SigV4 or OIDC) and authorization policies written in Cedar, enabling zero-trust service-to-service access control. Traffic management features include request-level routing, weighted targets for blue/green and canary deployments, and health checks. VPC Lattice also supports connecting to TCP resources such as RDS databases, IP addresses, and domain names across VPCs and accounts using Resource VPC Endpoints powered by PrivateLink. It integrates with compute types including EC2 instances, ECS tasks, Lambda functions, Kubernetes pods (via AWS Gateway API Controller), and ALBs.

### Use Cases
* Connecting services across hundreds of VPCs and accounts without exponential peering or NAT complexity (e.g., a central data platform accessed by hundreds of team VPCs)
* Enforcing zero-trust service-to-service authentication and authorisation at the network layer (e.g., requiring services to present valid SigV4 identity before receiving traffic)
* Advanced traffic management for service deployments across mixed compute environments (e.g., weighted routing between a Lambda function and an ECS task during a migration)
* Accessing RDS databases or other TCP resources across accounts securely without exposing them publicly
* Simplifying Kubernetes service mesh connectivity in EKS via the Gateway API Controller
* Gaining per-service observability metrics (request count, latency, errors) for all services in a service network without instrumenting each application
