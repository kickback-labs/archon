---
cloud_provider: "AWS"
service_category: "networking"
service_name: "Verified Access"
pricing_model: "on-demand"
managed: true
tier: 3
---
## AWS Verified Access

### Description
AWS Verified Access provides secure, VPN-less remote access to corporate applications and infrastructure resources by continuously evaluating user identity and device security posture on every access request. It implements a zero-trust access model: users authenticate through an identity provider (IdP) such as IAM Identity Center, Okta, or any OIDC-compatible provider, and Verified Access evaluates the request against access policies that can require specific device health signals (e.g., from AWS Verified Access Device Trust Providers including Jamf, CrowdStrike, or Microsoft Intune). HTTP/HTTPS web applications are natively proxied; non-web resources such as databases, EC2 instances, RDP, and SSH are supported via the Verified Access Connectivity Client. Access policies are written in Cedar, a purpose-built policy language. Every access attempt is logged for audit and incident response.

### Use Cases
* Replacing VPNs for remote employee access to internal web-based corporate applications (e.g., HR portals, dashboards)
* Enforcing device compliance checks before allowing access to sensitive resources (e.g., requiring a managed, up-to-date device to access financial systems)
* Providing time-limited, least-privilege access for contractors and external collaborators without adding them to the corporate VPN
* Zero-trust access to infrastructure resources such as EC2 instances over SSH or RDP without exposing them to the internet
* Centralised access policy management across multiple applications with a single control plane and uniform audit log
* Integrating with existing enterprise IdPs (e.g., Okta, Azure AD) without replacing the identity stack
