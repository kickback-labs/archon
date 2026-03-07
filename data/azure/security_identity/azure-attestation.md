---
cloud_provider: "Azure"
service_category: "security_identity"
service_name: "Microsoft Azure Attestation"
pricing_model: "per-request"
managed: true
tier: 3
---
## Azure Microsoft Azure Attestation

### Description
Microsoft Azure Attestation is a unified, highly available remote attestation service for verifying the trustworthiness of a platform and the integrity of the software running inside it before granting access to sensitive data or secrets. It supports attestation of multiple Trusted Execution Environments (TEEs): Intel SGX enclaves, Open Enclave (OE) SDK enclaves, Virtualization-based Security (VBS) enclaves, TPM-based platforms, Trusted Launch VMs (Secure Boot + vTPM monitoring), and AMD SEV-SNP–based Confidential VMs and Confidential Containers. Attestation evidence (quotes, SNP reports, TPM measurements) is validated against configurable customer policies; if valid, Azure Attestation issues a signed JWT attestation token that relying parties can use to condition access decisions. Azure Attestation itself runs inside an SGX enclave or SEV-SNP container so that critical operations (quote validation, token signing, policy evaluation) are protected from the Microsoft operator. For AMD SEV-SNP Confidential VMs, platform attestation occurs automatically during the VM boot path — no customer action is required — and is used to release disk encryption keys from Azure Managed HSM or Key Vault. Business continuity is handled via active-active regional pairs with automatic Traffic Manager failover.

### Use Cases
* Confidential VM boot integrity — automatically attest AMD SEV-SNP CVMs at boot to validate firmware measurements and release disk encryption keys from Managed HSM, ensuring the VM only starts on verified, unmodified hardware
* SGX enclave attestation for confidential computing — remotely attest Intel SGX enclaves before providing them with secrets or cryptographic keys, confirming the enclave code has not been tampered with and is running on genuine SGX hardware
* Trusted Launch VM health monitoring — install the guest attestation extension on Trusted Launch VMs to periodically submit vTPM measurements to Azure Attestation; attestation failures surface as alerts in Microsoft Defender for Cloud, indicating potential bootkit or rootkit activity
* Confidential container attestation — attest AMD SEV-SNP–protected container groups running in Azure Container Instances or AKS Confidential Containers before releasing secrets from Managed HSM; implement using the SKR sidecar container pattern
* TPM-based platform integrity — validate TPM measurements from Windows or Linux VMs/devices to confirm boot integrity is not compromised before permitting access to sensitive workloads or data stores
* Custom policy-gated secret release — define custom attestation policies (e.g., minimum enclave security version, specific MRSIGNER value) that gate Azure Attestation token issuance; downstream Key Vault or Managed HSM access policies key on these tokens
* Open Enclave SDK multi-TEE portability — use Azure Attestation as the remote attestation backend for OE SDK applications, abstracting across SGX and VBS enclave types with a single unified attestation API
