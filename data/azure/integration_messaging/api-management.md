---
cloud_provider: "Azure"
service_category: "integration_messaging"
service_name: "API Management"
pricing_model: "subscription"
managed: true
tier: 1
---
## Azure API Management (APIM)

### Description
Azure API Management is a hybrid, multicloud API gateway and lifecycle management platform that sits between API consumers and backend services hosted on Azure, on-premises, or in other clouds. It provides a unified API gateway that enforces security policies (authentication, authorization, rate limiting, IP filtering), performs request/response transformation, caches responses, and emits telemetry to Azure Monitor and Application Insights. The platform includes a management plane for defining APIs (from OpenAPI, WSDL, GraphQL, gRPC, or Azure compute resources), packaging them into products, and controlling subscriptions, plus a customizable developer portal for API discovery and self-service onboarding. Tiers range from a serverless Consumption tier (per-execution billing) to Standard and Premium v2 tiers (VNet integration, availability zones, multi-region deployment) and a self-hosted gateway option for on-premises or edge API traffic. Workspaces enable a federated model where decentralized API teams manage their own APIs while a central platform team retains governance.

### Use Cases
* Centralizing and securing access to multiple backend microservices behind a single API surface with consistent authentication and rate limiting
* Modernizing legacy SOAP or REST backends by exposing them via versioned, documented APIs without modifying the backend code
* Monetizing or partner-enabling APIs by publishing them to the developer portal with tiered subscription plans and usage quotas
* AI gateway for Azure OpenAI and other LLM endpoints — enforcing token rate limits, load balancing across model deployments, and logging prompt/response telemetry
* Hybrid API management using the self-hosted gateway to route traffic to on-premises services while retaining central policy and observability from Azure
* B2B API integration, giving external partners a self-service onboarding flow and API key management through the developer portal
