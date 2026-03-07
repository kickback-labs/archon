---
cloud_provider: "GCP"
service_category: "devops"
service_name: "Cloud Deploy"
pricing_model: "subscription"
managed: true
tier: 2
---
## GCP Cloud Deploy

### Description
Cloud Deploy is GCP's fully managed continuous delivery service for deploying applications to GKE, Cloud Run, and other targets. It provides declarative delivery pipelines that progress release candidates through ordered environments (e.g., dev → staging → production) with built-in promotion, rollback, approval gates, and canary/parallel deployment strategies. Cloud Deploy uses Skaffold as its rendering engine to ensure pipeline parity between local development and CI/CD environments. As a fully managed service, it requires no infrastructure to set up and scales automatically. It integrates natively with IAM for deployment access control, Cloud Logging and Cloud Audit Logs for auditability, and Cloud Monitoring for observability of deployed workloads. Delivery pipelines with more than one target are charged at $5/month per active pipeline (first pipeline free per billing account).

### Use Cases
* Progressive environment promotion for containerized workloads (e.g., defining a three-stage pipeline — dev GKE cluster → staging GKE cluster → production GKE cluster — and promoting releases with a single CLI command or console click)
* Canary deployments for Cloud Run services (e.g., routing 10% of traffic to a new revision and automatically promoting to 100% after verification tests pass)
* Parallel deploys to multiple regions (e.g., rolling out a new Cloud Run service version to us-central1, europe-west1, and asia-east1 simultaneously with collective rollback on any failure)
* Gated production releases (e.g., requiring a named approver to authorize promotion from staging to production before Cloud Deploy executes the rollout)
* Automated continuous delivery pipelines (e.g., configuring automation rules to auto-promote a release to the next stage when deployment verification succeeds)
* Deployment verification and rollback (e.g., running post-deployment integration tests as deploy hooks and triggering an automatic rollback if tests fail)
* Auditable release history (e.g., querying Cloud Audit Logs to determine which release was promoted to production and by whom, for compliance reporting)
