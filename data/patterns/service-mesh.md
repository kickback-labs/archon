# Service Mesh

## Description

A Service Mesh is a dedicated infrastructure layer for managing synchronous service-to-service communication within a containerised environment (typically Kubernetes). It works by injecting a lightweight proxy sidecar container into every application pod. All inbound and outbound traffic passes through this sidecar proxy, which enforces mutual TLS (mTLS), implements circuit breaking and retries, collects distributed traces and metrics, and handles sophisticated load balancing — entirely transparently to the application code.

The mesh has two planes:
- **Data plane:** The sidecar proxies (Envoy) deployed in every pod, executing traffic policies
- **Control plane:** The centralised management component (Istiod, Linkerd control plane, Cilium) that distributes configuration to all proxies

Leading implementations: Istio, Linkerd, Cilium (eBPF-based), AWS App Mesh.

## When to Use

- Managing complex synchronous HTTP/gRPC routing between many microservices in Kubernetes
- Zero-trust mTLS encryption and authentication between every service pair — without modifying application code
- Deep observability (distributed tracing, per-service latency histograms, per-route error rates) across a large microservices fleet
- Advanced traffic management: canary deployments, traffic mirroring, A/B testing at the service mesh level
- The team has sufficient Kubernetes expertise to operate the mesh control plane

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Kubernetes cluster hosting application pods + sidecar proxies; mesh control plane pods |
| `networking` | All intra-cluster service traffic routed through mesh proxies; ingress gateway for external traffic |
| `security_identity` | mTLS with SPIFFE/SPIRE identity for every workload; policy enforcement for service-to-service authorisation |
| `devops` | Distributed tracing (Jaeger, Zipkin), Prometheus metrics from all proxies, mesh dashboards (Kiali, Grafana) |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Observability** | Automatic distributed tracing and per-route metrics across all services — without application code changes |
| **Security** | Transparent mTLS between every service pair — zero-trust network enforced at the infrastructure layer |
| **Resource overhead** | Each pod incurs sidecar CPU and memory overhead (typically 50–200 MB RAM per pod) |
| **Control plane complexity** | The mesh control plane is a significant operational component — outages affect all service communication |
| **Debugging complexity** | Network issues now involve proxy configuration, mTLS certificates, and policy rules in addition to application code |

## Common Pitfalls

- Deploying a service mesh for fewer than 10–20 services — the operational overhead rarely pays off at small scale
- Not setting resource limits on sidecar containers — unconstrained sidecars compete with application containers for node resources
- Using service mesh circuit breaking AND application-level circuit breaking simultaneously — double circuit breaking causes confusing failure modes
- Not monitoring the control plane separately from the data plane — a failing control plane is invisible until proxy configuration staleness causes service failures
