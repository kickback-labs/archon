---
cloud_provider: "GCP"
service_category: "security_identity"
service_name: "Secret Manager"
pricing_model: "per-request"
managed: true
tier: 1
---
## GCP Secret Manager

### Description
Google Cloud Secret Manager is a fully managed secrets storage and credential management service that lets you store, access, version, and audit sensitive data such as API keys, passwords, certificates, and connection strings. Secrets are encrypted at rest (AES-256) and in transit (TLS) using Google-managed keys by default; Customer-Managed Encryption Keys (CMEK) via Cloud KMS are supported for additional control. Each secret is a named resource containing one or more versioned payloads, enabling rollback to prior known-good values and gradual secret rotation. Access is governed by fine-grained Cloud IAM roles and conditions, with all access events recorded in Cloud Audit Logs.

### Use Cases
* Storing and retrieving application credentials (database passwords, API keys, OAuth tokens) at runtime from GKE, Cloud Run, Compute Engine, or Cloud Functions without hardcoding secrets in code or container images
* Rotating secrets automatically on a schedule using Pub/Sub rotation notifications, then updating applications via version aliases without redeployment
* Enforcing data residency by creating regional secrets pinned to a specific Google Cloud region to satisfy data sovereignty regulations
* Granting per-secret IAM access so individual microservices can only read the specific secrets they need (least-privilege isolation)
* Auditing all secret access events via Cloud Audit Logs for SOC 2, PCI-DSS, and ISO 27001 compliance evidence
