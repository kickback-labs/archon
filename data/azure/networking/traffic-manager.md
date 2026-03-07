---
cloud_provider: "Azure"
service_category: "networking"
service_name: "Traffic Manager"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Traffic Manager

### Description
Azure Traffic Manager is a DNS-based global traffic load balancer that distributes client requests across globally distributed endpoints (Azure services, external services, or nested Traffic Manager profiles) based on one of six configurable routing methods: performance, priority, geographic, weighted, subnet, and multi-value. It operates purely at the DNS layer—it does not proxy or intercept actual data-plane traffic—and uses health probes to automatically redirect users away from unhealthy endpoints. Traffic Manager enables multi-region active-active and active-passive architectures, supports geofencing for data sovereignty and content localization, and integrates with Traffic View to provide insights into user location and connection quality. Unlike Front Door or Application Gateway, Traffic Manager is protocol-agnostic and works with any internet-facing endpoint including on-premises and non-Azure hosts.

### Use Cases
* Multi-region active-active load balancing for global applications (e.g., routing users to the nearest healthy Azure region using performance routing to minimize latency)
* Disaster recovery and failover routing (e.g., using priority routing to fail over from a primary region to a secondary region automatically when health probes detect outages)
* Geographic traffic routing for data sovereignty compliance (e.g., routing EU users exclusively to European endpoints to comply with GDPR data residency requirements)
* Weighted canary or A/B deployments across regions (e.g., sending 10% of traffic to a new app version deployed in a separate region before full rollout)
* Hybrid cloud traffic distribution (e.g., distributing traffic between on-premises datacenter endpoints and Azure VMs across multiple regions)
* Burst-to-cloud and cloud migration scenarios (e.g., gradually shifting traffic from on-premises to Azure endpoints without client-side changes by updating DNS weights)
