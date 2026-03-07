---
cloud_provider: "Azure"
service_category: "ai_ml"
service_name: "Azure Computer Vision"
pricing_model: "per-request"
managed: true
tier: 2
---
## Azure Computer Vision

### Description
Azure Computer Vision (officially "Azure Vision in Foundry Tools", formerly Azure AI Vision) is a fully managed vision AI service that provides prebuilt and customizable computer vision APIs accessible via REST, SDKs, and the Microsoft Foundry portal. Core capabilities include Image Analysis (image captioning, object detection, image tagging, smart crop, and scene classification against a 10,000+ concept taxonomy), Optical Character Recognition (OCR for printed and handwritten text across mixed languages and writing styles from images and PDFs), Spatial Analysis (real-time people-presence detection, movement tracking, and zone/line-crossing events from live video streams without storing or transmitting video), and Face API (facial detection, liveness detection, and identity verification). Custom Vision functionality — for domain-specific image classification and object detection — is now superseded by the model customization capability within Azure Vision, which offers improved accuracy and few-shot learning from as little as one labeled image per class. The service integrates with Azure Content Understanding for multimodal document and video processing. Pricing is per-transaction for image analysis and OCR, and per-frame for spatial analysis.

### Use Cases
* Automated document and invoice processing — OCR extraction of printed and handwritten text from scanned documents (e.g., invoice validation, form digitization)
* Image tagging and captioning for digital asset management and content discoverability in retail, media, and e-commerce
* Spatial analysis for retail analytics — tracking foot traffic, zone dwell time, and queue length from CCTV video streams
* Facial liveness detection and identity verification for secure onboarding and authentication workflows
* Custom image classification for domain-specific inspection tasks (e.g., manufacturing defect detection, medical imaging)
* Real-time object detection in IoT and edge scenarios via containerized deployment of Vision models
* Generating alt-text and accessibility metadata for images in CMS and publishing platforms
