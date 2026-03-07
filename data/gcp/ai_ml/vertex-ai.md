---
cloud_provider: "GCP"
service_category: "ai_ml"
service_name: "Vertex AI"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Vertex AI

### Description
Vertex AI is GCP's unified, fully managed ML platform for building, training, deploying, and managing machine learning models at scale. It consolidates data preparation, AutoML, custom training (on CPUs, GPUs, and TPUs), model evaluation, MLOps pipelines, Feature Store, and generative AI capabilities — including Gemini model access, fine-tuning, and grounding — into a single API surface and console. Vertex AI Model Garden provides access to Google's first-party models (Gemini, Imagen, Embeddings) and hundreds of open and partner models (Llama, Claude, Mistral) for deployment or fine-tuning. The platform includes MLOps tooling such as Vertex AI Pipelines for orchestration, Model Registry for versioning, Model Monitoring for drift detection, and Vertex AI Workbench / Colab Enterprise for notebook-based development.

### Use Cases
* Training and deploying custom ML models using AutoML (no-code) or custom containers (TensorFlow, PyTorch, JAX, scikit-learn) on managed infrastructure with auto-scaling prediction endpoints
* Accessing and grounding Gemini and other foundation models via API for generative AI applications such as chatbots, summarization, code generation, and multimodal analysis
* Building end-to-end ML pipelines with Vertex AI Pipelines (Kubeflow Pipelines-based) for repeatable, versioned training and evaluation workflows integrated with BigQuery and Cloud Storage
* Fine-tuning or distilling foundation models on proprietary data using supervised tuning or RLHF, then deploying to dedicated endpoints with autoscaling
* Implementing MLOps best practices with Model Registry, Model Monitoring for production drift detection, and Vertex AI Experiments for tracking training runs and hyperparameter tuning
