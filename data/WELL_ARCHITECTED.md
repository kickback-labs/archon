# Cloud-Agnostic Well-Architected Framework

This document is the reference for evaluating cloud architecture quality across six pillars. It is provider-agnostic and applies to AWS, Azure, GCP, or any combination. All checks are proportional — a minimal-budget, low-scale workload should not be held to enterprise-grade standards, and vice versa.

---

## How to Apply This Framework

1. Review all six pillars. No pillar is ever skipped, though findings may be minimal for some.
2. Ground every finding in the stated requirements: scale, budget, team expertise, compliance, and quality attribute.
3. Distinguish between genuine gaps (things that will cause real problems given the requirements) and theoretical imperfections (things that would matter at a different scale or budget).
4. A finding is only a concern if it is disproportionate to the stated requirements.

---

## Pillar 1: Reliability

**Goal:** The system recovers from failures and continues to serve its intended function.

### Principles
- Design for failure: assume any component can fail at any time
- Eliminate single points of failure at every layer (compute, database, network, DNS)
- Prefer horizontal redundancy (multiple instances behind a load balancer) over vertical scaling alone
- Define and validate RTO (Recovery Time Objective) and RPO (Recovery Point Objective) for each data store
- Test failure recovery: automated health checks, failover drills, chaos experiments proportional to workload criticality

### Checks
- Are critical compute workloads deployed across multiple failure domains (availability zones or regions)?
- Is there a data backup strategy with a defined RPO?
- Are health checks configured on all load-balanced endpoints?
- Does the system degrade gracefully (circuit breakers, timeouts, retries) rather than cascading on failure?
- Is the disaster recovery plan documented and proportional to the stated availability quality attribute?
- For high-availability workloads: is there a tested multi-region or multi-zone failover path?

### Proportionality
- `quality: "availability"` or `budget: "enterprise"` → strict multi-AZ, tested DR required
- `budget: "minimal"` or `scale: "< 1k"` → single-zone with backups is acceptable; multi-region is likely over-engineered

---

## Pillar 2: Security

**Goal:** Data and systems are protected at every layer, with access limited to what is strictly necessary.

### Principles
- Defense in depth: apply controls at identity, network, compute, data, and application layers
- Least privilege: every service, user, and machine gets only the permissions it needs
- No credentials in code, configuration files, or version control — use a managed secrets store
- Encrypt data at rest and in transit, for every data store and every service-to-service connection
- Enable audit logging so that every access and change is traceable
- Prepare for security incidents: have a response plan, not just preventive controls

### Checks
- Are all service-to-service and human identities governed by a central IAM system with least-privilege policies?
- Are secrets (API keys, database passwords, certificates) stored in a managed secrets store, never hardcoded?
- Is encryption enabled at rest for all data stores (object storage, databases, queues)?
- Is TLS enforced for all data in transit between services and between the system and its clients?
- Is audit/access logging enabled and collected centrally?
- For public-facing workloads: is a web application firewall (WAF) or API gateway providing request filtering?
- Are compliance requirements (HIPAA, GDPR, PCI, SOC 2, etc.) addressed in the chosen services and configuration?
- Is network access segmented (private subnets for data stores, public exposure only at the edge)?

### Proportionality
- Any compliance requirement (HIPAA, PCI, etc.) → strict encryption, audit logging, and access controls are non-negotiable regardless of budget
- `cloud_expertise: "low"` → prefer fully managed identity and secret management to reduce misconfiguration risk
- `budget: "minimal"` → free-tier or built-in encryption is still required; cost is not an excuse to skip encryption

---

## Pillar 3: Cost Optimization

**Goal:** The system delivers its value at a cost proportional to the stated budget, with no persistent waste.

### Principles
- Match resource consumption to actual demand: avoid over-provisioning; use autoscaling
- Use managed and serverless services where they reduce total cost of ownership (TCO), especially for small teams
- Apply budget alerts and cost attribution from day one, not as an afterthought
- Evaluate pricing models: serverless/per-request pricing suits spiky or low-volume traffic; reserved/committed pricing suits predictable sustained load

### Checks
- Are all compute resources sized to the expected load, with autoscaling enabled where traffic is variable?
- Is the pricing model (on-demand, serverless, reserved) matched to the expected traffic pattern?
- Are budget alerts configured so the team is notified before unexpected cost overruns?
- Are there unused or idle resources (dev/test environments, unattached storage, stopped instances) that should be cleaned up or scheduled?
- For `budget: "minimal"`: is every service choice the most cost-effective option for its role?
- For `budget: "enterprise"`: is the cost of reliability and redundancy justified by the availability requirement?

### Proportionality
- `budget: "minimal"` → every service choice must be validated against cost; serverless and fully-managed are preferred
- `budget: "enterprise"` → cost optimisation is secondary to reliability, security, and performance

---

## Pillar 4: Operational Excellence

**Goal:** The system can be deployed, monitored, and evolved reliably by the team that owns it.

### Principles
- Treat infrastructure as code: all resources are defined declaratively, version-controlled, and reproducible
- Automate deployments: no manual steps in the release path
- Make changes small and reversible: incremental deployments, feature flags, rollback capability
- Know the system's health at all times: metrics, logs, and distributed traces must be available
- Learn from failures: post-incident reviews, runbooks, and operational procedures are maintained

### Checks
- Is infrastructure defined as code (IaC) and stored in version control?
- Is there a CI/CD pipeline for both application and infrastructure changes?
- Are logs, metrics, and traces collected and accessible in a central observability platform?
- Are alerts defined for meaningful thresholds (error rate, latency, queue depth, disk usage)?
- Is there a runbook or on-call procedure for the most likely failure modes?
- Is the operational burden proportional to the team size and cloud expertise?
- For `cloud_expertise: "low"`: are fully managed services used to reduce operational surface area?

### Proportionality
- `cloud_expertise: "low"` or small team → fully managed services are essential; self-managed databases, custom log pipelines, and manual deployments are high-risk
- `cloud_expertise: "high"` → more customisation is acceptable if it provides a clear benefit

---

## Pillar 5: Performance Efficiency

**Goal:** The system meets its performance requirements using the right resources at the right scale.

### Principles
- Choose services and resource types that match the workload's access pattern (OLTP vs OLAP, stateless vs stateful, latency-sensitive vs batch)
- Use caching at the right layer to reduce load on origin services and databases
- Distribute load globally when users or data are geographically distributed
- Monitor performance continuously: establish baselines, detect regressions, load-test before reaching production limits

### Checks
- Is the database type matched to the access pattern (relational for complex queries/transactions, key-value for high-throughput simple lookups, time-series for metrics, etc.)?
- Is there a caching layer where repeated reads justify it (CDN for static assets, in-memory cache for hot data)?
- Are compute resources able to scale to the stated peak load without manual intervention?
- Is asynchronous processing used for workloads that do not require a synchronous response?
- For latency-sensitive workloads: is the compute layer co-located with the data layer, or is cross-region latency a risk?
- Is there a plan for load testing before the system reaches its expected peak traffic?

### Proportionality
- `scale: "> 100k"` users → caching, autoscaling, and async patterns are required; synchronous monoliths are high-risk
- `scale: "< 1k"` users → over-engineering (microservices, event-driven, multi-region) adds complexity without benefit

---

## Pillar 6: Sustainability

**Goal:** The system minimises unnecessary resource consumption and environmental impact.

### Principles
- Prefer managed and serverless services: they share infrastructure across tenants and typically achieve higher utilisation than dedicated provisioned resources
- Eliminate idle resources: dev/test environments, scheduled jobs, and background workers should not run 24/7 if not needed
- Right-size continuously: start small, measure, and scale up only when there is evidence of need
- Choose deployment regions thoughtfully when feasible (renewable energy availability is a real differentiator)

### Checks
- Are serverless or managed compute options used where they would serve the workload without requiring always-on provisioned infrastructure?
- Are non-production environments shut down or scaled to zero when not in use?
- Is autoscaling configured to release unused capacity rather than keeping resources warm?
- Is there a data lifecycle policy to expire or archive data that is no longer actively accessed?

### Proportionality
- Sustainability checks apply most strongly to `budget: "minimal"` and `scale: "< 1k"` workloads — idle resources are both wasteful and costly
- For enterprise workloads, sustainability is a secondary concern after reliability and security

---

## Common Anti-Patterns

These patterns appear repeatedly across all providers and all workload types. Flag them when present.

| Anti-Pattern | Risk | Applies when |
|---|---|---|
| Single point of failure at any layer | Outage on first failure | Any non-trivial availability requirement |
| No infrastructure as code | Configuration drift, non-reproducible environments | Any team larger than one person |
| Credentials or secrets in code/config | Security breach, data loss | Always — no exceptions |
| No centralised logging or monitoring | Blind to failures until users complain | Any production workload |
| No backup or recovery plan | Permanent data loss on failure | Any stateful workload |
| Persistent over-provisioning | Ongoing cost waste | Any workload with autoscaling alternatives available |
| No cost alerts or budget tracking | Surprise bill, budget overrun | Any cloud deployment |
| Architecture complexity disproportionate to scale | Operational burden exceeding team capacity | Microservices / event-driven for solo or small teams at low scale |
| Self-managed infrastructure where managed alternatives exist, for low-expertise teams | High operational risk, configuration errors | `cloud_expertise: "low"` with self-managed databases, queues, or runtimes |
| Public data store exposure | Data exfiltration | Any data store reachable from the public internet without authentication |
