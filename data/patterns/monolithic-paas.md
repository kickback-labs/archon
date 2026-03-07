# Monolithic (PaaS-hosted)

## Description

A monolithic architecture packages the entire application — UI, business logic, and data access — into a single deployable artifact. It is hosted on a managed Platform-as-a-Service (PaaS) runtime such as AWS Elastic Beanstalk, Azure App Service, or GCP App Engine. The provider manages the underlying OS, runtime patching, and basic scaling, leaving the team to focus entirely on application code.

This is not an anti-pattern. For early-stage products and small teams it is often the correct choice: no distributed tracing, no service mesh, no inter-service latency, and a dramatically simpler deployment pipeline. It only becomes a liability when the engineering organisation outgrows it.

## When to Use

- Small team (solo to ~5 engineers)
- Early-stage product where speed-to-market outweighs scalability concerns
- Low domain complexity — the business logic does not decompose cleanly into separate bounded contexts
- Limited cloud expertise — managed PaaS removes operational overhead that the team cannot yet absorb
- Budget is minimal and baseline infrastructure cost must be near-zero

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Core runtime — PaaS managed container or runtime (Beanstalk, App Service, App Engine) |
| `database` | Single shared relational database (RDS, Azure SQL, Cloud SQL) |
| `networking` | Load balancer + DNS managed by PaaS, simple CDN for static assets |
| `security_identity` | IAM roles for PaaS environment, secrets manager for credentials, WAF optional |
| `devops` | Simple CI/CD pipeline (single deployable artifact), basic APM monitoring |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Scaling** | Scales vertically first; horizontal scaling replicates the whole app, not individual bottlenecks |
| **Deployment** | All engineers coordinate releases on a single artifact — coupling increases with team size |
| **Operational cost** | Lowest operational overhead of any compute pattern |
| **Migration path** | Strangler Fig pattern enables incremental breakout to microservices when the team grows |

## Scaling Ceiling & Break-Even Points

- **Team ceiling:** ~5–10 engineers before release coordination becomes a bottleneck
- **Traffic ceiling:** Horizontal PaaS scaling handles moderate traffic well; consider microservices or serverless when a single subsystem consistently becomes the scaling bottleneck
- **Complexity ceiling:** When separate teams need to own and independently deploy distinct domains, the monolith should be broken apart

## Common Pitfalls

- Delaying the architectural transition too long — migrating a large monolith under production pressure is expensive
- Not separating the data layer early — a shared database with no internal module boundaries is the hardest part of a later extraction
- Ignoring PaaS-specific limits (connection pooling, memory caps, deployment slot behaviour) that bite at scale
