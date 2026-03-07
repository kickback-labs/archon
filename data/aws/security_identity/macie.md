---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "Macie"
pricing_model: "on-demand"
managed: true
tier: 3
---
## Amazon Macie

### Description
Amazon Macie is a fully managed data security and data privacy service that uses machine learning and pattern matching to automatically discover, classify, and protect sensitive data stored in Amazon S3. Macie continuously evaluates all S3 buckets in an account for security and access control issues — such as publicly accessible buckets, buckets shared with external accounts, or unencrypted buckets — and generates a data security posture score for each bucket. Sensitive data discovery jobs scan S3 object contents using a library of over 80 built-in managed data identifiers covering categories such as personally identifiable information (PII), financial data, credentials, and healthcare records; custom data identifiers using regex and keyword matching can extend coverage to organization-specific data types. When sensitive data is detected, Macie generates findings that integrate with AWS Security Hub and Amazon EventBridge, enabling automated remediation workflows. Macie supports multi-account management through AWS Organizations, providing centralized visibility across all accounts' S3 environments. Pricing is based on two dimensions: the number of S3 buckets evaluated per month for security posture monitoring, and the amount of data (GB) processed during sensitive data discovery jobs. A 30-day free trial covers both dimensions. Macie does not scan data outside of S3; it is purpose-built for S3 data governance, and organizations requiring coverage of databases or other storage types should combine Macie with other tools.

### Use Cases
* Discover and classify PII stored in S3 at scale (e.g., identify which S3 buckets contain social security numbers, passport numbers, or driver's license numbers across hundreds of buckets in a data lake)
* Identify S3 data security posture issues (e.g., automatically detect S3 buckets that are publicly accessible, unencrypted, or shared with external AWS accounts as part of a continuous security posture monitoring program)
* Meet compliance requirements for sensitive data handling (e.g., schedule periodic scans of an S3-based data warehouse to prove that credit card data (PCI DSS scope) is only stored in approved, encrypted buckets)
* Protect data during cloud migration (e.g., scan newly ingested S3 data from an on-premises migration to verify that sensitive data has been appropriately tokenized or encrypted before further processing)
* Automate remediation of sensitive data exposure (e.g., trigger a Lambda function via EventBridge when Macie detects credentials in an S3 object, automatically quarantining the object and notifying the security team)
* Use custom data identifiers to detect proprietary data types (e.g., define a regex pattern to detect internal employee IDs or proprietary contract numbers in S3, and alert when they appear in unexpected locations)
* Centralize S3 data security visibility across an AWS Organization (e.g., enable Macie organization-wide and aggregate all findings into a delegated administrator account for centralized reporting and response)
* Continuously monitor S3 bucket inventories for access control drift (e.g., detect when an IAM policy change inadvertently makes a previously private bucket containing PHI accessible to a third-party account)
