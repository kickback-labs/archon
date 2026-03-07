---
cloud_provider: "AWS"
service_category: "analytics"
service_name: "Clean Rooms"
pricing_model: "on-demand"
managed: true
tier: 3
---
## AWS Clean Rooms

### Description
AWS Clean Rooms is a managed data collaboration service that enables multiple parties to jointly analyze their combined datasets without any participant sharing or exposing their underlying raw data to others. Organizations create a "clean room" — a secure environment where collaborators contribute data that stays in place in their own AWS accounts — and run agreed-upon queries against the combined view. Privacy-enhancing controls include configurable analysis rules (restrict which columns can be queried, require aggregation thresholds, prevent certain joins), AWS Clean Rooms Differential Privacy (add statistical noise to outputs), and cryptographic computing for encrypted data processing. Data can remain in S3, Redshift, or partner data stores (including Snowflake), with zero-ETL integration so no data copying is required. Collaborators use PySpark, SQL, or bring their own ML models to generate insights. Analysis logs provide a full audit trail of how each participant's data was used. AWS Clean Rooms is primarily used in advertising, media, financial services, healthcare, and research domains where data cannot be shared due to regulatory, contractual, or competitive constraints.

### Use Cases
* Advertising campaign measurement (e.g., an advertiser and a publisher match ad exposure data with conversion data to measure campaign effectiveness without sharing user-level data)
* Marketing audience planning and activation (e.g., a brand and a data provider overlap customer records to identify addressable audiences)
* Financial risk assessment (e.g., two banks jointly analyze transaction patterns for fraud detection across institutions)
* Healthcare and clinical research (e.g., multiple hospitals jointly analyze de-identified patient records to identify treatment trends)
* Customer 360 across channels (e.g., a retailer and a loyalty partner combine purchase and engagement data to form unified customer profiles)
* Competitive benchmarking (e.g., multiple companies in the same industry collaborate on aggregate market analysis without revealing individual data)
* Supply chain optimization (e.g., a manufacturer and its suppliers jointly analyze inventory and demand data under differential privacy constraints)
* ML model training on partner data (e.g., train a recommendation model on combined datasets using a bring-your-own-model workflow)
