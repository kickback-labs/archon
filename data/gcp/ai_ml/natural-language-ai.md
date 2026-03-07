---
cloud_provider: "GCP"
service_category: "ai_ml"
service_name: "Natural Language AI"
pricing_model: "per-request"
managed: true
tier: 2
---
## GCP Natural Language AI

### Description
Cloud Natural Language API is GCP's fully managed REST API for applying Google's natural language understanding models to text. It provides six core analysis features: sentiment analysis (document- and sentence-level emotional polarity with score and magnitude), entity analysis (recognition and classification of named entities such as persons, locations, organizations, works of art, and consumer goods, with Wikipedia knowledge base links), entity sentiment analysis (combines entity recognition with per-entity sentiment scoring), syntactic analysis (sentence extraction, tokenization, part-of-speech tagging, lemmatization, and dependency parse tree construction), content classification (categorization of text into over 700 predefined IAB categories), and text moderation (detecting sensitive content such as toxic language, violence, and sexual content). Input text can be passed directly or referenced from Cloud Storage; the API auto-detects language or accepts a specified language code. The API is stateless and per-document, priced per 1,000 characters of text, with a free monthly tier.

### Use Cases
* Analyzing sentiment of customer reviews, support tickets, or social media posts at scale to track brand perception and prioritize negative feedback for human review (e.g., batch processing millions of product reviews via Cloud Storage input)
* Extracting named entities from unstructured documents — contracts, news articles, medical notes — for downstream indexing, structured data enrichment, or knowledge graph population
* Classifying large document corpora into content categories for content moderation, news aggregation, or audience targeting using the `classifyText` method against IAB taxonomy
* Performing syntactic dependency parsing to analyze sentence structure for translation preprocessing, grammatical rule checking, or information extraction pipelines
* Building entity-aware sentiment systems that determine per-entity sentiment in mixed-opinion text (e.g., "the battery is great but the camera is poor" → two entities with opposing scores)
* Moderating user-generated content by detecting toxic, violent, or sexually explicit text before publishing, integrated into a Cloud Functions or Cloud Run event-driven pipeline
