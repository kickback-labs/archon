---
cloud_provider: "AWS"
service_category: "analytics"
service_name: "OpenSearch Service"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Amazon OpenSearch Service

### Description
Amazon OpenSearch Service is a managed service for running and scaling OpenSearch clusters, providing real-time search, log analytics, and vector database capabilities without managing infrastructure. It is built on the open-source OpenSearch project (Apache 2.0 licensed, Linux Foundation member) and supports workloads up to 25 PB across up to 1,000 data nodes. OpenSearch Service supports hybrid search combining traditional keyword (BM25) and vector-based (k-NN) queries, making it well-suited for both classic full-text search and generative AI applications such as Retrieval-Augmented Generation (RAG). It integrates natively with Amazon Bedrock (including as the default vector database for Bedrock Knowledge Bases), SageMaker, DynamoDB, DocumentDB, S3, CloudWatch Logs, and Security Lake via zero-ETL connections. Security features include encryption at rest and in transit, fine-grained index-level access controls, document-level security, VPC isolation, and Multi-AZ high availability. It also offers a serverless sub-option (OpenSearch Serverless) that eliminates cluster management by automatically scaling resources.

### Use Cases
* Real-time log analytics and observability (e.g., centralize application and security logs, detect anomalies with built-in ML alerting)
* Full-text and personalized search over application data (e.g., e-commerce product catalog search, document retrieval)
* Vector database for generative AI applications (e.g., RAG pipelines with Amazon Bedrock storing and querying billions of vector embeddings)
* Security analytics (e.g., zero-ETL integration with Amazon Security Lake for threat detection across cloud logs)
* Operational monitoring (e.g., analyze traces, metrics, and logs in unified dashboards with direct queries to CloudWatch and S3)
* Multi-modal semantic search (e.g., text, image, and video embeddings with millisecond response times)
* Application search backed by DynamoDB or DocumentDB data (e.g., zero-ETL sync for advanced search on transactional data)
