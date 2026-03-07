# Scatter-Gather

## Description

The Scatter-Gather pattern enables a single client request to be served by aggregating data from multiple independent backend services concurrently. A central orchestrator "scatters" the request to N downstream services in parallel, collects the responses as they arrive, aggregates and formats the results, and returns a single unified payload to the client. This dramatically reduces total response time compared to sequential calls (time = slowest service, not sum of all services).

The pattern is common in travel search (querying multiple airline APIs simultaneously), financial data aggregation (querying multiple market data providers), product comparison engines, and any "federated search" use case.

## When to Use

- Aggregating data from multiple independent backend services simultaneously to serve a single client request
- The backend services are independent (no ordering dependency between them) and can safely be called in parallel
- The client requires a merged, unified view and should not need to call multiple APIs itself
- Reducing perceived latency when multiple data sources must be consulted — parallelising replaces sequential fan-out

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Orchestrator service (API or function) that manages the scatter and gather lifecycle |
| `integration_messaging` | Optionally async: scatter via message fan-out, gather via correlation IDs and a reply queue |
| `networking` | API gateway or BFF (Backend for Frontend) often implements this pattern at the edge |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Latency** | Total time = slowest responding service, not the sum — significant improvement over sequential calls |
| **Partial failure** | If one downstream service fails, the orchestrator must decide: return partial results or fail the whole request |
| **Timeout management** | Must set a global scatter timeout — slow services are abandoned at the deadline, potentially omitting their data |
| **Back-pressure** | A large scatter fan-out can overload downstream services — rate limiting the orchestrator is critical |

## Common Pitfalls

- Not handling partial failures gracefully — failing the entire request when one of five sources is unavailable provides poor user experience
- Not setting scatter timeouts — a single slow downstream service blocks the entire aggregated response indefinitely
- Using synchronous scatter-gather for very high fan-out (>20 services) — consider async pub/sub fan-out with a correlation-based gather instead
