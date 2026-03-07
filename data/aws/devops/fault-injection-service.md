---
cloud_provider: "AWS"
service_category: "devops"
service_name: "Fault Injection Service"
pricing_model: "on-demand"
managed: true
tier: 3
---
## AWS Fault Injection Service (FIS)

### Description
AWS Fault Injection Service (FIS) is a fully managed chaos engineering service that enables teams to run controlled fault injection experiments on AWS workloads to identify weaknesses, validate resilience mechanisms, and build confidence in application behavior under failure conditions. FIS provides a library of pre-built fault actions (scenarios) targeting a wide range of AWS services including EC2, ECS, EKS, RDS, DynamoDB, Lambda, and network conditions, allowing teams to simulate real-world failures such as instance terminations, AZ impairments, CPU stress, network latency injection, database failovers, and API throttling. Experiments are defined via experiment templates that specify the target resources (using tags, resource IDs, or filters), the fault actions to apply, and the duration and magnitude of each action. Stop conditions (CloudWatch alarms or steady-state hypotheses) provide guardrails that automatically halt and roll back an experiment if a critical threshold is breached during execution. FIS integrates with AWS Resilience Hub to validate Recovery Time Objectives (RTOs) and Recovery Point Objectives (RPOs) and can be embedded into CI/CD pipelines via the FIS API or AWS CLI. Pricing is charged per action-minute, meaning you pay only for the duration of fault actions that are actively running.

### Use Cases
* AZ failure simulation (e.g., injecting a simulated AZ outage by terminating all EC2 instances in a single AZ to verify that an Auto Scaling group correctly replaces them in the remaining AZs within an acceptable RTO)
* Database failover testing (e.g., triggering an Aurora failover to a read replica and measuring whether the application reconnects within the expected time without user-visible errors)
* EKS pod and node disruption (e.g., injecting random pod terminations into an EKS cluster to validate that Kubernetes replication controllers restart pods and that the service remains available throughout)
* CPU and memory stress testing (e.g., applying CPU stress to a set of tagged EC2 instances to verify that CloudWatch alarms trigger and Auto Scaling scales out before latency degrades)
* Network latency and packet loss injection (e.g., adding 200 ms of latency between microservices in a VPC to identify timeout and retry misconfiguration in the application layer)
* Lambda concurrency throttling (e.g., simulating Lambda throttling errors to verify that the upstream SQS queue correctly retains messages and the application recovers gracefully)
* Game day simulation (e.g., coordinating a full-day failure exercise by running multiple FIS experiments in sequence — network degradation, then an AZ failure — to stress test on-call runbooks and escalation procedures)
* CI/CD pipeline integration (e.g., running a short FIS experiment as a post-deploy integration test step to confirm that a newly deployed service handles instance termination without elevated error rates)
* Resilience Hub RTO/RPO validation (e.g., linking FIS experiment results to AWS Resilience Hub assessments to automatically verify whether actual recovery times meet the defined SLO targets)
