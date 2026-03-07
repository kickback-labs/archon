---
cloud_provider: "Azure"
service_category: "integration_messaging"
service_name: "Web PubSub"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Web PubSub

### Description
Azure Web PubSub is a fully managed, real-time messaging service that enables bidirectional communication between server and clients using the standard WebSocket protocol and publish-subscribe messaging patterns. It is designed for large-scale applications that require low-latency, high-frequency data push from server to clients without the overhead of HTTP polling. A single Web PubSub resource scales to 1 million concurrent WebSocket connections, and multiple resources can be combined to scale beyond that limit across multiple global regions for sharding, high availability, or disaster recovery. The service supports standard WebSocket, MQTT subprotocol, and REST APIs, making it accessible from any programming language without requiring a dedicated SDK. Server and client SDKs are available for C#, Java, JavaScript, and Python. Web PubSub integrates natively with Azure Functions for serverless real-time applications and is commonly used for AI token streaming, live dashboards, multiplayer games, collaborative tools, and IoT monitoring.

### Use Cases
* Streaming LLM/AI token output to browser clients in real time without polling (e.g., chatbot response rendering)
* Broadcasting live dashboard updates (e.g., financial market data, IoT sensor readings, sales leaderboards) to thousands of concurrent subscribers
* Powering multiplayer game state synchronization and online auction bid updates with sub-second latency
* Building cross-platform chat applications (e.g., live customer support, in-app messaging) using the pub/sub group messaging pattern
* Enabling multi-user collaborative editing by broadcasting document change events to all co-editors in a named group
* Real-time push notifications across web and mobile clients without maintaining persistent application server connections
* Serverless event-driven real-time apps using Azure Functions bindings to send messages on trigger without managing infrastructure
