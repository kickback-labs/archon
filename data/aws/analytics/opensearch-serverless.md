---
cloud_provider: "AWS"
service_category: "analytics"
service_name: "OpenSearch Serverless"
pricing_model: "serverless"
managed: true
tier: 2
---
## Amazon OpenSearch Serverless

### Description
Amazon OpenSearch Serverless is the serverless deployment option within Amazon OpenSearch Service, allowing developers to run search and log analytics workloads without provisioning, configuring, or tuning clusters. It automatically scales compute and storage resources up and down based on demand, providing millisecond response times even during unpredictable traffic spikes, and charges only for the OCUs (OpenSearch Compute Units) actually consumed. Data is stored with the same durability guarantees as Amazon S3. OpenSearch Serverless is organized around collections — logical groupings of indexes that support a given workload — and supports the same OpenSearch ingestion and query APIs as the managed service, enabling drop-in compatibility with existing clients and pipelines (Kinesis Data Firehose, Kafka, Logstash, Fluent Bit). It is the default vector database for Amazon Bedrock Knowledge Bases and is well-suited for generative AI RAG applications requiring scalable vector search. Security is enforced by default with encryption at rest (service-managed or customer-managed KMS keys), IAM and SAML 2.0 access control, and VPC support.

### Use Cases
* Variable or unpredictable search workloads (e.g., event-driven traffic spikes without pre-provisioning large clusters)
* Development and test environments for search and log analytics (e.g., quickly spin up isolated collections without cluster management)
* Vector database for RAG pipelines (e.g., store and query embeddings for Amazon Bedrock Knowledge Bases)
* Log analytics for applications with intermittent ingestion (e.g., batch ingestion from Kinesis Data Firehose)
* Startup or cost-sensitive workloads that need elastic search without operational overhead
* Multi-modal search applications needing co-located vector and keyword search with auto-scaling
