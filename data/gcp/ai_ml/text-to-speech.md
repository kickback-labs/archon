---
cloud_provider: "GCP"
service_category: "ai_ml"
service_name: "Text-to-Speech"
pricing_model: "per-request"
managed: true
tier: 2
---
## GCP Text-to-Speech

### Description
Cloud Text-to-Speech is a fully managed API that converts text or SSML (Speech Synthesis Markup Language) into natural-sounding audio using Google's AI models. It offers three voice families: Gemini-TTS (steerable via natural language prompts for style, tone, pace, and emotion across 75+ locales), Chirp 3 HD voices (high-quality, low-latency streaming voices with humanlike disfluencies and emotional range built on AudioML), and Chirp 3 Instant Custom Voice (personalized voice models created from as little as 10 seconds of audio input). The library spans 380+ voices across 75+ languages and variants, including Neural2, Studio, and WaveNet voice types. SSML support allows fine-grained control over pronunciation, pauses, number formatting, and speaking style. Additional controls include pitch tuning (±20 semitones), speaking rate (0.25x–4x), volume gain, and audio profile optimization for headphones, phone lines, or smart speakers. Output formats include MP3, LINEAR16, OGG Opus, MULAW, and ALAW. Pricing is per million characters synthesized; the first 1 million WaveNet characters and 4 million standard characters per month are free.

### Use Cases
* Generating dynamic audio responses for IVR systems and voicebots in contact centers using Chirp 3 HD voices integrated with Conversational Agents (Dialogflow CX), replacing static pre-recorded audio with natural synthesized speech
* Creating audiobooks, podcasts, or narrated video content from text scripts at scale using long audio synthesis (up to 1 million bytes of input) with custom or Neural2 voices that match a brand's desired tone
* Building accessible applications (screen readers, EPGs, navigation apps) that read UI text or content aloud to users with visual impairments, using audio profile selection to optimize for device output type
* Producing multilingual dubbed or voice-over audio for video content by combining Speech-to-Text for transcription, Translation AI for language conversion, and Text-to-Speech for synthesis in the target language
* Enabling personalized voice experiences in games, interactive media, or e-learning by creating Chirp 3 Instant Custom Voices from a short audio sample to represent a specific character or instructor
* Powering real-time voice interfaces on IoT devices (smart speakers, in-car assistants, TVs) using streaming audio synthesis with low-latency Chirp 3 HD voices and gRPC/REST API integration
* Delivering branded voice communications across customer touchpoints (notifications, automated calls, chatbot responses) using a custom voice model trained on proprietary audio recordings
