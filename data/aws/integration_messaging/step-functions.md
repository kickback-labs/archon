---
cloud_provider: "AWS"
service_category: "integration_messaging"
service_name: "Step Functions"
pricing_model: "per-request"
managed: true
tier: 1
---
## AWS Step Functions

### Description
AWS Step Functions is a serverless visual workflow orchestration service that coordinates distributed applications and microservices using state machines. Workflows are defined as JSON-based Amazon States Language (ASL) state machines and can integrate with over 220 AWS services directly via optimised integrations — eliminating custom glue code. Two workflow types are available: Standard workflows (at-least-once, auditable, up to one year duration) for long-running processes, and Express workflows (at-least-once or exactly-once, up to 5 minutes, very high throughput) for high-volume event processing. Built-in error handling, retry logic, parallel branching, and human approval steps make it suitable for both technical orchestration and business process automation.

### Use Cases
* Orchestrating multi-step ETL or data processing pipelines (e.g., sequencing Glue jobs, Lambda transforms, and Redshift loads)
* Microservice coordination with error handling and retries (e.g., managing saga patterns for distributed order processing)
* Automated security and IT incident response workflows with manual approval gates
* Large-scale parallel workload processing using Map state (e.g., processing millions of S3 objects concurrently)
* Agentic AI workflow orchestration combining Lambda, Bedrock, and human-in-the-loop steps
