---
cloud_provider: "Azure"
service_category: "ai_ml"
service_name: "Azure Language Service"
pricing_model: "per-request"
managed: true
tier: 2
---
## Azure Language Service

### Description
Azure Language Service (officially "Azure Language in Foundry Tools", formerly Azure AI Language) is a fully managed NLP service that provides task-optimized AI models for understanding and processing text at scale via REST APIs, SDKs, and the Microsoft Foundry portal. Prebuilt capabilities include named entity recognition (NER), PII detection and redaction, sentiment analysis, key phrase extraction, text summarization (extractive and abstractive), and Text Analytics for Health — which converts unstructured clinical notes into structured insights. Customizable capabilities include Conversational Language Understanding (CLU) for intent classification and entity extraction, Custom Named Entity Recognition, and Custom Question Answering for FAQ-style bots. All custom models are multilingual: train in one language and infer in 100+. The service operates on state-of-the-art transformer-based LLMs and SLMs and integrates with Azure OpenAI to improve RAG quality through preprocessing steps such as PII removal and chunk summarization. Pricing is per text record for inference plus training-hour and model-hosting fees for custom models.

### Use Cases
* PII detection and redaction before storing or forwarding sensitive data in compliance-bound architectures (e.g., HIPAA workflows)
* Named entity extraction to ground AI agents with precise factual values, reducing hallucinations
* Abstractive summarization of long call center conversations and meeting transcripts (e.g., topic segmentation + chapter generation)
* Building multilingual conversational AI with CLU for intent classification and Custom Question Answering for enterprise FAQ bots
* Healthcare text analytics — converting doctor's notes, discharge summaries, and EHR text into structured clinical insights
* Preprocessing documents for RAG pipelines — extracting key phrases and entities to improve retrieval quality
* Classifying and routing inbound customer requests in contact centers based on detected intent
