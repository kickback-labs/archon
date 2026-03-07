---
cloud_provider: "Azure"
service_category: "compute"
service_name: "Container Instances"
pricing_model: "serverless"
managed: true
tier: 2
---
## Azure Container Instances (ACI)

### Description
Azure Container Instances (ACI) is a serverless container runtime that lets you run Docker containers directly in Azure without provisioning or managing virtual machines or orchestrators. Containers start in seconds with per-second billing (no upfront cost, no termination fees) and benefit from hypervisor isolation — each container group runs in its own dedicated kernel, providing VM-grade security boundaries without the overhead. ACI supports both Linux and Windows containers, persistent volume mounts via Azure Files, public and private network configurations, and multi-container groups for sidecar patterns. It is commonly used for burst compute via the AKS Virtual Kubelet, where ACI acts as an elastic overflow layer for Kubernetes pods during traffic spikes.

### Use Cases
* AKS elastic burst (e.g., provisioning overflow pods into ACI via Virtual Kubelet when the AKS cluster is at capacity)
* Short-lived batch and data processing jobs (e.g., running an ETL container that reads from Blob Storage and terminates on completion, billed per second)
* CI/CD task runners (e.g., spinning up isolated build or test containers on demand without persistent infrastructure)
* Event-driven container execution (e.g., triggering ACI containers via Logic Apps or Azure Functions in response to queue messages)
* Isolated sandbox workloads (e.g., running untrusted or multi-tenant code in hypervisor-isolated container groups)
* Dev/test environments (e.g., rapidly launching a containerized dependency such as a database or mock service for integration testing)
