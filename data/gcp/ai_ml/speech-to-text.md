---
cloud_provider: "GCP"
service_category: "ai_ml"
service_name: "Speech-to-Text"
pricing_model: "per-request"
managed: true
tier: 2
---
## GCP Speech-to-Text

### Description
Cloud Speech-to-Text is a fully managed API that converts audio into text transcriptions using Google's AI models, including the Chirp 3 foundation model trained on millions of hours of audio and billions of text sentences. It supports three recognition modes: synchronous (short audio, up to ~1 minute), asynchronous batch (long audio files via Cloud Storage), and streaming (real-time audio from a microphone or live source). The current v2 API supports 85+ languages and variants via Chirp 3, with domain-specific models available for telephony, video, and command/search use cases. Key features include automatic punctuation, speaker diarization (identifying who said what in multi-speaker audio), speech adaptation for boosting domain-specific terms, noise robustness, multichannel recognition, and profanity filtering. Enterprise features in v2 include data residency for regional deployments, customer-managed encryption keys (CMEK), and audit logging. Pricing is per minute of audio processed at $0.016/min for v2; the first 60 minutes per month are free for standard recognition.

### Use Cases
* Transcribing call center recordings for compliance archival, sentiment analysis, or quality assurance workflows by sending audio files stored in Cloud Storage through async batch recognition and outputting results to BigQuery
* Adding real-time subtitles or closed captions to live video streams or conference calls using streaming speech recognition with automatic punctuation and speaker diarization enabled
* Building voice-controlled applications and voice user interfaces (VUIs) that process microphone input via streaming recognition and feed recognized text into downstream NLP or command-dispatch logic
* Automating transcription of recorded meetings, webinars, or podcasts with speaker diarization to produce structured transcripts identifying each speaker's contributions by utterance
* Enabling multilingual transcription pipelines for global content platforms by specifying language codes and pairing with the Translation AI API to produce translated transcripts for 85+ supported languages
* Improving recognition accuracy for domain-specific terminology (medical, legal, product names) using speech adaptation phrase hints and model adaptation to bias the model toward uncommon vocabulary
* Deploying on-premises speech recognition for air-gapped or data-sovereign environments using Speech-to-Text On-Prem, which brings Google's models into customer-managed infrastructure
