---
cloud_provider: "Azure"
service_category: "security_identity"
service_name: "Entra External ID"
pricing_model: "per-request"
managed: true
tier: 2
---
## Azure Entra External ID

### Description
Microsoft Entra External ID is a customer identity and access management (CIAM) and B2B collaboration platform built on Microsoft Entra ID. It unifies two distinct scenarios under a single product: an *external tenant* configuration for publishing apps to consumers and business customers with custom-branded sign-up/sign-in experiences, and *B2B collaboration* in workforce tenants that lets employees securely invite external partners and guests to access enterprise apps using their own credentials. For consumer-facing apps, developers register their app in a dedicated external tenant separate from the employee directory, configure self-service sign-up flows with social identity providers (Google, Facebook), collect custom user attributes, and enforce MFA via Conditional Access. For B2B scenarios, guest users authenticate with their home identity provider (Microsoft Entra, Microsoft account, or social) and receive scoped access; cross-tenant access settings control inbound/outbound policy per partner organization. Billing for external tenants is based on monthly active users (MAU). Azure AD B2C, the legacy CIAM solution, is no longer available for new customers as of May 1, 2025 — Entra External ID in an external tenant is its replacement.

### Use Cases
* Consumer app authentication (CIAM) — add branded sign-up and sign-in with email/password, one-time passcode, or social providers (Google, Facebook) to a web or mobile app using an external tenant, without exposing the corporate employee directory
* B2B partner collaboration — invite suppliers, vendors, and partners as guests to access Microsoft 365 apps, SaaS apps, or line-of-business applications using their home organization credentials; no new password required
* Self-service B2B sign-up — configure user flows that allow external partners to register themselves for access, subject to approval policies defined in Microsoft Entra entitlement management
* MFA and Conditional Access for external users — enforce MFA or device compliance requirements on guest users accessing sensitive enterprise resources; trust MFA claims from a partner's home Entra tenant to reduce friction
* Branded sign-in experience — customize login pages with company logos, background images, colors, and text for each application, giving customers a first-party identity experience
* Cross-tenant access governance — use cross-tenant access settings to define per-organization policies controlling which external users can collaborate and whether their MFA/device claims are trusted
* Legacy Azure AD B2C migration — migrate existing Azure AD B2C consumer identity workloads to Entra External ID external tenants, which provides the same CIAM capabilities on the modern Entra platform
