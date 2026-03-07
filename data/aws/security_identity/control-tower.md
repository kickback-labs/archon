---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "Control Tower"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Control Tower

### Description
AWS Control Tower is a managed service for setting up and governing a secure, well-architected multi-account AWS environment (a "landing zone") based on AWS best practices. It automates the creation of an AWS Organizations structure, baseline accounts (Log Archive and Audit), and foundational security controls in under 30 minutes. Control Tower provides over 750 pre-packaged governance controls (formerly called guardrails) that can be preventive (implemented via Service Control Policies), detective (implemented via AWS Config rules), or proactive (implemented via CloudFormation hooks), covering compliance frameworks such as NIST 800-53, PCI DSS, HIPAA, and CIS. New AWS accounts provisioned through Account Factory are automatically enrolled with the organization's controls and baseline configuration. Control Tower integrates with AWS Service Catalog (Account Factory) and third-party software via Customizations for AWS Control Tower (CfCT) for additional workload-specific configurations. It is available at no additional charge; customers pay only for the underlying AWS services used by the controls.

### Use Cases
* Establishing a secure multi-account landing zone for a new AWS organization, including Log Archive and Audit accounts, SCPs, and baseline Config rules, in under 30 minutes
* Provisioning net-new AWS accounts that are pre-configured with security and compliance controls via Account Factory (e.g., automatically enrolling a new project account with tagging policies, GuardDuty, and Security Hub enabled)
* Enforcing organization-wide preventive controls using Service Control Policies (e.g., preventing disabling of CloudTrail or GuardDuty in any account)
* Applying detective controls to identify non-compliant resource configurations across all accounts (e.g., flagging S3 buckets with public access enabled)
* Meeting regulatory compliance requirements by selecting and enabling pre-built control sets for NIST 800-53, PCI DSS, or HIPAA
* Scaling governance to a large number of accounts in an enterprise by managing controls centrally while allowing individual teams to operate autonomously within guardrails
* Integrating with existing AWS Organizations setups to extend governance to already-existing accounts without full re-provisioning
