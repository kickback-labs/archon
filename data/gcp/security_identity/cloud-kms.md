---
cloud_provider: "GCP"
service_category: "security_identity"
service_name: "Cloud KMS"
pricing_model: "per-request"
managed: true
tier: 1
---
## GCP Cloud Key Management Service (Cloud KMS)

### Description
Google Cloud Key Management Service (Cloud KMS) is a fully managed, centralized cryptographic key management service for creating, importing, rotating, and using encryption keys within Google Cloud and in custom applications. Cloud KMS supports three protection levels: software keys (FIPS 140-2 Level 1), hardware keys via Cloud HSM (FIPS 140-2 Level 3, multi-tenant or single-tenant), and external keys via Cloud External Key Manager (Cloud EKM) that never leave your own key management system. Keys integrate with 40+ GCP services through Customer-Managed Encryption Keys (CMEK), giving you control over key lifecycle, access policies, and rotation schedules while Google handles infrastructure. Cloud KMS Autokey can automatically provision and assign keys as part of resource creation, reducing operational overhead. All key operations (admin and data access) are logged in Cloud Audit Logs.

### Use Cases
* Enabling CMEK on BigQuery datasets, Cloud Storage buckets, or GKE clusters so that Google cannot decrypt data without your actively-enabled key
* Generating or importing HSM-backed keys (FIPS 140-2 Level 3) for regulated workloads requiring hardware-level key protection (PCI-DSS, FedRAMP High)
* Using Cloud EKM to keep key material on-premises or in a third-party HSM (e.g., Thales, Fortanix) while allowing GCP services to reference it, giving you a cryptographic kill-switch via key revocation
* Performing envelope encryption in application code — using Cloud KMS to encrypt data encryption keys (DEKs), with DEKs used locally to encrypt application data
* Signing container images or software artifacts with asymmetric keys for Binary Authorization and supply chain integrity verification
* Automatically rotating symmetric CMEK keys on a configurable schedule and re-encrypting protected data, meeting key-rotation compliance mandates
