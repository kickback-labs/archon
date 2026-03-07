---
cloud_provider: "GCP"
service_category: "compute"
service_name: "Cloud Functions"
pricing_model: "serverless"
managed: true
tier: 1
---
## GCP Cloud Functions

### Description
Cloud Functions is GCP's Functions-as-a-Service (FaaS) offering, now fully unified with Cloud Run. Functions are written in a supported runtime (Node.js, Python, Go, Java, .NET, Ruby, PHP), deployed from source code, and automatically containerized using Google Cloud Buildpacks and the Functions Framework. The resulting container is deployed on Cloud Run and billed on a per-request, per-invocation model with a generous free tier and scale-to-zero behavior. Functions can be triggered via HTTP(S), Pub/Sub messages, Cloud Storage events, Firestore changes, or Eventarc-routed events from over 90 Google Cloud sources.

### Use Cases
* Event-driven automation (e.g., processing files uploaded to a Cloud Storage bucket)
* Pub/Sub message consumers (e.g., lightweight data transformation in a streaming pipeline)
* HTTP APIs and webhooks (e.g., lightweight REST endpoints or Slack/GitHub webhook handlers)
* Backend logic for Firebase applications (e.g., user authentication triggers and Firestore hooks)
