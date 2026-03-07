---
cloud_provider: "GCP"
service_category: "security_identity"
service_name: "Certificate Authority Service"
pricing_model: "on-demand"
managed: true
tier: 3
---
## GCP Certificate Authority Service (CAS)

### Description
Google Cloud Certificate Authority Service (CAS) is a highly available, scalable managed service for deploying, managing, and automating private Public Key Infrastructure (PKI). It enables organizations to create and operate private certificate authorities (CAs) without managing the underlying hardware, HSMs, or CA software. CAS supports two tiers: DevOps (for high-volume automated issuance, lower durability requirements) and Enterprise (for compliance-grade CAs with hardware-backed key storage via Cloud HSM, OCSP, and CRL support). CA pools group multiple CAs under a single endpoint for load balancing and CA rotation without re-configuring clients. Certificate templates allow administrators to define reusable issuance policies — including allowed SANs, key usages, extended key usages, and constraint extensions — to enforce consistent certificate profiles across workloads. Subordinate CAs can be chained to on-premises root CAs to integrate with existing PKI trust hierarchies. CAS integrates natively with Kubernetes via cert-manager, with Anthos Service Mesh for workload identity certificates (SPIFFE/X.509-SVIDs), with Cloud Run and GKE, and with HashiCorp Vault. All CA operations are logged to Cloud Audit Logs. Pricing is per CA active per month plus per certificate issued.

### Use Cases
* Building a private PKI for internal TLS — issue server and client certificates to GKE workloads, Cloud Run services, or internal APIs, replacing self-signed certificates or public CA certificates that expose internal names
* Issuing SPIFFE workload identity certificates to Anthos Service Mesh or Istio sidecars at high throughput using DevOps-tier CA pools for automatic mTLS between microservices
* Integrating a GCP-hosted subordinate CA beneath an existing on-premises root CA to extend enterprise trust into cloud workloads without replacing the existing PKI root
* Automating Kubernetes TLS certificate lifecycle with cert-manager and the CAS issuer plugin, ensuring certificates are renewed before expiry and revoked on pod deletion
* Enforcing fine-grained certificate issuance policies via certificate templates (e.g., restricting DNS SANs to *.internal.example.com, requiring client authentication EKU) to prevent unauthorized certificate profiles
* Meeting compliance requirements (FedRAMP, PCI-DSS, HIPAA) that mandate hardware-backed CA keys by using Enterprise-tier CAs backed by Cloud HSM FIPS 140-2 Level 3 HSMs
* Delegating CA administration at folder or project scope using scoped IAM policies so individual teams can manage their own subordinate CAs without org-level admin access
* Replacing HashiCorp Vault's built-in CA with CAS as a backend via the Vault PKI plugin, centralizing certificate lifecycle management while keeping Vault as the secrets interface
* Issuing IoT device certificates at scale for large fleets using DevOps-tier CA pools capable of thousands of issuances per second, with automated revocation via CRL or OCSP
