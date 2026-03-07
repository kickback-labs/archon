---
cloud_provider: "AWS"
service_category: "devops"
service_name: "Trusted Advisor"
pricing_model: "subscription"
managed: true
tier: 2
---
## AWS Trusted Advisor

### Description
AWS Trusted Advisor is an automated best-practice advisor that continuously evaluates your AWS environment across six categories: cost optimization, performance, resilience, security, operational excellence, and service limits. It surfaces actionable recommendations ranked by severity so teams can prioritize remediation efforts. All AWS accounts receive access to 56 core checks; upgrading to Business Support or higher unlocks the full library of 482 checks, the Trusted Advisor API, and CLI access. Trusted Advisor Priority, available to Enterprise Support and Unified Operations customers, provides context-driven recommendations from your AWS account team to further focus on the most critical issues. Recommendations can be tracked and shared across teams, and the service integrates with AWS Organizations to provide an aggregated, organization-wide view of recommendations. There is no additional charge for Trusted Advisor itself; access to the full check set is unlocked through AWS Support plan upgrades.

### Use Cases
* Cost optimization (e.g., identifying idle EC2 instances, underutilized EBS volumes, or Reserved Instance coverage gaps to reduce monthly spend)
* Security hardening (e.g., detecting publicly accessible S3 buckets, overly permissive security groups, or MFA not enabled on the root account)
* Service limit monitoring (e.g., alerting when EC2 vCPU usage approaches the regional quota limit before a large deployment)
* Performance improvement (e.g., recommending CloudFront for high-latency S3 origins or flagging EC2 instances with high utilization that would benefit from a larger instance type)
* Resilience and redundancy (e.g., flagging single-AZ RDS deployments or EC2 instances not covered by Auto Scaling groups)
* Organization-wide governance (e.g., aggregating Trusted Advisor findings across all member accounts in an AWS Organization for a unified compliance dashboard)
* Programmatic integration (e.g., pulling Trusted Advisor check results via the Support API to feed into a custom operations dashboard or ticketing system)
