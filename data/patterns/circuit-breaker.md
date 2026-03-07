# Circuit Breaker

## Description

The Circuit Breaker pattern prevents a distributed system from amplifying failures into cascading outages. When Service A calls Service B synchronously, and Service B becomes slow or unresponsive, Service A's thread pool exhausts waiting for timeouts — eventually crashing Service A and propagating the failure upstream. The circuit breaker wraps the remote call in a state machine that monitors the failure rate. When failures exceed a threshold, the circuit "trips" to an OPEN state, immediately rejecting subsequent calls without attempting the network connection. After a recovery timeout, the circuit transitions to HALF-OPEN, allowing a single probe request to test if the downstream service has recovered.

The three states: **CLOSED** (normal, calls pass through), **OPEN** (calls fail immediately, no network attempt), **HALF-OPEN** (probe mode, limited calls allowed to test recovery).

## When to Use

- Any microservices architecture with synchronous inter-service calls (HTTP, gRPC)
- Protecting against cascading failures from downstream latency spikes, partial outages, or dependency exhaustion
- When the business can define a sensible fallback behaviour (cached response, degraded mode, default value) for when the circuit is open
- High-traffic systems where thread pool exhaustion from a single slow dependency could cascade across the fleet

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Implemented at the client side in each calling service (library: Resilience4j, Polly, Hystrix, or service mesh circuit breaking) |
| `networking` | Service mesh (Istio, Linkerd) can implement circuit breaking at the proxy layer, removing the need for per-service libraries |
| `devops` | Circuit state monitoring and alerting — a tripped circuit is an ops signal requiring investigation |

## Configuration Parameters

| Parameter | Purpose |
|---|---|
| Failure rate threshold | % of calls that must fail before the circuit opens (e.g., 50%) |
| Sliding window size | Number of calls evaluated to calculate the failure rate |
| Wait duration in OPEN state | How long to wait before attempting recovery probe |
| Permitted calls in HALF-OPEN | Number of test calls allowed before deciding to close or re-open |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Resilience** | Prevents cascading failures — isolates the blast radius of downstream outages |
| **Degraded mode** | Requires the caller to implement a fallback — not all operations have a sensible degraded response |
| **False positives** | Poorly tuned thresholds trip the circuit on transient errors, unnecessarily rejecting valid calls |
| **Observability** | Circuit state changes must be monitored — a permanently open circuit indicates an unresolved downstream issue |

## Common Pitfalls

- Not implementing a fallback — a circuit breaker without a fallback simply converts a slow failure into a fast one, which may be better but is not a solution
- Setting thresholds too low — trips on transient network blips and creates more problems than it solves
- Applying circuit breakers to asynchronous calls — they are primarily a synchronous call resilience pattern; async calls should use dead-letter queues instead
