---
cloud_provider: "GCP"
service_category: "compute"
service_name: "Cloud Run"
pricing_model: "serverless"
managed: true
tier: 1
---
## GCP Cloud Run

### Description
Cloud Run is GCP's fully managed serverless container platform that runs stateless containers, functions, and background worker pools on Google's scalable infrastructure. It requires no cluster or server management and bills with 100ms granularity, scaling to zero when idle. Cloud Run supports three resource types: services (HTTP-triggered, autoscaling), jobs (run-to-completion batch tasks, including GPU-accelerated), and worker pools (always-on pull-based background workers). Containers can be deployed from a pre-built image or directly from source code using Buildpacks, and integrate natively with Cloud SQL, Pub/Sub, Eventarc, Cloud Storage, and other Google Cloud services.

### Use Cases
* HTTP APIs and web applications (e.g., REST or GraphQL microservices that scale on request volume)
* Event-driven serverless containers (e.g., Pub/Sub or Cloud Storage triggered processing)
* Containerized batch and scheduled jobs (e.g., nightly ETL pipelines or invoice generation)
* AI inference serving (e.g., running LLM inference with GPU instances on Cloud Run)
