# Hybrid / Multi-Cloud

## Description

The hybrid pattern connects on-premises infrastructure to one or more public cloud environments via dedicated private network links (AWS Direct Connect, Azure ExpressRoute, GCP Interconnect) or encrypted VPN tunnels. The multi-cloud pattern distributes workloads across two or more competing public cloud providers (e.g., AWS + Azure, or AWS + GCP), deliberately avoiding dependence on any single vendor.

These are often combined: an organisation may run its primary workload on AWS, its DR copy on Azure, and retain sensitive data processing on-premises — all connected via a unified private network backbone. Both patterns introduce significant network routing complexity and require disciplined egress cost management.

## When to Use

**Hybrid:**
- Regulatory or compliance requirements mandate that certain data categories (financial ledgers, healthcare records, classified information) remain on-premises
- Existing on-premises investment (hardware, licences, staff expertise) cannot be fully retired in the near term
- Latency-sensitive integration with on-premises systems makes full cloud migration impractical

**Multi-Cloud:**
- Explicit requirement to avoid vendor lock-in at the infrastructure level
- Best-of-breed service selection — e.g., using GCP Vertex AI for ML while using AWS for primary compute
- Geographic coverage: a provider that has a region where the other does not
- Regulatory mandate to use multiple providers for critical national infrastructure

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Cloud compute (any paradigm) + on-premises servers or VMs; workload placement logic required |
| `networking` | Private connectivity (Direct Connect, ExpressRoute, Interconnect), VPN fallback, hub-and-spoke network topology across clouds/on-prem |
| `security_identity` | Federated identity (SAML/OIDC bridging cloud IAM with on-premises AD/LDAP), cross-environment secrets management |
| `migration_hybrid` | Hybrid connectivity services, cloud migration tools, edge/on-prem management (Outposts, Arc, Anthos) |
| `devops` | Cross-environment CI/CD, unified observability across clouds and on-premises, cost allocation across providers |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Flexibility** | Highest degree of provider independence and workload placement flexibility |
| **Complexity** | Exponentially more complex network routing, identity federation, and cost management |
| **Egress cost** | Cross-cloud and cloud-to-on-premises data transfer is expensive and must be modelled explicitly |
| **Operational overhead** | Each provider requires separate expertise; tooling must span multiple control planes |
| **Consistency** | Enforcing consistent security policies, naming conventions, and compliance controls across environments requires dedicated governance tooling |

## Common Pitfalls

- Adopting multi-cloud for lock-in avoidance without a concrete plan — in practice, applications still become coupled to provider-specific services
- Underestimating egress costs between clouds — inter-cloud data transfer can become the dominant cost line
- Not centralising identity federation — separate identity systems per cloud create security and audit complexity
- Attempting multi-cloud without a platform team that owns the cross-cloud abstraction layer
