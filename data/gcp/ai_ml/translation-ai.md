---
cloud_provider: "GCP"
service_category: "ai_ml"
service_name: "Translation AI"
pricing_model: "per-request"
managed: true
tier: 2
---
## GCP Translation AI

### Description
Cloud Translation AI is GCP's fully managed neural machine translation service that dynamically translates text, HTML, and documents across 189 languages via the Cloud Translation API. It comes in two editions: Basic (simple text translation, language detection) and Advanced (domain-specific customization, glossaries, batch translation, formatted document translation, and custom AutoML models). The Advanced edition also supports Translation Large Language Model (LLM) mode for conversational or social media text, and Adaptive Translation, which uses LLMs combined with a small dataset of customer-provided examples to deliver nuanced, style-consistent translations without training a full custom model. A companion product, Translation Hub, provides a no-code enterprise document translation platform with workflow management, human review integration, format retention, and machine translation quality prediction (MTQP) scores. The first 500,000 characters per month sent to the NMT translation API are free; LLM and Adaptive Translation are billed separately at higher per-character rates.

### Use Cases
* Translating website content, mobile app UI strings, and user-generated comments into 189 languages at scale using the Translation API Basic or Advanced edition with batch translate for high-volume asynchronous workloads
* Processing and translating formatted enterprise documents (Google Workspace, Microsoft Office, PDF) with layout and structure preservation using the Translation API Advanced document translation endpoint, maintaining tables, headings, and formatting in the output
* Building a multilingual customer support pipeline by combining Translation AI with Customer Engagement Suite (CCAI) to translate live phone or chat interactions between customers and agents speaking different languages in real time
* Producing localized video subtitles by chaining Speech-to-Text for audio transcription, Translation AI for language conversion, and Transcoder API to embed translated SRT subtitle tracks into output video files
* Achieving domain-specific translation accuracy for legal, medical, or technical documents by training a custom AutoML translation model using Translation API Advanced or by leveraging Adaptive Translation with curated glossary examples
* Using Translation Hub as a no-code enterprise document translation platform for procurement, legal, or HR teams needing workflow management, human post-editing review, and format retention without custom development
* Detecting the source language of incoming user content automatically using the language detection endpoint, then routing to the appropriate translation model and downstream processing pipeline
