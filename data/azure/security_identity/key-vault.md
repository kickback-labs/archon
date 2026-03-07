---
cloud_provider: "Azure"
service_category: "security_identity"
service_name: "Key Vault"
pricing_model: "per-request"
managed: true
tier: 1
---
## Azure Key Vault

### Description
Azure Key Vault is a fully managed cloud service for securely storing and controlling access to secrets, encryption keys, and TLS/SSL certificates. It centralizes application secrets so that developers never embed sensitive values in code. Key Vault integrates with Microsoft Entra ID for authentication and supports Azure RBAC for fine-grained authorization. It offers two tiers: Standard (software-backed, FIPS 140 Level 1) and Premium (HSM-protected keys with FIPS 140-3 Level 3 validation via Marvell LiquidSecurity HSMs). Contents are automatically replicated within and across Azure regions for high availability, and logging can be streamed to Azure Monitor or Event Hubs.

### Use Cases
* Secrets management — store database connection strings, API keys, and passwords and reference them securely from App Service, Azure Functions, or AKS without hard-coding values
* Encryption key management — create, rotate, and revoke customer-managed keys (CMK) for encrypting Azure Storage, Azure SQL, and Disk Storage at rest
* TLS/SSL certificate lifecycle management — auto-enroll, renew, and deploy certificates from public CAs to Azure Application Gateway, Front Door, or App Service
* HSM-protected key operations for regulated workloads (e.g., financial or healthcare) requiring FIPS 140-3 Level 3 hardware protection (Premium tier)
* Threat detection via Microsoft Defender for Key Vault — alerts on anomalous access patterns such as access from unusual IPs or bulk secret exports
* Disk Encryption integration — supply keys for Azure Disk Encryption to protect VM OS and data disks
* Segregating secrets per application or team by provisioning separate vaults with independent access policies
