---
cloud_provider: "Azure"
service_category: "integration_messaging"
service_name: "Service Bus"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Service Bus

### Description
Azure Service Bus is a fully managed enterprise message broker offering durable queues and publish-subscribe topics for reliable asynchronous communication between applications and services. It uses triple-redundant, zone-aware storage to guarantee message durability and supports exactly-once processing through transactions, dead-letter queues, and duplicate detection. Service Bus is protocol-agnostic—its primary wire protocol is AMQP 1.0 (an open ISO/IEC standard)—and it also supports JMS 2.0 (in the Premium tier) and HTTP/REST, making it compatible with existing Java, .NET, Python, JavaScript, and Go workloads. The Premium tier is fully isolated, offering predictable performance and support for VNet integration and private endpoints.

### Use Cases
* Decoupling microservices so producers and consumers operate independently without tight temporal coupling
* Load leveling to absorb traffic spikes and protect downstream services from being overwhelmed
* Ordered, session-based processing for workflows that require strict first-in-first-out (FIFO) message delivery per logical group
* Pub/sub fan-out using topics with filtered subscriptions to distribute domain events to multiple independent consumers
* Transactional messaging where multiple queue operations must succeed or fail atomically
