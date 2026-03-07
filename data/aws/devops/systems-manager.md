---
cloud_provider: "AWS"
service_category: "devops"
service_name: "Systems Manager"
pricing_model: "on-demand"
managed: true
tier: 1
---
## AWS Systems Manager (SSM)

### Description
AWS Systems Manager is a centralized operations hub for managing nodes at scale across AWS, on-premises, and multi-cloud environments via the SSM Agent. It consolidates a broad suite of capabilities including secure remote shell access (Session Manager), automated patching (Patch Manager), parameter and secrets storage (Parameter Store), runbook automation, and application configuration management (AppConfig). Systems Manager eliminates the need for bastion hosts, SSH key management, and manual operational runbooks.

### Use Cases
* Secure remote access to EC2 instances and on-premises servers (e.g., browser-based shell sessions with no inbound security group rules)
* Automated OS and software patching (e.g., scheduling monthly patch baselines across a fleet with compliance reporting)
* Centralized configuration and secrets storage (e.g., storing database connection strings in Parameter Store for Lambda and ECS access)
* Operational runbook automation (e.g., automating instance remediation steps triggered by CloudWatch alarms)
* Fleet-wide command execution (e.g., running shell scripts on thousands of instances simultaneously with Run Command)
