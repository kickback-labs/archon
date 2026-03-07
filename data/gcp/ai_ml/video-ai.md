---
cloud_provider: "GCP"
service_category: "ai_ml"
service_name: "Video AI"
pricing_model: "per-request"
managed: true
tier: 3
---
## GCP Video AI (Video Intelligence API)

### Description
Google Cloud Video AI, exposed through the Cloud Video Intelligence API, is a fully managed, pre-trained machine learning service that automatically recognizes and annotates video content from stored or live-streamed video. The API extracts rich metadata at the video, shot, or frame level, covering more than 20,000 objects, places, and actions without requiring any custom model training. Core detection features include label detection, shot change detection, explicit content (SafeSearch) detection, object tracking, face detection, person detection, logo recognition, OCR-based text detection, and speech transcription embedded in video. A streaming annotation mode allows near-real-time analysis of live video feeds with event-based triggers on detected objects. For specialized or domain-specific content, AutoML video models can be trained and deployed through the API alongside the pre-trained models. The API is accessed via a simple REST/gRPC interface; long-running asynchronous requests write results to Cloud Storage or return them inline for short clips. Pricing is per minute of video processed, with 1,000 minutes of stored video and 1,000 minutes of streamed video free per month.

### Use Cases
* Automated video catalog indexing — analyze a media library at scale to generate searchable metadata tags (objects, scenes, actions) without manual tagging
* Content moderation — detect explicit, violent, or otherwise policy-violating content in user-generated video uploads before publishing (e.g., social media platforms, UGC marketplaces)
* Contextual advertising — identify shot-level labels to place ads that are semantically matched to the video content at the precise timestamp (e.g., inserting a sportswear ad when sports equipment is detected)
* Highlight reel generation — detect shot boundaries and significant label segments to automatically trim and assemble highlight clips from long-form content (e.g., sports broadcast summaries)
* Video archive search — enable full-text and semantic search across a petabyte-scale video library by indexing API-generated metadata into a search engine (e.g., news archives, security footage repositories)
* Brand and logo monitoring — track logo appearances and screen-time across broadcast or user content for sponsorship validation and competitive intelligence
* Compliance and safety monitoring — transcribe speech and detect text in video for accessibility compliance (closed captions) or regulatory archiving requirements (e.g., financial broadcast disclaimers)
* Live event intelligence — stream real-time annotation of live camera feeds to trigger automated workflows on object detection events (e.g., alerting when a specific object appears in a security camera frame)
* Person and face analytics — detect the presence, location, and count of people in retail or venue footage for occupancy analytics, without building a custom vision model
* E-learning content enrichment — auto-generate chapter markers, transcripts, and topic tags from educational video recordings to improve discoverability and navigation
