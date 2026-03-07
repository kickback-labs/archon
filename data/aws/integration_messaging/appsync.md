---
cloud_provider: "AWS"
service_category: "integration_messaging"
service_name: "AppSync"
pricing_model: "per-request"
managed: true
tier: 2
---
## AWS AppSync

### Description
AWS AppSync is a fully managed serverless service for building GraphQL and real-time pub/sub APIs. It provides two API types: GraphQL APIs enable clients to query and mutate data across multiple sources (DynamoDB, Aurora, Lambda, HTTP, OpenSearch) with a single request, using automatic schema introspection for DynamoDB and Aurora to create instant database APIs. Event APIs provide WebSocket-based pub/sub channels for real-time broadcasting of events (e.g., chat messages, live scores, inventory updates) to millions of connected clients. AppSync handles connection management, scaling, and message delivery automatically. Security is managed via multiple auth modes per API — API key, IAM, OIDC, Amazon Cognito, and Lambda — with optional AWS WAF integration and Private API support for VPC-isolated access. It integrates with CloudWatch and X-Ray for observability. A federated Merged API feature allows combining multiple source GraphQL APIs into a single unified supergraph.

### Use Cases
* Building a GraphQL API layer over DynamoDB, Aurora, and Lambda for mobile or web applications (e.g., data access with a flexible, client-driven query model)
* Real-time collaborative features using Event API WebSocket channels (e.g., live auction price updates or co-editing notifications)
* AI gateway for Amazon Bedrock — routing application requests to generative AI backends through a GraphQL interface
* Federated supergraph combining multiple team-owned GraphQL APIs into a single endpoint for developer experience
* Offline-capable mobile applications with automatic data synchronisation via AppSync's conflict resolution features
* Instant CRUD APIs auto-generated from DynamoDB or Aurora schema introspection with no manual resolver writing
