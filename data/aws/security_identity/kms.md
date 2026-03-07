---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "KMS"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS Key Management Service (KMS)

### Description
AWS Key Management Service (KMS) is a fully managed service for creating and controlling cryptographic keys used to encrypt and digitally sign data across AWS workloads and applications. KMS integrates natively with over 100 AWS services, enabling server-side encryption with a single configuration option. Keys can be AWS-managed, customer-managed (CMKs), or imported, and all key operations are logged to AWS CloudTrail for auditability. KMS supports both symmetric (AES-256) and asymmetric (RSA, ECC) keys.

### Use Cases
* Encrypting data at rest across AWS services (e.g., S3 SSE-KMS, EBS volume encryption, RDS encryption)
* Signing and verifying digital signatures with asymmetric key pairs
* Generating data encryption keys for client-side encryption in application code
* Meeting compliance requirements by maintaining full control and auditability of encryption key usage
* Implementing envelope encryption with customer-managed keys for fine-grained access control
