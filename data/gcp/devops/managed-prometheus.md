---
cloud_provider: "GCP"
service_category: "devops"
service_name: "Managed Service for Prometheus"
pricing_model: "on-demand"
managed: true
tier: 2
---
## GCP Managed Service for Prometheus

### Description
Managed Service for Prometheus is GCP's fully managed, Prometheus-compatible monitoring solution built on Monarch, the same globally scalable in-memory time series database that Google uses to monitor its own services. It eliminates the need to operate, shard, federate, or scale Prometheus infrastructure while retaining full compatibility with the Prometheus ecosystem — existing PromQL queries, Grafana dashboards, alerting rules, and recording rules work without modification. Teams can choose between managed collectors (automatically deployed, scaled, and sharded via lightweight Kubernetes custom resources) or self-deployed collectors that swap the standard Prometheus binary for the Managed Service for Prometheus binary. A Prometheus sidecar for Cloud Run and the Ops Agent for VMs extend coverage beyond GKE. Metrics are stored globally with a default two-year retention period at no additional charge, queryable with PromQL via the Prometheus HTTP API, Grafana, Cloud Monitoring's Metrics Explorer, or the Cloud Monitoring UI. Pricing is per-sample ingested with a tiered rate that decreases at higher volumes. Cost control mechanisms include metric filters, sparse histogram discounts, and reduced rates for longer scrape intervals.

### Use Cases
* Kubernetes observability without infrastructure management (e.g., deploying managed collectors to a GKE cluster with a PodMonitoring custom resource to scrape application metrics, replacing a self-hosted Prometheus stack that required manual shard management)
* Unified monitoring across GKE, Cloud Run, and VMs (e.g., using the managed GKE collector, a Cloud Run Prometheus sidecar, and the Ops Agent together to standardize all environments on PromQL-based monitoring)
* PromQL alerting with Cloud Monitoring integration (e.g., defining Prometheus alerting rules that fire Cloud Monitoring alerts, which then trigger PagerDuty pages without replacing existing on-call tooling)
* Cost-effective HPA-friendly monitoring (e.g., taking advantage of per-sample pricing to avoid cardinality cost spikes when Horizontal Pod Autoscaling temporarily increases pod replicas)
* Multi-project monitoring with a single pane of glass (e.g., using Cloud Monitoring metrics scopes to query Prometheus metrics from 15 GCP projects through a single Grafana data source)
* Global rule evaluation at scale (e.g., running a stand-alone rule evaluator that evaluates recording rules globally against data from all regions, storing results as new time series without co-locating data on a single Prometheus server)
* Migration from self-hosted Prometheus (e.g., swapping the self-deployed Prometheus binary for the Managed Service for Prometheus binary and reusing existing scrape configs, reducing ops burden while keeping Grafana dashboards intact)
