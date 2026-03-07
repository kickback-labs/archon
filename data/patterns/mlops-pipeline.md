# MLOps CI/CD/CT Pipeline

## Description

MLOps (Machine Learning Operations) applies DevOps principles to the machine learning lifecycle, automating the iterative cycle of data extraction, model training, evaluation, deployment, and monitoring. Unlike traditional software, ML systems degrade over time as real-world data distributions shift away from training data — a phenomenon called data drift or concept drift. MLOps introduces Continuous Training (CT) as a third automation tier alongside CI and CD, automatically retraining models when monitoring systems detect performance degradation.

The three automation tiers:
- **CI (Continuous Integration):** Automated testing of data pipelines, feature engineering code, and model training code
- **CD (Continuous Delivery):** Automated packaging, validation, and deployment of trained model artifacts to serving infrastructure
- **CT (Continuous Training):** Automated retraining triggered by data drift detection, schedule, or performance metric degradation

## When to Use

- Production ML models require automated retraining as real-world data evolves over time
- Multiple models are in production and manual retraining/deployment is unsustainable
- Regulatory requirements mandate model versioning, lineage tracking, and reproducibility
- Teams need to iterate on model architectures rapidly without manual deployment steps
- The ML team is large enough that ungoverned model deployment creates reliability and audit risks

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `ai_ml` | ML platform for training orchestration and model registry (SageMaker Pipelines, Vertex AI Pipelines, Azure ML, MLflow) |
| `compute` | Training compute (GPU instances, managed training jobs); evaluation and deployment compute |
| `storage` | Feature store, training dataset versioning, model artifact registry |
| `analytics` | Data drift monitoring (Evidently AI, SageMaker Model Monitor, Vertex Model Monitoring) |
| `devops` | Pipeline orchestration (Kubeflow Pipelines, Airflow, Step Functions); model performance dashboards; automated rollback triggers |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Automation** | Eliminates manual, error-prone model promotion and deployment steps |
| **Reproducibility** | Full lineage from data version → code version → model version enables exact reproduction of any past model |
| **Infrastructure overhead** | MLOps platform setup and maintenance is a significant engineering investment before the first model deploys |
| **Data dependency** | The pipeline is only as good as the data quality and feature store governance upstream |

## Common Pitfalls

- Building MLOps infrastructure before establishing a working manual baseline — automate what already works, not the chaos
- Not versioning training data — without data versioning, model training is non-reproducible
- Ignoring model monitoring after deployment — CT without monitoring triggers is CT that never actually trains
- Over-engineering the pipeline for a single model or small team — start simple and add automation incrementally
