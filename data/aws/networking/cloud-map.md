---
cloud_provider: "AWS"
service_category: "networking"
service_name: "Cloud Map"
pricing_model: "per-request"
managed: true
tier: 2
---
## AWS Cloud Map

### Description
AWS Cloud Map is a cloud resource discovery service that allows you to register and track the location of any application resources — containers, queues, databases, microservices, and custom endpoints — under custom names. Services register their resources with Cloud Map, which continuously performs health checks to ensure only healthy resource locations are returned. Clients query Cloud Map via DNS or the AWS SDK/API to discover current endpoint locations. Cloud Map is protocol-agnostic and supports IP-based, DNS-based (A and SRV records), and API-based discovery, making it suitable for both Kubernetes and non-Kubernetes workloads. It integrates natively with ECS Service Connect and is available across all AWS regions.

### Use Cases
* Enabling microservices to dynamically discover healthy instances of each other without hardcoded IPs or hostnames (e.g., ECS tasks discovering an internal backend service)
* Managing multi-environment service registries where service locations differ across dev, staging, and production
* Simplifying CI/CD deployments by abstracting endpoint location so application code does not need updating per environment
* Supporting automated health monitoring to ensure traffic is routed only to healthy resource endpoints
* Registering and discovering non-AWS resources (e.g., on-premises databases) under a common discovery namespace
