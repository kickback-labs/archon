---
cloud_provider: "AWS"
service_category: "analytics"
service_name: "MSK"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Managed Streaming for Apache Kafka (MSK)

### Description
Amazon Managed Streaming for Apache Kafka (MSK) is a fully managed service that runs Apache Kafka infrastructure on AWS, handling provisioning, configuration, patching, and cluster health monitoring without requiring Kafka expertise from the operator. MSK supports both provisioned clusters (fixed broker capacity for predictable workloads) and MSK Serverless (automatic scaling with no capacity planning). It provides enterprise-grade security out of the box, including encryption in transit and at rest, IAM-based authentication, and VPC isolation. Kafka Connect connectors can be hosted on fully managed infrastructure, enabling no-code source and sink integrations with databases, S3, and other AWS services. MSK integrates natively with Amazon Data Firehose, AWS Lambda, Amazon OpenSearch Service, and Amazon EMR as downstream consumers. It supports Apache Kafka APIs natively, making lift-and-shift of self-managed Kafka workloads straightforward. Multi-AZ deployments and automated failure recovery provide high availability and durability.

### Use Cases
* Real-time event streaming platform (e.g., building a centralized data bus for microservices publishing and consuming domain events)
* Log and telemetry ingestion (e.g., streaming application logs from thousands of services into S3 or OpenSearch via Kafka Connect)
* Change data capture (CDC) pipelines (e.g., capturing database changes with Debezium connector and streaming to downstream data lakes)
* Event-driven application integration (e.g., decoupling services with a durable, replayable event log for order processing systems)
* Lift-and-shift of self-managed Kafka clusters to reduce operational overhead while retaining full Kafka API compatibility
* Real-time analytics feeds (e.g., consuming MSK topics with Amazon Managed Service for Apache Flink for sub-second stream processing)
