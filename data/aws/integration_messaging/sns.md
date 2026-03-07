---
cloud_provider: "AWS"
service_category: "integration_messaging"
service_name: "SNS"
pricing_model: "per-request"
managed: true
tier: 1
---
## AWS Simple Notification Service (SNS)

### Description
Amazon Simple Notification Service (SNS) is a fully managed pub/sub messaging service supporting both application-to-application (A2A) and application-to-person (A2P) communication patterns. A single SNS topic can fan out to multiple subscribers simultaneously — including SQS queues, Lambda functions, HTTP/S endpoints, Kinesis Data Firehose, email, and mobile push notifications across over 240 countries via SMS. SNS FIFO topics provide strict ordering and exactly-once delivery for A2A scenarios. Message filtering allows subscribers to receive only relevant subsets of messages without additional logic. Encryption at rest (KMS) and in transit, plus AWS PrivateLink support, provide enterprise-grade security.

### Use Cases
* Fan-out events to multiple downstream SQS queues in parallel (e.g., an order event triggering billing, inventory, and fulfillment consumers simultaneously)
* Mobile push notifications to iOS, Android, and Fire OS devices
* SMS alerts and transactional messages to end users in 240+ countries
* Decoupling event producers from multiple heterogeneous consumers (e.g., Lambda + Firehose + HTTP webhook from a single topic)
* FIFO-ordered pub/sub for financial or inventory systems requiring duplicate-free, ordered delivery
