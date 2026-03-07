---
cloud_provider: "Azure"
service_category: "integration_messaging"
service_name: "Event Grid"
pricing_model: "per-request"
managed: true
tier: 1
---
## Azure Event Grid

### Description
Azure Event Grid is a fully managed, highly scalable publish-subscribe event routing service that connects event sources to event handlers across Azure and custom applications. It supports two complementary protocols: HTTP for event-driven architectures where Azure services and custom applications publish state-change events to subscribers, and MQTT (v3.1.1 and v5.0) for IoT device-to-cloud and device-to-device messaging. HTTP delivery supports both push mode (Event Grid routes events to webhooks, Azure Functions, Event Hubs, and other destinations with a 24-hour retry policy with exponential backoff) and pull mode (consumers poll a namespace topic at their own pace, enabling private-link-based consumption). Event Grid natively integrates with over 20 Azure services as event sources and implements the CloudEvents 1.0 specification for cross-system interoperability.

### Use Cases
* Event-driven serverless architectures where blob creation, resource changes, or custom application events trigger downstream processing via Azure Functions or Logic Apps
* IoT device telemetry ingestion using the MQTT broker capability, routing device data to Event Hubs or Azure Data Explorer for analytics
* Decoupled microservice communication where services react to state-change events without polling each other
* Multi-subscriber fan-out routing of a single event from an Azure service (e.g., a new VM deployment) to multiple independent handlers
* Private, pull-based event consumption via private link for air-gapped or compliance-sensitive workloads
