---
cloud_provider: "GCP"
service_category: "ai_ml"
service_name: "Vertex AI Search"
pricing_model: "per-request"
managed: true
tier: 2
---
## GCP Vertex AI Search

### Description
Vertex AI Search (formerly Enterprise Search / Generative AI App Builder) is GCP's fully managed search and recommendations platform that combines Google-quality semantic search with generative AI answers. It allows developers to build search applications over their own data without machine learning expertise, using the Discovery Engine API. The platform supports multiple search modes: custom search over unstructured documents, structured data, and public websites; media search and recommendations for video/news/music content; and healthcare search over FHIR R4 data stores with clinical relevance ranking. Generative AI features include AI-generated answer summaries, multi-turn conversational search with follow-ups, grounded answer generation using RAG, and a ranking API for improving retrieval quality. Data can be ingested from Cloud Storage, BigQuery, websites (via sitemap or crawl), or FHIR APIs, and the service supports custom embeddings for fine-tuned relevance. Self-learning ranking models improve over time using clickstream user events. Vertex AI Search powers the search capabilities inside Vertex AI Agent Builder and Conversational Agents data store tools.

### Use Cases
* Deploying enterprise document search portals over proprietary content (PDFs, HTML, structured JSON) with natural language queries, AI-generated summaries, and extractive snippet highlighting
* Building AI-powered FAQ and support search for customer service sites, with conversational follow-up questions and grounded generative answers backed by internal knowledge bases
* Implementing media discovery and recommendation systems for video streaming, news platforms, or music services using personalized recommendation models trained on user events
* Creating healthcare search applications that query FHIR R4 clinical records using natural language without prior FHIR query syntax knowledge, with context-aware clinical relevance scoring
* Embedding a search widget into web applications or internal portals via the JavaScript widget SDK, with faceted filtering, autocomplete, and configurable result ranking
* Powering RAG pipelines by using Vertex AI Search as a retrieval backend integrated with Vertex AI and Gemini models for grounded generative responses over enterprise data
