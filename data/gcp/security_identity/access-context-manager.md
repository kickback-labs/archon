---
cloud_provider: "GCP"
service_category: "security_identity"
service_name: "Access Context Manager"
pricing_model: "subscription"
managed: true
tier: 3
---
## GCP Access Context Manager (ACM)

### Description
Google Cloud Access Context Manager (ACM) is a policy management service that enables fine-grained, attribute-based access control for GCP projects and resources, forming the foundation of Google's BeyondCorp zero-trust security model. Administrators define an access policy — an organization-wide container — that holds access levels and service perimeters. Access levels describe conditions that requests must satisfy to be granted access; conditions can be based on IP ranges (CIDR blocks), device attributes (OS version, management status via Endpoint Verification), user identity, or third-party signals via custom Common Expression Language (CEL) expressions. Service perimeters (part of VPC Service Controls) define security boundaries around GCP resources — data inside cannot be exported to resources outside the perimeter, protecting against data exfiltration even if IAM credentials are compromised. ACM itself does not enforce policy; enforcement is delegated to integration points: VPC Service Controls, Identity-Aware Proxy (IAP), IAM Conditions, and Context-Aware Access for Google Workspace. Scoped policies allow delegated administration at folder or project level. Access levels support both basic (attribute AND/OR combinations) and custom (CEL) modes, and can be nested for hierarchical trust structures. The service is a core component of Chrome Enterprise Premium (formerly BeyondCorp Enterprise).

### Use Cases
* Implementing a BeyondCorp zero-trust model by replacing VPN-based perimeter security with context-aware access levels that evaluate device posture, user identity, and network origin for every request to GCP APIs and Google Workspace
* Defining VPC Service Controls service perimeters around sensitive GCP resources (BigQuery datasets, Cloud Storage buckets, Cloud KMS keys) to prevent data exfiltration even from compromised IAM credentials within the perimeter
* Restricting access to the Google Cloud console and GCP APIs to requests originating from corporate IP ranges or corporate-managed devices, applied via IAM Conditions using access levels
* Requiring re-authentication (session controls) and specific credential strength (e.g., phishing-resistant FIDO2 hardware keys) for access to high-sensitivity GCP services using credential strength policies
* Allowing service accounts and Cloud Functions to access VPC Service Controls-protected data by creating identity-only access levels that whitelist specific service account identities
* Delegating perimeter and access level management to individual teams using scoped access policies at the folder or project level, without granting them organization-level Access Context Manager admin permissions
* Using certificate-based access (CBA) to enforce mutual TLS requirements — granting access only from devices presenting a valid enterprise certificate managed by Endpoint Verification
* Integrating custom third-party signals (e.g., EDR tool compliance status) into access level conditions using CEL custom access levels to make access decisions based on data from external security systems
