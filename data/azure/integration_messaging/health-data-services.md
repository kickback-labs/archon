---
cloud_provider: "Azure"
service_category: "integration_messaging"
service_name: "Health Data Services"
pricing_model: "on-demand"
managed: true
tier: 3
---
## Azure Health Data Services

### Description
Azure Health Data Services is a managed platform-as-a-service (PaaS) offering that enables healthcare organizations to collect, store, and analyze health data from disparate sources in a unified, standards-compliant workspace. It consolidates three specialized managed API services—FHIR service, DICOM service, and De-identification service—into a single workspace that can be governed with shared networking (private link) and access control (Microsoft Entra RBAC) policies. The FHIR service provides an enterprise-grade, FHIR R4-compliant REST API endpoint for storing and querying clinical data, with SMART on FHIR authorization, customer-managed keys, and high availability. The DICOM service offers a DICOMweb-compatible cloud store for medical imaging data (radiological images and reports), scalable to petabytes with automatic geo-redundant replication. The De-identification service uses machine learning to automatically detect and redact, surrogate, or tag protected health information (PHI) from unstructured clinical text such as clinical notes, transcripts, and trial studies, supporting HIPAA Safe Harbor and Expert Determination methods. Azure Health Data Services is the strategic successor to Azure API for FHIR, which is retiring September 30, 2026. It integrates with Azure Data Factory, Azure Databricks, Azure Machine Learning, and Power BI for downstream analytics and AI pipelines on de-identified clinical data.

### Use Cases
* Building FHIR-compliant patient data repositories that aggregate EHR data from multiple hospital systems for interoperability and patient access apps (e.g., using SMART on FHIR for patient-facing mobile apps)
* Storing and serving medical imaging data (CT scans, MRIs, X-rays) to DICOMweb-enabled radiology viewers and AI diagnostic tools
* De-identifying clinical notes and discharge summaries at scale to create HIPAA-compliant datasets for research, secondary analytics, or AI model training
* Ingesting IoT device and wearable sensor data via MedTech service integration, converting proprietary device data to FHIR Observation resources for longitudinal patient monitoring
* Constructing unified patient 360 views by joining FHIR clinical data with claims and lab data in Azure Synapse Analytics or Microsoft Fabric
* Supporting population health analytics pipelines that export de-identified FHIR bundles to Azure Data Lake Storage Gen2 for cohort analysis and outcomes research
* Meeting regulatory compliance requirements (HIPAA, HITRUST, ISO 27001) for protected health information with private endpoint networking and customer-managed encryption keys
* Migrating from legacy HL7v2 or C-CDA document formats to FHIR using built-in conversion capabilities, reducing integration complexity with downstream clinical applications
