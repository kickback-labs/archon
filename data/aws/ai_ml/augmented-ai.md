---
cloud_provider: "AWS"
service_category: "ai_ml"
service_name: "Augmented AI"
pricing_model: "per-request"
managed: true
tier: 3
---
## AWS Augmented AI (A2I)

### Description
Amazon Augmented AI (Amazon A2I) is a fully managed service that makes it easy to build human review workflows into machine learning applications, routing low-confidence or sampled ML predictions to human reviewers before or after automated processing. It provides prebuilt integrations with Amazon Textract (document extraction) and Amazon Rekognition (content moderation) that can be activated with a few API parameters, as well as a generic API path for custom SageMaker or third-party models. Each workflow definition (called a "human review loop") specifies routing conditions—either a confidence threshold below which predictions are sent for review, or a random sampling percentage for ongoing audits—and the number of required reviewers per task. A2I supports three reviewer workforce options: a private internal team (for sensitive data), an AWS Marketplace vendor workforce (pre-screened third-party reviewers), or Amazon Mechanical Turk (500,000+ on-demand crowdsource workers). The service provides a configurable, browser-based reviewer UI backed by 60+ HTML templates, and reviewer feedback can be used to continually retrain the underlying model. Charges apply only per completed human review object, with no upfront commitments.

### Use Cases
* Medical document review: route low-confidence Textract extractions from insurance claims, intake forms, and prescription scans to clinical reviewers before updating downstream systems
* Content moderation audit: sample a random percentage of Rekognition moderation decisions for human spot-check to maintain quality baselines on UGC platforms
* Financial form processing: review uncertain key-value pairs extracted from mortgage applications, tax forms, or invoices before ingesting into core banking systems
* Custom NLP model review: connect any SageMaker sentiment or entity-detection model to A2I so borderline predictions are validated by domain experts (e.g., legal clause classification)
* Model retraining pipeline: use accumulated human labels from review loops as a labeled dataset to periodically fine-tune the underlying ML model and reduce the need for future reviews
* Multi-reviewer consensus: require two or three independent reviewers per task to increase result confidence for high-stakes decisions (e.g., medical diagnosis support, fraud adjudication)
* Regulatory audit trails: capture all reviewer decisions and timestamps in S3 for compliance evidence that human oversight was exercised on automated ML decisions
