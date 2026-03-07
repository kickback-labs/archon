---
cloud_provider: "AWS"
service_category: "ai_ml"
service_name: "Rekognition"
pricing_model: "per-request"
managed: true
tier: 2
---
## AWS Rekognition

### Description
Amazon Rekognition is a fully managed computer vision service that uses deep learning to analyze images and videos without requiring ML expertise. It provides pre-trained APIs for object and scene detection, facial analysis and comparison, face liveness detection, text extraction, custom label detection via AutoML, celebrity recognition, and video segment detection. The service scales on demand and charges per image or video minute analyzed, making it cost-effective for both small and high-volume workloads. It integrates with S3, Kinesis Video Streams, and Lambda for event-driven pipelines.

### Use Cases
* Content moderation: detect unsafe or inappropriate images and video frames (e.g., adult content filtering on UGC platforms)
* Identity verification: compare a selfie against an ID document for remote onboarding and authentication workflows
* Smart home alerts: detect persons, packages, or vehicles in live video streams and trigger automations
* Media analysis: automatically detect shot boundaries, slates, and black frames to accelerate video ad insertion
* Custom object detection: train models with as few as 10 images to detect brand logos or proprietary objects (Custom Labels)
* Security and surveillance: perform facial search against a database of known individuals in real time
* Accessibility: extract and index text from images of signs, documents, and product packaging
