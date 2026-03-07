---
cloud_provider: "Azure"
service_category: "security_identity"
service_name: "Azure Cloud HSM"
pricing_model: "subscription"
managed: true
tier: 3
---
## Azure Cloud HSM

### Description
Azure Cloud HSM is a fully managed, FIPS 140-3 Level 3 validated, single-tenant hardware security module (HSM) service that gives customers complete administrative authority over their HSM cluster without the operational overhead of managing high availability, patching, or maintenance. Each HSM cluster consists of three HSM partitions accessed over a private, dedicated encrypted link from the customer's virtual network; Microsoft cannot access the HSM content after initial provisioning. The service automatically synchronizes keys and policies across cluster members and performs automatic failover if any HSM partition becomes unavailable. Data residency is enforced — customer data is never stored or processed outside the deployment region. Azure Cloud HSM is the successor to Azure Dedicated HSM (which accepted no new customers and is being retired July 31, 2028); it upgrades the compliance standard from FIPS 140-2 Level 3 to FIPS 140-3 Level 3 and shifts cluster management responsibility to Microsoft. It is an IaaS-only service and does not integrate with Azure PaaS/SaaS services (use Azure Key Vault Managed HSM for those scenarios).

### Use Cases
* Regulatory-mandated FIPS 140-3 Level 3 key storage — store cryptographic keys in a government- or financially-regulated environment that mandates physical HSM validation beyond what Azure Key Vault (FIPS 140-2 Level 2) provides
* Lift-and-shift of on-premises HSM workloads — migrate applications that rely on Thales-compatible HSMs from on-premises data centres or AWS Cloud HSM to Azure without refactoring application cryptographic code
* SSL/TLS offloading — protect TLS private keys in an HSM for Apache or NGINX-based workloads running on Azure VMs, eliminating key exposure in software memory
* Transparent data encryption (TDE) key protection — store the TDE master key for SQL Server or Oracle databases running on Azure VMs, ensuring the key never leaves the HSM boundary
* PKI and certificate authority (CA) private key protection — use PKCS#11 or CNG/KSP provider interfaces to protect CA private keys in Active Directory Certificate Services or third-party PKI solutions
* Code and document signing — store signing keys in a FIPS-validated boundary to meet supply-chain security and regulatory requirements for code or document integrity attestation
* Migration from Azure Dedicated HSM — existing Dedicated HSM customers can migrate workloads to Cloud HSM before the July 31, 2028 retirement deadline, retaining single-tenant isolation and full administrative control with improved compliance posture
