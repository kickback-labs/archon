---
cloud_provider: "AWS"
service_category: "ai_ml"
service_name: "HealthLake"
pricing_model: "on-demand"
managed: true
tier: 3
---
## AWS HealthLake

### Description
AWS HealthLake is a fully managed, HIPAA-eligible service that ingests, stores, and serves healthcare data at petabyte scale using the HL7 FHIR R4 standard as its native data model. It exposes high-throughput FHIR REST APIs that meet CMS and ONC interoperability mandates (Patient Access API, Provider Directory API, Prior Authorization API) while maintaining sub-millisecond query latency even under thousands of concurrent requests. Incoming data—whether structured claims, clinical notes, HL7 v2 messages, or C-CDA documents—is normalized to FHIR resources and optionally enriched by built-in NLP that extracts clinical entities (diagnoses, medications, procedures) and ontology codes (ICD-10, SNOMED, RxNorm) from free-text fields. HealthLake automatically exports FHIR data to Apache Iceberg format in S3, enabling zero-ETL SQL analytics via Amazon Athena or Redshift without building separate ETL pipelines. It supports SMART on FHIR for standards-based app authentication and integrates with Amazon Bedrock and SageMaker for generative AI and ML workloads over clinical data. Multi-tenant isolation, AWS KMS encryption, CloudTrail audit logging, and fine-grained IAM resource policies are built-in. Pricing is usage-based on the number of FHIR resources stored and API calls executed, with no upfront commitments.

### Use Cases
* CMS interoperability compliance: implement Patient Access, Provider Directory, and Prior Authorization FHIR APIs to satisfy CMS-0057-F and HTI-1 mandates without managing custom FHIR servers
* Real-time prior authorization: provide instant FHIR data access for concurrent utilization management workflows and CDS Hooks decision support at point of care
* Population health analytics: aggregate FHIR data from multiple EHRs and payer systems into a unified repository, then query with SQL-on-FHIR via Athena for disease surveillance and risk stratification
* AI-powered clinical applications: use the structured, NLP-enriched FHIR data foundation as input to SageMaker models or Bedrock LLMs for patient risk scoring, care gap detection, and clinical summarization
* Multi-EHR patient record unification: consolidate fragmented patient records from disparate Epic, Cerner, and Meditech instances into a single longitudinal FHIR timeline
* ISV product acceleration: enable digital health software vendors to build FHIR-native applications without standing up and scaling their own FHIR infrastructure
* Research data pipelines: export de-identified FHIR cohorts to S3/Iceberg for federated clinical trials, outcomes research, and real-world evidence studies
