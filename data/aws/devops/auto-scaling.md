---
cloud_provider: "AWS"
service_category: "devops"
service_name: "Auto Scaling"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS Auto Scaling

### Description
AWS Auto Scaling is the unified scaling management service that monitors applications and automatically adjusts capacity across multiple AWS resource types to maintain performance at the lowest possible cost. It covers Amazon EC2 instances and Spot Fleets, ECS tasks, DynamoDB tables and indexes, and Aurora read replicas. Scaling policies can optimize for performance, cost, or a balance of both, and predictive scaling uses machine learning to proactively add capacity ahead of anticipated demand spikes.

### Use Cases
* Dynamic EC2 fleet scaling (e.g., adding instances when CPU exceeds 70% and terminating them when demand subsides)
* Cost optimization with Spot Fleets (e.g., mixing on-demand and Spot capacity to reduce EC2 costs for stateless workloads)
* Scaling ECS tasks to match traffic (e.g., auto-scaling containerized API tasks based on target request count per task)
* DynamoDB capacity management (e.g., automatically scaling read/write capacity units for unpredictable table traffic)
* Predictive scaling for scheduled spikes (e.g., pre-warming EC2 capacity before a daily batch job or marketing event)
