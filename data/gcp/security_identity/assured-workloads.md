---
cloud_provider: "GCP"
service_category: "security_identity"
service_name: "Assured Workloads"
pricing_model: "subscription"
managed: true
tier: 2
---
## GCP Assured Workloads

### Description
Assured Workloads enables organizations to deploy and operate sensitive workloads on Google Cloud while meeting regulatory, data residency, and sovereignty requirements — without the need for dedicated government cloud infrastructure. It works by applying predefined **control packages** to Google Cloud folders, which enforce guardrails on all projects and resources within those folders via organization policy constraints. Control packages cover two main categories: **regional data boundaries** (restrict where data can be stored, e.g., EU Data Boundary, US Data Boundary) and **regulatory data boundaries** (enforce compliance frameworks such as FedRAMP Moderate, FedRAMP High, CJIS, ITAR, IL2/IL4/IL5, IRS 1075, HIPAA/HITRUST, and Canada Protected B). Additional capabilities include personnel data access controls (restricting which Google support staff can access customer data), encryption key management controls (supporting Google-managed keys, CMEKs, Cloud EKM, and Cloud HSM), Access Approval (requiring explicit customer approval before Google personnel access data), Access Transparency (audit logs of Google personnel activity), Key Access Justifications (approve or deny specific key access requests), and violation monitoring with email alerting. Sovereign Controls by Partners (via certified local partners) is also available for select regions.

### Use Cases
* Deploy regulated workloads for US federal agencies under FedRAMP High or Impact Level 5 (IL5) requirements, with controls enforcing data residency to US regions and enhanced personnel vetting
* Ensure GDPR and EU data sovereignty compliance by applying the EU Data Boundary control package, which restricts all data storage to EU-only regions and controls Google support access
* Meet HIPAA and HITRUST requirements for healthcare workloads (e.g., a hospital system migrating EHR data to BigQuery) using the US Data Boundary for Healthcare and Life Sciences control package
* Satisfy ITAR requirements for defense contractors by applying a control package that mandates CMEK encryption, US-only data residency, and US-personnel-only support access
* Enforce data residency for Australian or Canadian financial services regulators with regional data boundary packages that include assured support personnel controls
* Monitor deployed Assured Workloads folders for organization policy violations and receive proactive email alerts when a resource is misconfigured or drifts out of compliance
* Use Key Access Justifications with Cloud EKM to retain the ability to approve or deny every Google request to use customer encryption keys, providing cryptographic access control for sovereignty-sensitive workloads
