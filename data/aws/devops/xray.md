---
cloud_provider: "AWS"
service_category: "devops"
service_name: "X-Ray"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS X-Ray

### Description
AWS X-Ray is a distributed tracing service that collects request data as it flows through application components, producing trace maps and latency analytics to help identify bottlenecks and errors across microservices. Applications emit trace segments via X-Ray SDKs (available for Java, Python, Node.js, Go, Ruby, .NET) or through OpenTelemetry SDKs, and a lightweight X-Ray daemon buffers and forwards segment data. X-Ray integrates natively with Lambda, ECS, EC2, Elastic Beanstalk, API Gateway, SQS, and SNS, among others. The service generates service maps that visualize dependencies and annotate traces with metadata for filtering and group analysis. As of 2024, X-Ray tracing capabilities are increasingly surfaced through CloudWatch Application Signals, which provides higher-level APM features (SLOs, service health dashboards, transaction search) built on top of X-Ray's trace infrastructure. Pricing is per million traces recorded and per million traces retrieved or scanned.

### Use Cases
* End-to-end distributed tracing for microservices (e.g., tracing a user request from API Gateway through Lambda to DynamoDB and identifying which hop contributes most latency)
* Root cause analysis for performance regressions (e.g., using trace comparisons before and after a deployment to isolate a newly introduced slow database query)
* Error and fault rate monitoring per service segment (e.g., identifying that 80% of errors originate from a specific downstream HTTP dependency)
* Latency percentile analysis (e.g., filtering traces with p99 latency >2 s to find outlier requests for investigation)
* Lambda cold start visibility (e.g., observing initialization duration versus handler duration across traced Lambda invocations)
* Sampling rule configuration (e.g., defining custom sampling rules to trace 100% of requests for a critical checkout path while sampling 1% of background jobs)
* Integration with CloudWatch Application Signals (e.g., using X-Ray traces as the data source for SLO compliance dashboards and automated investigations)
