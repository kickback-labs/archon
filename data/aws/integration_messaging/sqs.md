---
cloud_provider: "AWS"
service_category: "integration_messaging"
service_name: "SQS"
pricing_model: "per-request"
managed: true
tier: 1
---
## AWS Simple Queue Service (SQS)

### Description
Amazon Simple Queue Service (SQS) is a fully managed message queuing service that enables decoupling and scaling of distributed systems, microservices, and serverless applications. It offers two queue types: Standard queues provide near-unlimited throughput with at-least-once delivery and best-effort ordering, while FIFO queues guarantee exactly-once processing and strict first-in-first-out delivery at up to 70,000 messages per second. Messages are retained for up to 14 days, payloads support up to 256 KB (with larger payloads offloaded to S3 via the Extended Client Library), and dead-letter queues (DLQs) capture messages that fail processing.

### Use Cases
* Decoupling microservices and distributed application components (e.g., separating order intake from payment processing)
* Work queue for autoscaling consumer pools (e.g., resizing uploaded images with multiple EC2 or Lambda workers)
* FIFO guaranteed ordering for financial or transactional workflows (e.g., ensuring price updates are applied in sequence)
* Fan-out pattern combined with SNS (e.S., broadcasting events to multiple independent SQS subscribers)
* Buffering bursty traffic to protect downstream services from overload
