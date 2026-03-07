---
cloud_provider: "GCP"
service_category: "migration_hybrid"
service_name: "Google Distributed Cloud Air-gapped"
pricing_model: "subscription"
managed: true
tier: 3
---
## GCP Google Distributed Cloud Air-gapped

### Description
Google Distributed Cloud Air-gapped (GDC Air-gapped, formerly Google Distributed Cloud Hosted) is a fully managed, physically isolated private cloud solution that deploys Google Cloud's infrastructure—including Kubernetes, AI/ML capabilities, databases, storage, and networking—into a customer-controlled, air-gapped environment with no persistent connectivity to the public internet or to Google's cloud infrastructure. It is delivered on Google-supplied, ruggedized hardware installed in a customer's data center or a colocation facility and is managed by authorized operators with physical access controls. GDC Air-gapped is purpose-built for highly classified or regulated workloads where data sovereignty, physical isolation, and national security requirements prohibit any form of external network connectivity. It supports multi-zone deployments (up to three zones) for high availability and disaster recovery within the air-gapped boundary. The platform exposes a familiar Kubernetes-based developer experience and includes object storage, block storage, managed database services (AlloyDB), monitoring, logging, IAM, and KMS—all running fully on-premises. AI inference using Google Gemini models and Vertex AI can be run on-premises without any data leaving the facility. The platform is operated through the `gdcloud` CLI and a web-based console that functions entirely within the air-gapped environment. Access to Google for software updates is via a controlled, offline update mechanism. GDC Air-gapped is currently available in select countries and requires a formal engagement with Google sales; pricing is determined per-contract based on hardware configuration and size.

### Use Cases
* Classified government and defence workloads that require physical network isolation and strict data sovereignty controls (e.g., national intelligence agencies, military command systems)
* Critical national infrastructure operation (e.g., power grid management, air traffic control) in jurisdictions prohibiting cloud connectivity
* Regulated financial services or healthcare environments in countries with data residency laws requiring all compute and storage to remain on-premises with no egress
* On-premises AI inference for sensitive datasets that cannot be sent to any external service (e.g., confidential medical imaging analysis using Vertex AI models)
* Running containerized microservices and Kubernetes workloads on Google-grade infrastructure without reliance on a public cloud control plane
* Multi-zone high-availability deployments within a single air-gapped facility for mission-critical applications requiring zero external dependencies
* Organizations that want Google Cloud's developer tooling (GKE, Cloud Storage APIs, AlloyDB, IAM) inside a sovereign, physically isolated environment
* Managed software lifecycle and hardware maintenance by Google operators with audited physical access, meeting the most stringent compliance frameworks (e.g., IL5/IL6, NATO, government-specific certifications)
