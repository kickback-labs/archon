---
cloud_provider: "GCP"
service_category: "security_identity"
service_name: "Sensitive Data Protection"
pricing_model: "per-request"
managed: true
tier: 2
---
## GCP Sensitive Data Protection

### Description
Google Cloud Sensitive Data Protection (formerly Cloud Data Loss Prevention / Cloud DLP) is a fully managed service for discovering, classifying, and de-identifying sensitive data across Google Cloud and external sources. It provides over 200 built-in infoType detectors (PII, PHI, PCI, credentials, and more) plus support for custom regex- and dictionary-based detectors. The service operates in three modes: **discovery** (automated scanning and profiling of data assets at org/folder/project scope), **inspection** (deep per-resource scanning for exact sensitive-data locations), and **de-identification** (masking, redaction, format-preserving encryption, date-shifting, pseudonymization, and tokenization). Risk analysis capabilities compute k-anonymity, l-diversity, and other re-identification risk metrics on structured BigQuery data. All operations are available programmatically via the Cloud Data Loss Prevention API (DLP API); synchronous and asynchronous methods are both supported.

### Use Cases
* Automatically profile BigQuery, Cloud SQL, Cloud Storage, and Vertex AI datasets across an organization to identify where sensitive and high-risk data reside (e.g., discovering tables containing credit card numbers or SSNs in a data lake)
* De-identify PII before sharing data with analytics teams or external partners (e.g., tokenizing user IDs and redacting email addresses before exporting to BigQuery ML training sets)
* Inspect Cloud Storage buckets or Datastore kinds for sensitive data and publish findings to Security Command Center or Pub/Sub for SIEM ingestion
* Enforce data loss prevention in streaming pipelines by calling `content.inspect` synchronously within a Dataflow pipeline to detect and route records containing credentials or regulated data
* Compute re-identification risk scores (k-anonymity, l-diversity) on de-identified datasets to validate that de-identification is effective before external release
* Detect unencrypted secrets (API keys, private keys) in environment variables and report them to Security Command Center via the secrets discovery feature
* Tag BigQuery tables in Dataplex Universal Catalog with sensitivity labels derived from data profiling results, enabling downstream data governance policies
