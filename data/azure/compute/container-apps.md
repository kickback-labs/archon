---
cloud_provider: "Azure"
service_category: "compute"
service_name: "Container Apps"
pricing_model: "serverless"
managed: true
tier: 1
---
## Azure Container Apps

### Description
Azure Container Apps is a fully managed serverless container platform built on top of Kubernetes and open-source technologies (Dapr, KEDA, Envoy) that abstracts away all infrastructure management. It allows teams to deploy containerized applications and microservices without requiring Kubernetes expertise, with built-in support for scale-to-zero, HTTP and event-driven autoscaling, VNet integration, and managed identities. Azure Container Apps also supports serverless GPUs for AI model inferencing, dynamic sessions for sandboxed LLM-generated code execution, and hosting Azure Functions workloads in container-based environments, backed by a 99.95% SLA.

### Use Cases
* Microservices and API backends (e.g., deploying event-driven microservices with Dapr service invocation and pub/sub)
* AI-powered applications and agents (e.g., running custom LLM inference workloads on serverless GPUs with scale-to-zero billing)
* Background and batch processing (e.g., KEDA-triggered workers that scale from zero based on queue depth)
* Web application hosting (e.g., containerizing a web app without managing orchestration or infrastructure)
* LLM code execution sandboxes (e.g., securely running AI-generated code in isolated dynamic sessions)
