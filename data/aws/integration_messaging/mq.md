---
cloud_provider: "AWS"
service_category: "integration_messaging"
service_name: "Amazon MQ"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Amazon MQ

### Description
Amazon MQ is a fully managed message broker service for Apache ActiveMQ and RabbitMQ that simplifies migration of existing applications using industry-standard messaging protocols without rewriting code. It supports AMQP, STOMP, MQTT, OpenWire, and WebSocket protocols for ActiveMQ, and AMQP 0-9-1 for RabbitMQ, enabling drop-in replacement of on-premises brokers. Amazon MQ handles hardware provisioning, broker setup, software patching, failure detection, and recovery automatically. For high availability, ActiveMQ offers active/standby brokers backed by Amazon EFS (multi-AZ), while RabbitMQ provides cluster deployments with multi-AZ EBS replication. RabbitMQ clusters on M7g instances deliver up to 85% higher throughput than M5. Security features include encryption at rest and in transit, VPC isolation, IAM access control, and optional LDAP authentication for ActiveMQ. Amazon MQ differs from SQS/SNS in that it supports full JMS semantics, topics, sessions, and transactions — making it the preferred choice for lift-and-shift of existing broker-dependent applications.

### Use Cases
* Lift-and-shift of on-premises ActiveMQ or RabbitMQ workloads to AWS without application code changes
* Enterprise messaging with JMS features: point-to-point queues, publish-subscribe topics, durable subscriptions, and XA transactions
* Protocol interoperability scenarios where AMQP, STOMP, MQTT, or OpenWire clients must communicate with the same broker
* Low-latency event messaging for IoT or operational technology (OT) systems using MQTT over Amazon MQ
* Multi-consumer work distribution with advanced routing (RabbitMQ exchanges: direct, topic, fanout, headers)
* Integration with AWS Lambda for event-driven processing by polling the broker as an event source
