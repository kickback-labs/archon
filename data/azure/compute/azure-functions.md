---
cloud_provider: "Azure"
service_category: "compute"
service_name: "Azure Functions"
pricing_model: "serverless"
managed: true
tier: 1
---
## Azure Functions

### Description
Azure Functions is a serverless, event-driven compute service that lets you run code in response to triggers without provisioning or managing infrastructure. It automatically scales from zero to handle high-concurrency workloads and bills only for execution time consumed. Functions supports multiple runtimes including C#, JavaScript, Python, Java, PowerShell, and F#, and integrates natively with Azure services via declarative triggers and bindings. The Durable Functions extension adds stateful orchestration, long-running workflows, and built-in checkpointing on top of the serverless model.

### Use Cases
* Serverless REST APIs and web backends (e.g., HTTP-triggered functions behind Azure API Management)
* Real-time data processing (e.g., processing Event Hub or Service Bus messages as they arrive)
* Event-driven file processing (e.g., image resizing triggered on Blob Storage uploads)
* Workflow orchestration and AI agents (e.g., multi-step Durable Functions orchestrations for LLM pipelines)
