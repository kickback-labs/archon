# Strangler Fig

## Description

The Strangler Fig pattern provides a safe, incremental strategy for modernising a legacy monolith without a risky big-bang rewrite. An intelligent proxy or API gateway is placed in front of the legacy system. As new microservices are built to replace specific legacy functions, the proxy is reconfigured to route those specific paths to the new service. Over time, the legacy system is progressively "strangled" until it can be fully decommissioned.

The name comes from the strangler fig tree, which grows around its host tree and eventually replaces it entirely.

## When to Use

- Modernising a large, deeply entrenched legacy system that cannot be rewritten in a single effort
- Zero-downtime migration is a hard requirement — the business cannot tolerate a cutover window
- Incremental risk management is required — teams want to validate each extracted service before proceeding
- Different parts of the legacy system are owned by different teams and can be modernised independently

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | New microservices running alongside the legacy system (containers or serverless) |
| `networking` | API gateway or reverse proxy as the routing layer (API Gateway, NGINX, Kong, Azure API Management) |
| `devops` | Feature flags or routing rules to control traffic split between legacy and new services; deployment pipelines for both old and new |
| `integration_messaging` | Shared events or queues if the new services need to sync state with the legacy system during the transition |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Risk** | Lowest-risk migration strategy — each step is reversible |
| **Duration** | Migrations can take months or years; maintaining two systems in parallel is expensive |
| **Data** | Shared data access between old and new services is the hardest part — often requires an Anti-Corruption Layer |
| **Complexity** | Routing logic in the proxy grows complex as more routes are migrated |

## Common Pitfalls

- Not establishing a clear ownership boundary for each extracted piece — partial extractions with shared state create the worst of both worlds
- Leaving the strangler proxy as permanent infrastructure after migration is complete
- Migrating leaf services before core domain services — dependencies create ordering constraints that must be planned upfront
