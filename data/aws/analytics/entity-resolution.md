---
cloud_provider: "AWS"
service_category: "analytics"
service_name: "Entity Resolution"
pricing_model: "per-request"
managed: true
tier: 3
---
## AWS Entity Resolution

### Description
AWS Entity Resolution is a managed service that matches, links, and deduplicates related records across multiple data sources using configurable rule-based matching, ML-based matching, or third-party data service provider integrations. It is designed for use cases where customer, product, healthcare, or business records are fragmented across multiple systems, channels, or datasets, and need to be unified without building and maintaining custom data engineering pipelines. The service reads records in-place from S3 or Glue Data Catalog tables, minimizing data movement and reducing privacy risk. Rule-based matching allows precise deterministic matches using exact or fuzzy field comparisons; ML-based matching uses a preconfigured model to find probabilistic matches across all input records. Third-party provider integrations (LiveRamp, TransUnion, UID 2.0, and others) allow records to be linked against industry-standard identity graphs or enriched with additional consumer attributes in a few clicks. Workflows can process records in near real-time or as batch jobs. Pricing is per-record processed. Entity Resolution is commonly used in advertising, retail, healthcare, and financial services for identity resolution, customer data platform (CDP) use cases, and data quality improvement.

### Use Cases
* Customer identity resolution (e.g., unify customer records from a CRM, e-commerce platform, mobile app, and loyalty program into a single customer profile)
* Deduplicating records for ML training data (e.g., remove duplicate patient records before training a clinical outcome prediction model)
* Advertising identity graph linking (e.g., use LiveRamp integration to translate first-party identifiers into interoperable Ramp IDs for campaign activation)
* Product catalog harmonization (e.g., match SKUs, UPCs, and internal product IDs across multiple suppliers into a unified product record)
* Healthcare record linkage (e.g., match patient records across hospital systems using fuzzy name, date-of-birth, and address matching)
* Customer enrichment (e.g., use TransUnion integration to enhance customer records with demographic or behavioral attributes for audience segmentation)
* Fraud detection (e.g., link financial accounts and transactions that belong to the same underlying entity across different data stores)
* Supply chain data reconciliation (e.g., link vendor and inventory records across procurement, warehouse, and logistics systems)
