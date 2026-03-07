---
cloud_provider: "AWS"
service_category: "networking"
service_name: "API Gateway"
pricing_model: "per-request"
managed: true
tier: 1
---
## AWS API Gateway

### Description
Amazon API Gateway is a fully managed service for creating, publishing, maintaining, monitoring, and securing APIs at any scale. It supports three API types: REST APIs (full API management features), HTTP APIs (up to 71% cheaper, optimised for serverless and proxy use cases), and WebSocket APIs (persistent two-way connections for real-time applications). API Gateway handles traffic management, authorization, throttling, CORS, caching, API versioning, and canary deployments. It integrates natively with Lambda, EC2, ECS, and any HTTP backend. Authorization is handled via IAM, Amazon Cognito, or Lambda custom authorizers with OIDC/OAuth2 support. API Gateway offers developer portals (Portals) for centralised API documentation and governance. Pricing is based on API calls received with no minimum fees.

### Use Cases
* Exposing Lambda functions as RESTful or HTTP APIs (e.g., serverless backend for a mobile app)
* Building real-time bidirectional communication channels (e.g., chat applications using WebSocket APIs)
* Proxying backend services with authentication and throttling (e.g., protecting a legacy HTTP backend with IAM auth)
* Managing API lifecycle with versioning and canary deployments (e.g., gradually rolling out v2 to 10% of traffic)
* Providing a developer portal for internal or external API consumers
