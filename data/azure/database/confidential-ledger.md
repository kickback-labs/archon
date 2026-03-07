---
cloud_provider: "Azure"
service_category: "database"
service_name: "Azure Confidential Ledger"
pricing_model: "on-demand"
managed: true
tier: 3
---
## Azure Confidential Ledger

### Description
Azure Confidential Ledger is a highly secure, immutable, append-only data store for managing sensitive records that require cryptographic proof of integrity. It runs exclusively on hardware-backed Intel SGX secure enclaves (confidential computing), meaning the data processing environment cannot be tampered with even by Microsoft. Each ledger spans three or more identical enclave instances with integrity maintained through a consensus-based blockchain derived from the Confidential Consortium Framework (CCF). Every transaction produces a cryptographic receipt containing Merkle tree proof that can be independently verified — giving auditability guarantees that cannot be forged by any party, including the cloud operator. TLS 1.3 connections terminate inside the enclave, eliminating man-in-the-middle risks. Data can be stored as private (encrypted) or public (plaintext) ledger entries, and the service exposes a REST API with SDKs for .NET, Java, Python, and JavaScript. User authentication supports both Microsoft Entra ID and certificate-based credentials with custom RBAC managed within the ledger itself (not delegated to Azure RBAC), minimizing the Trusted Computing Base. Data is replicated across Azure availability zones for resiliency and to an Azure regional pair for disaster recovery. Ledger names must be globally unique, the ledger type (private/public) is immutable after creation, and deletion is a permanent hard-delete with no recovery path.

### Use Cases
* Storing cryptographically verifiable digests and hashes of Azure SQL Database tables (via the SQL ledger feature) to provide end-to-end data integrity protection for regulated relational data, where the ledger acts as a tamper-proof external digest store
* Maintaining an immutable, hardware-attested audit trail of system records (e.g., production deployment logs, access permission changes, security alerts) that must be provably unaltered and selectively shareable with auditors
* Recording confidential transactional records (e.g., inter-party financial transfers, contract edits) where both confidentiality and non-repudiation are required and no party — including the cloud provider — should be able to alter history
* Acting as an integrity anchor for Azure Blob Storage operations by storing cryptographic signatures of blob contents, enabling verifiable detection of unauthorized modifications for compliance and archival use cases
* Regulatory compliance scenarios (financial services, healthcare, government) requiring append-only records with blockchain-based tamper evidence and cryptographic receipts that can be presented to external auditors without exposing full data
* Hardware supply chain assurance: recording hardware security metadata with cryptographic attestation to verify that infrastructure components have not been tampered with (as used by Microsoft's own Azure hardware attestation program)
