---
cloud_provider: "AWS"
service_category: "migration_hybrid"
service_name: "Transfer Family"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Transfer Family

### Description
AWS Transfer Family is a fully managed service that provides secure file transfer capabilities over SFTP, FTPS, FTP, and AS2 protocols, with files stored directly in Amazon S3 or Amazon EFS. It eliminates the need to manage file transfer servers, handle patching, or maintain custom infrastructure. Transfer Family supports thousands of concurrent users with granular per-user access controls, custom authentication via LDAP, Active Directory, Okta, or custom identity providers via API Gateway and Lambda, and integrates with AWS Step Functions and AWS B2B Data Interchange for post-transfer workflow automation. Servers can be configured with public or VPC endpoints and deployed with Elastic IP addresses for IP allowlisting.

### Use Cases
* Modernizing managed file transfers for regulated industries (e.g., securely exchanging PCI, PII, or HIPAA data with partners via SFTP without managing servers)
* Business-to-business EDI and supply chain data exchange (e.g., trading partners submitting EDI 850/856 documents via AS2, automatically converted by B2B Data Interchange)
* Centralized data ingestion into S3 data lakes (e.g., external partners uploading CSV or Parquet files directly to S3 partitions for downstream ETL)
* Workforce and partner data sharing (e.g., secure browser-based access for authenticated users to retrieve reports from S3)
* Content distribution to subscribers (e.g., media companies delivering large files to downstream partners with per-user bandwidth and directory controls)
* Migration of on-premises MFT servers to the cloud (e.g., replacing existing GoAnywhere or Globalscape installations with Transfer Family preserving existing partner connections)
