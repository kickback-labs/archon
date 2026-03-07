---
cloud_provider: "GCP"
service_category: "compute"
service_name: "App Engine"
pricing_model: "serverless"
managed: true
tier: 2
---
## GCP App Engine

### Description
App Engine is GCP's fully managed platform-as-a-service (PaaS) for deploying and hosting web applications and APIs without managing the underlying infrastructure. It offers two runtime environments: the **standard environment**, which runs applications in a language-specific sandbox with fast startup times, automatic scaling to zero, and a free tier; and the **flexible environment**, which runs custom Docker containers on Compute Engine VMs and is suited for workloads requiring native code, custom runtimes, or sustained traffic with gradual scaling. App Engine handles capacity provisioning, load balancing, health checks, and security patches automatically. Supported languages in the standard environment include Python, Java, Go, Node.js, PHP, and Ruby. For new projects, Google now recommends evaluating Cloud Run as a more modern and capable alternative to App Engine.

### Use Cases
* Web application hosting (e.g., deploying Python or Node.js REST APIs that need to scale to zero on low traffic)
* Multi-service microservice architectures using App Engine services with traffic splitting and versioning
* Rapid prototyping and startups that want managed infrastructure with minimal configuration overhead
* Background task processing using the standard environment's built-in task queue integration with Cloud Tasks
* Applications with sudden traffic spikes that need near-instant autoscaling (e.g., marketing campaign landing pages)
* Legacy PaaS migrations where code is already built for App Engine and migration to Cloud Run is not yet planned
