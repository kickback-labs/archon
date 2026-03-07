---
cloud_provider: "GCP"
service_category: "devops"
service_name: "Artifact Registry"
pricing_model: "on-demand"
managed: true
tier: 2
---
## GCP Artifact Registry

### Description
Artifact Registry is GCP's fully managed, universal artifact management service and the recommended successor to Container Registry. It provides a single, centrally governed location for storing Docker container images, Helm charts, and language packages (Maven/Gradle for Java, npm for Node.js, pip for Python, Go modules, Ruby gems) as well as generic binary artifacts. Repositories are regional, supporting data residency requirements, and are secured with IAM for fine-grained access control. Artifact Registry integrates natively with Cloud Build (store build outputs), Cloud Run, GKE, App Engine, and Compute Engine (deploy artifacts), and with Artifact Analysis for automatic vulnerability scanning of container images. Remote repositories can cache artifacts from public upstream sources (Docker Hub, Maven Central, npm, PyPI, etc.) to improve build reliability and apply security controls, while virtual repositories group multiple repositories behind a single endpoint with configurable search priority.

### Use Cases
* Central container image registry for GKE and Cloud Run workloads (e.g., storing multi-arch Docker images built by Cloud Build and pulling them directly in GKE pod specs with IAM-authenticated access)
* Language package hosting for internal libraries (e.g., publishing private Python packages to a pkg.dev repository and installing them via pip with credential helper authentication in CI pipelines)
* Dependency caching with remote repositories (e.g., creating a remote repository proxying Docker Hub to cache base images and reduce external network dependency during builds)
* Software supply chain security (e.g., enabling Artifact Analysis to automatically scan container images for OS and language-level CVEs, and integrating scan results with Binary Authorization deployment policies)
* Helm chart distribution for Kubernetes (e.g., storing versioned Helm charts in Artifact Registry and installing them with the Helm CLI authenticated via gcloud credential helper)
* Multi-region artifact distribution (e.g., creating regional repositories in multiple GCP regions to reduce image pull latency for globally distributed GKE clusters)
* Controlled artifact promotion (e.g., using virtual repositories to define a priority-ordered chain — dev registry → staging registry → prod registry — so a single endpoint resolves the correct artifact for each environment)
