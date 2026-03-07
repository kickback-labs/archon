---
cloud_provider: "GCP"
service_category: "security_identity"
service_name: "Cloud IAM"
pricing_model: "subscription"
managed: true
tier: 1
---
## GCP Identity and Access Management (IAM)

### Description
Google Cloud IAM is the centralized access control system for all GCP resources. It lets you define *who* (principal: Google Account, service account, Google group, or federated identity) can do *what* (role: a collection of permissions) on *which resource* (project, folder, organization, or individual service resource). Access is enforced through allow policies (role bindings), deny policies, and principal access boundary (PAB) policies attached to resources in GCP's hierarchical resource model; child resources inherit the allow policies of their parents. IAM supports predefined roles (managed by GCP services), custom roles (user-defined permission sets), conditional role bindings (attribute-based, time-limited access via IAM Conditions), and Privileged Access Manager (PAM) for auditable just-in-time temporary access. Workload authentication uses service accounts and Workload Identity Federation (for external workloads on AWS, Azure, Kubernetes, or CI/CD pipelines), eliminating the need for service account keys in most scenarios.

### Use Cases
* Granting least-privilege access to GCP resources by assigning predefined or custom roles to users, groups, or service accounts at the project or resource level
* Federating on-premises or third-party identities (Entra ID, Okta, SAML/OIDC providers) into GCP using Workforce Identity Federation for SSO without duplicating accounts
* Authenticating workloads running on AWS, Azure, or Kubernetes to GCP APIs via Workload Identity Federation instead of downloading service account key files
* Enforcing time-limited or condition-based access (e.g., break-glass access to production, region-restricted resource access) using IAM Conditions and PAM
* Auditing all IAM policy changes and authentication events via Cloud Audit Logs for compliance (SOC 2, PCI-DSS, ISO 27001)
