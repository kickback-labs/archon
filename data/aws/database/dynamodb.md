---
cloud_provider: "AWS"
service_category: "database"
service_name: "DynamoDB"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS DynamoDB

### Description
Amazon DynamoDB is a fully managed, serverless, key-value and document NoSQL database that delivers single-digit millisecond performance at any scale. It handles more than 10 trillion requests per day and can support peaks of more than 20 million requests per second. DynamoDB provides built-in multi-Region, multi-active replication (Global Tables), automatic multi-AZ redundancy, and in-memory caching via DynamoDB Accelerator (DAX). It offers two capacity modes — provisioned (with auto-scaling) and on-demand — and includes integrated backup, point-in-time recovery, and encryption at rest.

### Use Cases
* High-traffic, low-latency applications at internet scale (e.g., gaming leaderboards, ad-tech bidding engines)
* Session state and user profile storage for web and mobile apps
* IoT telemetry ingestion requiring high write throughput with unpredictable traffic patterns
* Shopping cart, order management, and catalog data in e-commerce platforms
* Event sourcing and activity feeds requiring time-ordered, per-user record streams
