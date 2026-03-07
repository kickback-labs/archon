---
cloud_provider: "AWS"
service_category: "analytics"
service_name: "DataZone"
pricing_model: "on-demand"
managed: true
tier: 3
---
## Amazon DataZone

### Description
Amazon DataZone is a data management and governance service that enables organizations to catalog, discover, share, and govern data stored across AWS services, on-premises systems, and third-party sources through a unified business data catalog and self-service portal. It is designed to bridge the gap between data producers (engineers, data stewards) and data consumers (analysts, data scientists, business users) by providing a governed, searchable catalog with fine-grained access controls and an approval workflow for data access requests. Administrators and data stewards manage access using fine-grained controls, ensuring data is available with the right level of privileges and context. DataZone integrates with Athena, Redshift, Glue, Lake Formation, and S3, and supports data discovery across these sources without requiring data movement. The service organizes work through projects — collaborative spaces where teams share data assets, ML models, and analytics tools. A web-based portal (DataZone portal) provides a personalized view for each user to discover, prepare, transform, analyze, and visualize data. Machine learning automates data discovery and cataloging. DataZone is being superseded by Amazon SageMaker Catalog within the SageMaker Unified Studio, which offers the same functionality under a unified ML and data platform umbrella.

### Use Cases
* Enterprise data catalog and self-service data discovery (e.g., analysts search for datasets by business term or sensitivity label without knowing underlying storage locations)
* Cross-team data sharing with governed access workflows (e.g., a data producer publishes a table; a consumer requests access and an admin approves with time-bound permissions)
* Data mesh implementation on AWS (e.g., domain-oriented data ownership with producers publishing to a central catalog consumed by other business domains)
* Compliance and access auditing (e.g., track which users accessed which datasets and when, with logs integrated into CloudTrail)
* Collaboration across data engineering and business teams (e.g., projects that combine Glue ETL jobs, Athena queries, and Redshift access in one workspace)
* Managing ML model and feature sharing across teams (e.g., data scientists publish curated feature datasets for consumption by other ML teams)
* Hybrid and multi-source data governance (e.g., catalog on-premises data alongside S3-backed lakes and Redshift warehouses from a single interface)
