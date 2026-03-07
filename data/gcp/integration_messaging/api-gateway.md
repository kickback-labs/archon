---
cloud_provider: "GCP"
service_category: "integration_messaging"
service_name: "API Gateway"
pricing_model: "per-request"
managed: true
tier: 2
---
## GCP API Gateway

### Description
API Gateway is a fully managed, distributed API management service that enables you to create, secure, deploy, and monitor REST APIs in front of Google Cloud backend services such as Cloud Run, Cloud Functions, and App Engine. APIs are defined using OpenAPI 2.0 (or OpenAPI 3.x) specifications, which are uploaded as API configs and deployed to a gateway endpoint; the gateway handles all traffic, authentication, TLS termination, and routing without requiring application code changes. API Gateway provides built-in authentication via API keys, Google service accounts, Firebase Auth, Auth0, Okta, and Google ID tokens, and it natively integrates with Google Cloud Armor and Cloud IAM for access control. Traffic management, latency tracking, error rate monitoring, and request logging flow automatically to Cloud Monitoring and Cloud Logging. It supports multi-region deployments behind Cloud Load Balancing for global reach and high availability, and can centralize API metadata in API hub for catalog visibility. API Gateway targets lightweight, serverless-oriented workloads; teams requiring advanced features such as developer portals, response caching, quota enforcement across consumers, and GraphQL support should evaluate Apigee instead.

### Use Cases
* Securing serverless backends (e.g., fronting a Cloud Functions or Cloud Run microservice with JWT authentication and API key enforcement)
* Unified API surface for heterogeneous backends (e.g., exposing multiple independently deployed Cloud Run services under a single consistent REST API)
* Mobile and web app backend APIs (e.g., providing authenticated, rate-limited endpoints for a mobile app consuming GCP services)
* gRPC transcoding (e.g., exposing a gRPC Cloud Run service as a REST/HTTP API for clients that don't support gRPC)
* Multi-region global API deployment (e.g., deploying the same API config across regions behind a global load balancer for low-latency access)
* Migrating Cloud Endpoints APIs (e.g., deploying existing Endpoints OpenAPI specs to API Gateway with minimal configuration changes)
* Centralized API catalog (e.g., connecting deployed APIs to API hub for discovery, documentation, and governance across teams)
* Development and staging environment management (e.g., deploying separate API configs per environment to different gateway instances from the same spec)
