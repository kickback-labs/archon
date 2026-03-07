---
cloud_provider: "AWS"
service_category: "analytics"
service_name: "Kinesis Data Streams"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS Kinesis Data Streams

### Description
Amazon Kinesis Data Streams is a massively scalable, durable, real-time data streaming service that can continuously capture gigabytes of data per second from hundreds of thousands of sources. Data is made available in milliseconds, enabling real-time analytics, dashboards, anomaly detection, and dynamic pricing. Two capacity modes are available: on-demand (automatic scaling, no capacity planning) and provisioned (fixed shards for predictable throughput). Records are retained for up to 365 days, and the service integrates natively with AWS Lambda, Amazon Managed Service for Apache Flink, Amazon Data Firehose, and EMR.

### Use Cases
* Real-time log and event data ingestion (e.g., clickstream, application logs, IoT telemetry delivered to dashboards in seconds)
* Event-driven application triggers (e.g., pairing with AWS Lambda to react to stream events at any scale)
* Real-time anomaly detection and dynamic pricing using ML models on live data streams
* Data pipeline fan-out to multiple consumers (e.g., simultaneously feeding a data lake and a real-time dashboard)
