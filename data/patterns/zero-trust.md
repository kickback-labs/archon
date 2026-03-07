# Zero Trust

## Description

Zero Trust is a security architecture model that operates on the principle that no user, device, or service is implicitly trusted — regardless of whether they are inside or outside the traditional network perimeter. Every request must be explicitly authenticated, strictly authorised against the principle of least privilege, and continuously monitored, even if the request originates from within the corporate network.

Zero Trust replaces the obsolete "castle-and-moat" perimeter security model, which assumed anything inside the firewall was safe. In modern distributed cloud environments where workloads span multiple clouds, employees work from anywhere, and lateral movement is the primary attack vector after initial breach, perimeter-based security is structurally inadequate.

Core Zero Trust principles:
1. **Verify explicitly** — Always authenticate and authorise based on identity, device posture, and context — not network location
2. **Least privilege access** — Grant minimum required permissions for the minimum required time
3. **Assume breach** — Design assuming an attacker is already inside; limit blast radius via micro-segmentation

## When to Use

- Any production cloud environment — Zero Trust should be considered a baseline security requirement, not an optional enhancement
- Distributed environments with remote workers, multi-cloud workloads, or third-party service integrations
- High-security environments with regulatory compliance requirements (HIPAA, PCI DSS, SOC 2, FedRAMP)
- Environments with sensitive data where lateral movement from a compromised service must be prevented
- Microservices architectures where inter-service trust cannot be assumed

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `security_identity` | Identity provider (IdP), OIDC/SAML federation, multi-factor authentication, device posture assessment, privileged access management (PAM), just-in-time access |
| `networking` | Micro-segmentation (security groups, NACLs, network policies), no implicit network trust, mTLS between services |
| `compute` | Workload identity (IRSA, Workload Identity, Managed Identities) — each service has a cryptographic identity, not shared credentials |
| `devops` | Continuous access log review, anomaly detection (SIEM/SOAR), access policy as code, automated least-privilege enforcement |

## Zero Trust Implementation Pillars

| Pillar | Key Controls |
|---|---|
| **Identity** | Strong MFA, device posture check, conditional access policies, per-workload identity |
| **Devices** | Device health attestation before granting access; managed device requirements for sensitive access |
| **Network** | Micro-segmentation, mTLS everywhere, no flat internal networks |
| **Applications** | Per-application authorisation, API-level access control, RBAC/ABAC enforcement |
| **Data** | Data classification, encryption at rest and in transit, DLP controls |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Security** | Dramatically reduces blast radius of a compromised account or service — lateral movement is blocked at every boundary |
| **User experience** | More friction for users — conditional access, MFA prompts, device checks can slow legitimate access |
| **Implementation cost** | Full Zero Trust is a multi-year programme — start with identity (highest ROI) and expand |
| **Operational complexity** | Policy-as-code, certificate management (SPIFFE/SPIRE), and continuous access monitoring require mature DevSecOps practices |

## Common Pitfalls

- Treating Zero Trust as a product to buy rather than an architectural principle to implement — no single vendor delivers "Zero Trust"
- Starting with network micro-segmentation before establishing strong identity — identity is the correct first pillar (highest security return per effort)
- Applying blanket deny-all policies without a plan for legitimate access paths — overly restrictive policies break applications and drive shadow IT workarounds
- Not including service-to-service authentication in scope — human identity without machine identity is incomplete Zero Trust
