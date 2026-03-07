---
cloud_provider: "GCP"
service_category: "ai_ml"
service_name: "Vertex AI Search for commerce"
pricing_model: "per-request"
managed: true
tier: 3
---
## GCP Vertex AI Search for commerce

### Description
Vertex AI Search for commerce (formerly Recommendations AI and Cloud Retail Search) is a fully managed, retail-specific AI service that delivers personalized product search and product recommendations for e-commerce websites and mobile applications. The service is powered by Google's large language models and the same machine learning infrastructure that drives Google Search and Google Shopping, enabling retailers to surface highly relevant results without building or maintaining custom ML pipelines. It ingests two core data sources — a product catalog and a stream of real-time user events (page views, add-to-cart, purchases) — and uses them to train recommendation models and to rank search results by predicted conversion likelihood. On the search side, it supports semantic query understanding, query expansion, autocomplete, faceting, guided conversational filtering, and merchandising controls (boost/bury rules, filter rules, pin rules) that can be managed through a Merchandising Console without code changes. On the recommendations side, it supports multiple model types: "Others You May Like," "Frequently Bought Together," "Recommended for You," "Recently Viewed," and "Buy It Again." A/B experiment infrastructure is built in, allowing retailers to measure the revenue impact of configuration changes before promoting them to production. Analytics and performance metrics export to BigQuery. The average integration time is measured in weeks; data quality — particularly catalog completeness and user event coverage — is the primary driver of model accuracy.

### Use Cases
* Personalized product recommendations on product detail pages, homepages, and cart pages — serving "Others You May Like" or "Frequently Bought Together" panels driven by real-time user signals and catalog embeddings
* AI-powered on-site search with semantic understanding — replacing keyword-only search to handle natural-language queries, synonyms, and misspellings and rank results by predicted purchase probability rather than simple text relevance
* Conversational product filtering — allowing shoppers to progressively narrow search results through a dialogue-style interface (e.g., "show me only red ones under $50") without reloading the page
* Autocomplete and dynamic search suggestions — surfacing trending queries and catalog-aware completions as users type, reducing zero-result searches
* Re-engagement and email recommendations — generating personalized "Buy It Again" or "Recommended for You" product lists for marketing emails, leveraging the same trained models used on the website
* Merchandising rule management — applying business rules (e.g., pinning sponsored products, burying out-of-stock items, filtering by brand contract) through a no-code Merchandising Console layered on top of AI-ranked results
* A/B testing search and recommendation strategies — comparing revenue-per-session and click-through rate between control and experiment serving configs before committing to a configuration change in production
* Real-time inventory-aware ranking — reflecting local or global inventory levels in ranking signals so that low-stock or unavailable products are automatically deprioritized without manual intervention
* Multi-language product discovery — supporting catalog and query matching across 40+ world languages using the same unified model, without separate localized deployments
* Analytics and revenue attribution — exporting search and recommendation interaction events to BigQuery for custom dashboards, funnel analysis, and attribution modeling beyond the built-in KPI dashboards
