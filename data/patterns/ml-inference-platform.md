# ML Inference Platform

## Description

The ML Inference Platform pattern encapsulates trained machine learning models within a scalable, managed serving infrastructure. A trained model artifact is packaged (typically as a container), deployed to a serving endpoint, and exposed via a REST or gRPC API. The platform handles GPU/TPU hardware allocation, auto-scaling, request batching, latency monitoring, and A/B testing across model versions.

Two serving modes:
- **Real-time inference:** Synchronous, low-latency predictions for individual requests (< 100ms p99). Used for product recommendations, fraud scoring, content moderation.
- **Batch inference:** Asynchronous, high-throughput scoring of large datasets. Used for nightly risk scoring, bulk personalisation, offline feature generation.

## When to Use

- A trained ML model must be served at scale to production traffic (beyond a notebook or script)
- Real-time prediction latency is a product requirement — users or systems need sub-100ms model responses
- Multiple model versions must coexist in production with traffic splitting (A/B testing, canary deployments)
- GPU or TPU hardware acceleration is required for model serving (LLMs, vision models, speech models)
- Batch scoring of millions of records is required on a scheduled or triggered basis

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `ai_ml` | Managed model serving platform (SageMaker Endpoints, Vertex AI Endpoints, Azure ML Online Endpoints, BentoML, Triton Inference Server) |
| `compute` | GPU/TPU instances for model serving; auto-scaling groups for request-volume-driven scaling |
| `networking` | API Gateway or load balancer in front of serving endpoints; VPC integration for private inference |
| `storage` | Model artifact registry (S3, GCS, Azure Blob) for versioned model storage |
| `devops` | Model performance monitoring, prediction drift detection, latency SLO alerting, canary deployment tooling |

## Serving Optimisation Techniques

| Technique | Purpose |
|---|---|
| **Request batching** | Aggregate multiple requests into a single GPU forward pass — improves throughput at the cost of slight latency |
| **Model quantisation** | Reduce model precision (FP32 → INT8) to reduce GPU memory and improve throughput |
| **Model distillation** | Train a smaller model to mimic a larger one — reduces serving cost and latency |
| **Caching** | Cache predictions for common inputs — dramatically reduces cost for repetitive queries |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Scalability** | Auto-scaling handles variable inference traffic but GPU instances take longer to provision than CPU instances |
| **Cost** | GPU compute for serving is expensive — idle GPU capacity is a significant cost centre |
| **Cold start** | Model loading time (seconds to minutes for large models) must be managed with pre-warming or minimum instance counts |
| **Model versioning** | Running multiple model versions simultaneously enables safe rollout but increases infrastructure cost |

## Common Pitfalls

- Serving a model in a notebook process in production — this is not a serving infrastructure and will fail under load
- Not setting minimum instance counts for latency-sensitive endpoints — cold starts on the first request violate SLOs
- Ignoring prediction monitoring — a model that degrades silently in production is worse than no model
- Not testing inference latency under realistic concurrency before go-live — batch patterns can destroy real-time latency
