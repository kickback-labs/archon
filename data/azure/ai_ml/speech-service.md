---
cloud_provider: "Azure"
service_category: "ai_ml"
service_name: "Azure Speech Service"
pricing_model: "per-request"
managed: true
tier: 2
---
## Azure Speech Service

### Description
Azure Speech Service (officially "Azure Speech in Foundry Tools", formerly Azure AI Speech) is a fully managed, cloud-based speech platform that provides speech-to-text (STT), text-to-speech (TTS), speech translation, and speaker recognition via REST APIs, SDKs, and the Microsoft Foundry portal. STT capabilities include real-time and batch transcription, OpenAI Whisper integration for call-center transcription, custom acoustic and language model fine-tuning, and speaker diarization across 100+ languages. TTS includes neural voices with lifelike prosody, Custom Neural Voice for branded voice creation, and avatar synthesis for video-format output. The Voice Live API enables low-latency audio-in/audio-out agent integration for real-time voice agents. Speech translation supports real-time multi-language speech-to-speech and speech-to-text audio translation. The service can be deployed in the cloud or at the edge via Docker containers (embedded speech) for intermittent-connectivity scenarios. Pricing is per audio-hour for STT/translation, per character for TTS, and per transaction for speaker recognition.

### Use Cases
* Real-time transcription of call center and meeting audio with speaker diarization (e.g., automated meeting notes)
* Post-call analytics pipelines: transcribe, then extract insights via Azure Language and Azure Content Understanding
* Building voice-enabled AI agents with the Voice Live API (e.g., low-latency conversational phone bots)
* Text-to-speech for accessible content delivery and branded voice experiences (e.g., custom neural voice for IVR systems)
* Real-time multilingual speech translation for global live events, conferences, and customer support
* On-device or edge speech transcription via embedded speech containers for offline or air-gapped environments
* Video content captioning and subtitling in 100+ languages for media and e-learning platforms
