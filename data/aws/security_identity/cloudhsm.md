---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "CloudHSM"
pricing_model: "on-demand"
managed: true
tier: 3
---
## AWS CloudHSM

### Description
AWS CloudHSM provides dedicated, single-tenant Hardware Security Module (HSM) appliances in the AWS cloud, allowing you to generate and use cryptographic keys on FIPS 140-2 Level 3 validated hardware. Unlike AWS KMS (which uses shared, multi-tenant infrastructure managed by AWS), CloudHSM gives you exclusive control over the HSM and its keys — AWS has no visibility into or access to your key material. HSMs are deployed inside your VPC and run in clusters of two or more for high availability. You manage the HSMs yourself using industry-standard APIs (PKCS#11, JCE, CNG, OpenSSL Dynamic Engine), and you bear full responsibility for key backup and disaster recovery. CloudHSM integrates natively with several AWS services (such as Amazon RDS for Oracle TDE and AWS Certificate Manager Private CA) and supports custom application integration via client SDKs. Pricing is per HSM per hour regardless of usage; you pay even when the HSM is idle, which makes cost management important at scale. You can shut down HSMs when not needed, provided you have retained a copy of the cluster backup in S3 to restore key material later.

### Use Cases
* Encrypt data at rest with customer-controlled keys (e.g., encrypting an Oracle RDS database using Transparent Data Encryption (TDE) with keys stored in CloudHSM)
* Offload SSL/TLS private key operations from web servers (e.g., configuring an NGINX or Apache server to use CloudHSM as the keystore for HTTPS termination, improving performance and key security)
* Act as an issuing certificate authority (e.g., storing the CA private key in CloudHSM while signing certificate requests for internal PKI infrastructure)
* Meet strict regulatory and compliance requirements for cryptographic key management (e.g., PCI-DSS, eIDAS, or HIPAA mandates requiring FIPS 140-2 Level 3 hardware)
* Custom application cryptography requiring direct HSM access via PKCS#11 or JCE (e.g., financial applications performing digital signatures or key wrapping operations at the application layer)
* High-throughput cryptographic workloads that require dedicated hardware (e.g., signing millions of tokens per day without sharing HSM capacity with other AWS customers)
* Multi-region key management by replicating CloudHSM cluster backups across regions and restoring them to new clusters as needed
