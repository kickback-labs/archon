---
cloud_provider: "AWS"
service_category: "compute"
service_name: "Lambda"
pricing_model: "serverless"
managed: true
tier: 1
---
## AWS Lambda

### Description
AWS Lambda is a serverless, event-driven compute service that runs code in response to events without provisioning or managing servers. It automatically scales from a few requests per day to thousands per second, and billing is per millisecond of compute time consumed. Lambda supports multiple runtimes (Python, Node.js, Java, Go, .NET, Ruby, and custom runtimes) and integrates natively with over 200 AWS services as event sources or destinations.

### Use Cases
* Serverless web and mobile backends (e.g., REST APIs behind Amazon API Gateway)
* Real-time data processing (e.g., stream processing from Amazon Kinesis or SQS)
* Batch data processing (e.g., ETL transformations triggered on S3 object uploads)
* Generative AI orchestration (e.g., agent workflow handlers in distributed LLM architectures)
