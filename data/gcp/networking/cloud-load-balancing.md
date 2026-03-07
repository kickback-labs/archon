---
cloud_provider: "GCP"
service_category: "networking"
service_name: "Cloud Load Balancing"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Cloud Load Balancing

### Description
Cloud Load Balancing is a fully managed, software-defined load balancing service that distributes traffic across backends (VMs, containers, serverless endpoints, or external endpoints) with no pre-warming required. It operates at Google's network edge using a single global anycast IP address, routing each user request to the nearest healthy backend. Cloud Load Balancing offers multiple load balancer types: global external Application Load Balancer (HTTP/HTTPS with content-based routing), regional internal Application Load Balancer, regional and global Network Load Balancers (TCP/UDP at Layer 4), and internal passthrough. It integrates natively with Cloud Armor for DDoS and WAF protection, Cloud CDN for caching, and GKE via native LoadBalancer Services.

### Use Cases
* Global HTTP/HTTPS application delivery with a single anycast IP and content-based routing (e.g., path-based routing to different microservices)
* Zero pre-warming traffic absorption for viral or unpredictable workload spikes (e.g., flash sale traffic surges)
* SSL/TLS termination and centralized certificate management for HTTPS backends
* Internal load balancing for east-west microservice traffic within a VPC (e.g., routing between service tiers without a public IP)
* AI/ML inference routing with model-aware load balancing to GPU/TPU backends in GKE
* Hybrid and multicloud load balancing using hybrid network endpoint groups (NEGs) to route to on-premises or other cloud backends
* Integrated DDoS and WAF protection at the edge via Cloud Armor security policies
