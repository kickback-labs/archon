---
cloud_provider: "AWS"
service_category: "analytics"
service_name: "Data Exchange"
pricing_model: "subscription"
managed: true
tier: 3
---
## AWS Data Exchange

### Description
AWS Data Exchange is a marketplace service that enables customers to find, subscribe to, and use third-party data products in the cloud, and enables data providers to publish and monetize their data to AWS customers. The catalog hosts over 3,500 data products from more than 300 providers across industries including financial services, healthcare, retail, advertising, media, and technology. Data products are available in three delivery formats: data files (S3 objects), data tables (Amazon Redshift tables via zero-ETL), and data APIs (accessible through API Gateway). Subscribers receive automatic data updates when a provider publishes a new revision, eliminating manual data download and integration workflows. Over 1,000 products are available for free. Once subscribed, data can be directly imported into S3 or queried from Redshift without copying, making it seamlessly usable with Athena, Glue, SageMaker, and other AWS analytics services. Providers can set flexible pricing models including free, per-unit, subscription, or metered API pricing. AWS Data Exchange also integrates with AWS Lake Formation, enabling data sharing across organizations without data movement — a feature used by AWS Clean Rooms and Lake Formation's external sharing capabilities.

### Use Cases
* Enriching internal data with third-party signals (e.g., subscribing to financial market data, geolocation data, or consumer behavior data to augment ML models)
* Financial services analytics (e.g., subscribing to FactSet, S&P Global, or Refinitiv datasets for portfolio analysis)
* Healthcare and life sciences research (e.g., accessing de-identified clinical trial or diagnostic data for drug discovery)
* Advertising and marketing analytics (e.g., acquiring third-party audience segments or brand safety data for campaign planning)
* Building data-driven applications with live API data (e.g., querying real-time event or pricing APIs without managing provider authentication)
* Eliminating custom data ingestion pipelines (e.g., automatically receiving S3 file deliveries when a provider publishes new data revisions)
* Monetizing proprietary data as a provider (e.g., publishing a proprietary dataset to 300,000+ AWS customers through the Data Exchange catalog)
* Academic and public sector research (e.g., accessing free datasets for COVID-19 analysis, weather data, or census records)
