---
cloud_provider: "AWS"
service_category: "database"
service_name: "DocumentDB"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS DocumentDB (with MongoDB Compatibility)

### Description
Amazon DocumentDB is a fully managed, MongoDB-compatible document database service designed for JSON data at scale. It emulates the MongoDB 3.6, 4.0, and 5.0 APIs, allowing applications built with MongoDB drivers and tools to work without code changes. DocumentDB uses a distributed, fault-tolerant storage system similar to Aurora, replicating data six ways across three Availability Zones and supporting up to 15 low-latency read replicas. Storage automatically scales in 10 GB increments up to 64 TB, and the service handles patching, backups, and point-in-time recovery automatically. DocumentDB integrates with AWS IAM, Amazon VPC, AWS KMS, and AWS CloudTrail for comprehensive governance.

### Use Cases
* MongoDB workload migration to AWS without rewriting application code (e.g., existing Node.js or Python apps using Mongoose)
* Content management systems and catalogs storing rich, nested JSON documents (e.g., product attribute trees)
* User profile and preference stores with flexible, evolving schema requirements
* Real-time applications needing low-latency document reads backed by up to 15 read replicas
* Operational data stores for IoT device metadata and event histories stored as JSON
* Applications requiring automated backups, Multi-AZ redundancy, and fully managed operations at document-database scale
