---
cloud_provider: "AWS"
service_category: "networking"
service_name: "CloudFront"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS CloudFront

### Description
Amazon CloudFront is a globally distributed content delivery network (CDN) with over 750 Points of Presence (PoPs) that accelerates delivery of static, dynamic, and streaming content with low latency. CloudFront caches content at edge locations and routes requests through the AWS global backbone to reduce round-trip time. It integrates natively with S3, ALB, API Gateway, Lambda@Edge, and CloudFront Functions for edge compute. Security features include HTTPS enforcement, field-level encryption, AWS Shield Standard (DDoS protection at no extra cost), WAF integration, and signed URLs/cookies for access control. Zero fees are charged for data transfer from AWS origins such as S3 and EC2.

### Use Cases
* Accelerating static website and web application delivery (e.g., SPA assets hosted on S3)
* Streaming live and on-demand video globally (e.g., HLS/MPEG-DASH with low-latency live streaming)
* Distributing software packages, game patches, and OTA firmware updates at scale
* Protecting web applications at the edge with AWS WAF rules and Shield Standard
* Running serverless edge logic with CloudFront Functions or Lambda@Edge (e.g., request rewriting, A/B testing)
