---
cloud_provider: "GCP"
service_category: "integration_messaging"
service_name: "Apigee"
pricing_model: "subscription"
managed: true
tier: 1
---
## GCP Apigee API Management

### Description
Apigee is Google Cloud's fully managed, enterprise-grade API management platform for designing, securing, deploying, monitoring, and monetizing APIs at any scale. It acts as a policy-enforcing gateway between clients and backend services, applying traffic management, authentication, rate limiting, threat protection, and transformation through a configurable policy layer — with no code changes to backends required. Apigee supports REST, SOAP, GraphQL, and gRPC, and integrates with Cloud Armor and reCAPTCHA Enterprise for a combined web application and API protection (WAAP) posture. An integrated API hub provides a universal catalog for consolidating API specs regardless of where they are built or hosted.

### Use Cases
* Centralised API gateway for microservices (e.g., fronting internal Cloud Run and GKE services with a single API proxy that enforces OAuth 2.0, rate limiting, and request transformation)
* Legacy system modernisation (e.g., wrapping SOAP or legacy REST backends with Apigee proxies to expose them as clean, documented RESTful APIs to modern consumers)
* Developer portal and partner onboarding (e.g., publishing API products to an integrated developer portal and issuing API keys for third-party partner access)
* API security and threat protection (e.g., using Advanced API Security's ML-powered abuse detection to identify bot traffic and shadow/undocumented APIs attached to L7 load balancers)
* API monetisation (e.g., defining rate plans and billing models on API products so that consumers are charged based on call volume or subscription tier)
