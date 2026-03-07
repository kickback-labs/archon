---
cloud_provider: "Azure"
service_category: "ai_ml"
service_name: "Azure AI Search"
pricing_model: "subscription"
managed: true
tier: 2
---
## Azure AI Search

### Description
Azure AI Search (formerly Azure Cognitive Search) is a fully managed, enterprise-grade knowledge retrieval service designed for building retrieval-augmented generation (RAG) pipelines, AI agents, and enterprise search applications. It powers Foundry IQ — Microsoft's intelligence layer for grounding AI agents with enterprise knowledge — and supports hybrid search combining dense vector similarity (HNSW/KNN) with keyword BM25 ranking in a single query. Built-in indexers connect to Azure Cosmos DB, Azure SQL, Azure Blob Storage, SharePoint, OneLake, and external web sources; an import wizard automates chunking, enrichment, and embedding for full RAG pipelines with no custom code. The service offers semantic reranking, agentic retrieval (query planning, reasoning effort, answer synthesis), and security features including encryption at rest, network isolation, and role-based access. Pricing tiers (Basic, Standard S1–S3, Storage Optimized) scale storage and throughput independently. SLA is 99.9% for replicated deployments. Available in 30+ regions; handles over 3 billion enterprise search queries daily across the Microsoft ecosystem.

### Use Cases
* RAG pipelines grounding LLMs with proprietary enterprise data (e.g., internal knowledge bases queried by Azure OpenAI)
* Agentic retrieval via Foundry IQ — multi-source knowledge bases shared across multiple AI agents without duplicate pipelines
* Enterprise product and document search with hybrid vector + keyword queries
* Multimodal indexing of PDF, Word, PowerPoint, and image documents with OCR enrichment
* Real-time knowledge retrieval for AI chatbots and copilots integrating with Foundry Agent Service or Copilot Studio
* Semantic search over compliance documents, legal case files, or research libraries
* Feature reuse — one knowledge base connected to multiple Foundry agents and applications
