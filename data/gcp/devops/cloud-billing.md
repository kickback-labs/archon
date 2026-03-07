---
cloud_provider: "GCP"
service_category: "devops"
service_name: "Cloud Billing"
pricing_model: "subscription"
managed: true
tier: 2
---
## GCP Cloud Billing

### Description
Cloud Billing is GCP's built-in cost management platform that tracks, reports, and helps optimize all Google Cloud spending. Every GCP project must be linked to a Cloud Billing account, which is the financial entity that receives charges for resource usage. Cloud Billing provides detailed billing reports and cost trend dashboards in the console, budget alerts (via email or Pub/Sub) to detect anomalous spend, and the ability to export granular billing data to BigQuery for advanced analysis. Committed use discounts (CUDs) for Compute Engine and Cloud SQL can be purchased through billing. Cloud Billing accounts can be organized hierarchically under billing sub-accounts for reseller and multi-tenant scenarios. The FinOps hub surfaces recommendations for cost optimization alongside idle resource alerts from Active Assist/Recommender.

### Use Cases
* Real-time cost visibility and trend analysis (e.g., reviewing per-service, per-project, and per-label cost breakdowns in billing reports to identify which workloads are driving spend)
* Automated budget alerts and spend controls (e.g., creating a monthly budget for a project with threshold alerts at 50%, 90%, and 100% of budget, and a Pub/Sub notification that triggers a Cloud Function to disable billing if the budget is exceeded)
* BigQuery cost analytics (e.g., exporting detailed billing data to BigQuery and querying it with Looker Studio to build custom dashboards showing cost by team label or environment tag)
* Committed use discount management (e.g., purchasing 1-year or 3-year CUDs for sustained Compute Engine usage to achieve up to 57% discount over on-demand pricing)
* Multi-project cost allocation (e.g., using resource labels and billing sub-accounts to separate and report costs by department, environment, or product team)
* Invoice and payment management (e.g., downloading monthly invoices, managing payment methods, and configuring automatic payments for enterprise billing accounts)
* FinOps and rightsizing recommendations (e.g., surfacing Recommender suggestions for underutilized VM instances and idle persistent disks to reduce waste)
