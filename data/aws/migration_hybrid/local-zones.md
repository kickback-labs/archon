---
cloud_provider: "AWS"
service_category: "migration_hybrid"
service_name: "Local Zones"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Local Zones

### Description
AWS Local Zones are infrastructure deployments that place AWS compute, storage, database, and other select services in large metropolitan and population centers, physically closer to end users than the nearest AWS Region. Each Local Zone is an extension of its parent AWS Region and uses the same APIs, tools, and management controls, enabling consistent developer and operations experiences. Local Zones deliver single-digit millisecond latency to users in that metro area and support data residency requirements for geographically regulated workloads. Resources in a Local Zone are connected to the parent Region via Amazon's private high-bandwidth, low-latency network. AWS currently operates Local Zones across dozens of locations worldwide.

### Use Cases
* Ultra-low latency interactive applications (e.g., real-time multiplayer gaming, live streaming, or AR/VR experiences served to users in a specific metro area)
* Virtual workstations and VDI (e.g., creative workstations for media and entertainment studios needing sub-10ms rendering latency)
* Hybrid migration staging (e.g., migrating latency-sensitive on-premises application components to a nearby Local Zone while maintaining low-latency connectivity to remaining on-premises systems)
* Data residency compliance for metro-level regulations (e.g., financial or healthcare workloads required to stay within a specific state or municipality)
* ISV application acceleration (e.g., running SaaS applications closer to enterprise customers clustered in specific cities)
* Edge machine learning inference (e.g., deploying GPU-backed inference endpoints at a Local Zone to serve users with strict latency SLAs)
