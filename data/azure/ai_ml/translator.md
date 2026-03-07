---
cloud_provider: "Azure"
service_category: "ai_ml"
service_name: "Translator"
pricing_model: "per-request"
managed: true
tier: 2
---
## Azure Translator

### Description
Azure Translator (part of Azure Foundry Tools, formerly Azure AI services) is a cloud-based neural machine translation service that enables real-time and batch translation of text and documents across more than 100 languages. It is powered by neural machine translation (NMT) and optionally enhanced by foundation models like GPT-4o for tone, gender, and style customization. The same translation engine powers Microsoft products including Word, Outlook, PowerPoint, Teams, and the Edge browser, making it a production-proven, enterprise-grade service. Developers can integrate translation into applications via a simple REST API with automatic language detection, bilingual dictionaries, and script transliteration. Custom Translation allows organizations to build domain-specific translation models without machine learning expertise by supplying previously translated documents. Pricing is consumption-based per character translated, with a free tier for light usage and volume discounts for high-throughput workloads. Azure Translator is also a first-class tool within the Microsoft Foundry platform, enabling multilingual agentic workflows.

### Use Cases
* Multilingual customer support portals and chatbots (e.g., translating incoming tickets and outgoing responses across 100+ languages in real time)
* Document translation at scale (e.g., batch-translating legal contracts, product manuals, or compliance documents while preserving original formatting)
* In-app localization for global SaaS products (e.g., dynamically rendering UI strings in the user's language via a single API call)
* Agentic AI workflows requiring multilingual understanding (e.g., a call-center agent that translates caller speech output before routing to a language-specific LLM)
* Domain-specific custom translation models (e.g., pharmaceutical company training a custom model on clinical trial terminology to improve accuracy over generic NMT)
* Real-time communication translation (e.g., translating chat messages in a Teams-integrated service desk application)
* Content moderation pipelines that operate across multiple languages (e.g., translating user-generated content before passing it to a content safety classifier)
