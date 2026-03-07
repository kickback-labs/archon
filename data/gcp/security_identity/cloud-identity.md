---
cloud_provider: "GCP"
service_category: "security_identity"
service_name: "Cloud Identity"
pricing_model: "subscription"
managed: true
tier: 2
---
## GCP Cloud Identity

### Description
Google Cloud Identity is an Identity-as-a-Service (IDaaS) solution that provides centralized user and group lifecycle management, device management, and single sign-on (SSO) for Google Cloud and third-party SaaS applications. It serves as the identity foundation for GCP organizations: every Cloud Identity user account can be granted IAM roles on GCP resources, enabling consistent authentication and authorization across Google Cloud services. Cloud Identity supports federation with external identity providers — including Microsoft Active Directory, Microsoft Entra ID, Okta, and any SAML 2.0/OIDC provider — via SAML SSO and Google Cloud Directory Sync (GCDS), allowing organizations to use existing on-premises identities in GCP without duplicating accounts. It is available in a Free edition (core identity and basic endpoint management) and a Premium edition that adds advanced mobile device management, Context-Aware Access, automated SCIM provisioning to third-party apps, and security center features. Cloud Identity is distinct from Workforce Identity Federation (part of GCP IAM), which federates external identities directly into GCP without requiring a Cloud Identity account; Cloud Identity is preferable when Google Admin Console management, device management, or Google Workspace integration is also required.

### Use Cases
* Creating and managing user accounts for all employees in a GCP organization so that IAM role bindings use consistent, IT-managed identities rather than personal Gmail accounts
* Federating on-premises Active Directory or Microsoft Entra ID with GCP via GCDS and SAML SSO, allowing employees to sign into the GCP console and Cloud APIs with existing corporate credentials (no password duplication)
* Enforcing 2-Step Verification (including FIDO2 hardware security keys) across all users to protect access to GCP resources and third-party SAML apps
* Applying Context-Aware Access policies (Premium) to restrict access to GCP or Google Workspace based on device posture, user identity, IP range, or geographic location (e.g., block access from unmanaged or non-compliant devices)
* Managing mobile devices (Android, iOS, Windows) enrolled by employees — enforcing passcode policies, remote wipe, and app management — to extend corporate security policies to endpoints accessing GCP data
* Automating user provisioning and deprovisioning to third-party SaaS apps (e.g., Salesforce, Slack) via SCIM (Premium) from a single directory, reducing manual IT operations and off-boarding risk
* Organizing users into Google Groups and Organizational Units to simplify IAM role assignments and policy application at scale across a large GCP organization
