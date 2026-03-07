---
cloud_provider: "GCP"
service_category: "devops"
service_name: "Cloud Trace"
pricing_model: "on-demand"
managed: true
tier: 2
---
## GCP Cloud Trace

### Description
Cloud Trace is GCP's fully managed distributed tracing service that collects latency data from applications and displays it in near real-time in the Google Cloud console. It instruments request paths across microservices and backend calls, enabling developers to identify performance bottlenecks and understand end-to-end request latency. Cloud Trace supports OpenTelemetry for instrumentation across Node.js, Go, Java, Python, and other languages, and can automatically collect traces from App Engine, Cloud Run, and GKE workloads that use the Cloud Trace API or OpenTelemetry exporters. Trace data can be queried with SQL-based analytics. Pricing is based on the number of trace spans ingested beyond a free monthly allotment. Cloud Trace integrates with Cloud Monitoring and Cloud Logging to provide correlated observability signals.

### Use Cases
* End-to-end request latency visualization (e.g., tracing an HTTP request from a Cloud Run frontend through a GKE microservice to a Cloud SQL query, seeing the exact duration of each span and identifying the slow database call)
* Microservice bottleneck identification (e.g., instrumenting a Python Flask service with OpenTelemetry and exporting traces to Cloud Trace to pinpoint which downstream gRPC call contributes most to p99 latency)
* Latency regression detection (e.g., comparing trace latency distributions before and after a deployment to detect whether a code change introduced a performance regression)
* Cross-service dependency mapping (e.g., visualizing the call graph of a distributed application to understand which services are called synchronously versus asynchronously)
* SQL-based trace analytics (e.g., querying trace data with Cloud Trace's analytics to calculate the 95th percentile latency for a specific endpoint over the past 7 days)
* Correlated observability with logs and metrics (e.g., jumping from a slow trace span in Cloud Trace directly to the corresponding Cloud Logging log entries for that request for root cause analysis)
* Performance profiling for serverless workloads (e.g., using auto-instrumented Cloud Run traces to identify cold-start latency versus warm-request latency without code changes)
