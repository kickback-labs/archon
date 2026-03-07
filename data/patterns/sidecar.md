# Sidecar

## Description

The Sidecar pattern deploys a secondary helper container alongside the primary application container within the same execution unit (e.g., a Kubernetes Pod). The sidecar shares the same network namespace and lifecycle as the primary container, allowing it to intercept, augment, or proxy the primary container's traffic without modifying the application code.

Common sidecar responsibilities include: transparent mTLS termination and origination, distributed trace injection, metrics scraping, log forwarding, and service discovery. This pattern is the foundational building block of service meshes (Istio, Linkerd, Cilium).

## When to Use

- Standardising cross-cutting concerns (observability, mTLS, proxying) across polyglot microservices without modifying each service's code
- Implementing zero-trust networking (mTLS between every service pair) at the infrastructure level rather than the application level
- Adding capabilities to third-party or legacy services that cannot be modified
- Running a service mesh where the data plane is distributed across all pods

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Kubernetes pod with primary + sidecar containers running in the same pod spec |
| `networking` | Sidecar proxy intercepts all inbound/outbound traffic (mTLS, circuit breaking, retries, load balancing) |
| `security_identity` | Certificate management for mTLS (cert-manager, SPIFFE/SPIRE); zero-trust identity per workload |
| `devops` | Sidecar injection (automatic via admission webhook); centralised observability from all sidecars |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Consistency** | All services get uniform observability, mTLS, and routing regardless of language or framework |
| **Resource overhead** | Each pod incurs the memory and CPU cost of the sidecar proxy (typically 50–200 MB RAM per pod) |
| **Complexity** | Service mesh control plane (Istiod, Linkerd control plane) is a significant operational component to manage |
| **Latency** | An extra network hop through the proxy adds ~1ms of latency per call |

## Common Pitfalls

- Deploying a full service mesh for a small number of services — the operational overhead rarely pays off under ~10–20 services
- Not accounting for sidecar resource consumption in cluster capacity planning
- Mixing manually-configured and mesh-managed mTLS — creates security gaps and debugging nightmares
