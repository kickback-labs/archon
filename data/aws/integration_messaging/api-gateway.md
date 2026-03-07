---
cloud_provider: "AWS"
service_category: "integration_messaging"
service_name: "API Gateway"
pricing_model: "per-request"
managed: true
tier: 1
---
## AWS API Gateway

### Description
Amazon API Gateway is a fully managed service for creating, publishing, securing, and monitoring APIs at any scale. It supports REST APIs (full lifecycle management), HTTP APIs (low-latency, cost-optimised proxy), and WebSocket APIs (persistent bidirectional connections for real-time apps). In the integration context, API Gateway acts as the managed front door for backend services — routing requests to Lambda, ECS, EC2, Step Functions, or any HTTP endpoint — with built-in throttling, authorisation (IAM, Cognito, Lambda authorisers), caching, and request/response transformation. It enables loose coupling between API consumers and backend implementations.

### Use Cases
* Exposing Lambda functions or microservices as RESTful or HTTP APIs (e.g., serverless backend for a mobile or web application)
* Real-time bidirectional APIs using WebSocket connections (e.g., live chat, collaborative editing, live score feeds)
* Direct integration with AWS services (e.g., invoking Step Functions or writing to SQS without a Lambda intermediary)
* API lifecycle management with versioning, canary deployments, and usage plans (e.g., rate-limiting external API consumers by API key)
* Decoupling frontend consumers from backend service implementations to enable independent evolution
