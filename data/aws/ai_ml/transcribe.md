---
cloud_provider: "AWS"
service_category: "ai_ml"
service_name: "Transcribe"
pricing_model: "per-request"
managed: true
tier: 2
---
## AWS Transcribe

### Description
Amazon Transcribe is a fully managed automatic speech recognition (ASR) service that converts audio to text for both streaming (real-time) and batch (recorded) workloads. It is powered by a multi-billion parameter speech foundation model trained on millions of hours of audio across 100+ languages, supporting high-accuracy transcription even in noisy environments or with varied accents. Key features include automatic punctuation, speaker diarization, word-level confidence scores, custom vocabulary, vocabulary filters, content redaction for PII, and custom language models. Transcribe Call Analytics adds generative AI-powered summaries, sentiment scoring, and call characteristics detection for contact center use cases. Amazon Transcribe Medical is a HIPAA-eligible variant trained on clinical terminology.

### Use Cases
* Contact center analytics: transcribe customer calls and extract sentiment, categories, and AI-generated summaries (e.g., with Amazon Connect)
* Subtitle and caption generation for on-demand video content, broadcasts, and meeting recordings
* Clinical documentation: capture patient-clinician conversations and populate EHR systems via Transcribe Medical and AWS HealthScribe
* Toxic content detection in gaming and social media peer-to-peer audio streams
* Search and discoverability: convert podcast or video archives to searchable text
* Build voice-enabled applications by transcribing real-time speech for downstream NLP processing
* Compliance recording: create accurate transcripts of regulated calls with PII redaction
