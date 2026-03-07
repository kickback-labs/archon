---
cloud_provider: "GCP"
service_category: "devops"
service_name: "Cloud Profiler"
pricing_model: "on-demand"
managed: true
tier: 2
---
## GCP Cloud Profiler

### Description
Cloud Profiler is a low-overhead, statistical, continuous profiling service that collects CPU usage and memory-allocation data from production applications running on Google Cloud. It attributes resource consumption to the source code that generated it, surfacing flame graphs that reveal which functions and call paths consume the most CPU time, heap, or allocated heap. The profiler agent is a lightweight library attached to your application at runtime, adding less than 5% overhead during a 10-second collection window that fires roughly once per minute per instance — amortized across replicas the overhead typically stays below 0.5%. Cloud Profiler supports Go, Java, Node.js, and Python, and can run on Compute Engine, GKE, App Engine, Dataproc, Dataflow, and even workloads outside Google Cloud. Profile data is retained for 30 days and can be downloaded for long-term storage; results are integrated with Cloud Trace and Cloud Monitoring for correlated observability. Pricing is included at no additional charge when using Google Cloud.

### Use Cases
* Production CPU hotspot identification (e.g., using a Go flame graph to discover that a JSON serialization function accounts for 40% of CPU time in a high-throughput Cloud Run service)
* Memory leak and heap growth investigation (e.g., attaching the Java Profiler agent to a GKE pod and filtering the heap flame graph by allocation site to identify a caching layer that never evicts entries)
* Continuous performance regression monitoring (e.g., comparing flame graphs before and after a deployment to detect whether a new library version increased p99 CPU consumption without triggering metric alerts)
* Cost optimization of compute-heavy workloads (e.g., profiling a Dataflow pipeline job to find that one transform step dominates CPU, then rewriting it to halve worker machine costs)
* Wall-time profiling for I/O-bound services (e.g., using Node.js wall-time profiles to distinguish between CPU-bound compute and time spent waiting on downstream RPC calls in an async service)
* Cross-replica performance analysis (e.g., aggregating profiles across 20 GKE pod replicas to statistically identify a contention hotspot in a shared connection pool)
* Developer onboarding and performance education (e.g., using always-on profiles as a teaching aid to show new engineers which modules are performance-critical and why)
