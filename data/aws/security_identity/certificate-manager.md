---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "Certificate Manager"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Certificate Manager (ACM)

### Description
AWS Certificate Manager (ACM) provisions, manages, and deploys public and private SSL/TLS certificates for use with AWS services and connected resources. Public certificates issued by ACM for use with integrated AWS services (CloudFront, ALB, API Gateway, Elastic Beanstalk) are free of charge and automatically renewed before expiration. Private certificates — issued through ACM Private CA — can be used to secure internal workloads running on EC2 instances, containers, on-premises hosts, and IoT devices, with a monthly fee per active CA. ACM handles key generation, secure storage, and rotation, eliminating the operational burden of manual certificate lifecycle management. It supports RSA and ECDSA key algorithms, and certificates can be validated via DNS validation (recommended, fully automated) or email validation. ACM does not allow export of private keys for public certificates, ensuring they remain under AWS custody. For hybrid and multi-cloud workloads, ACM certificates can terminate TLS on resources outside the integrated services using the Private CA.

### Use Cases
* Provisioning free, auto-renewing TLS certificates for CloudFront distributions and Application Load Balancers to enforce HTTPS without manual renewal (e.g., a public-facing web application)
* Securing API Gateway custom domain names with ACM-managed certificates
* Issuing private certificates via ACM Private CA for internal service-to-service mTLS (e.g., microservices in an ECS cluster authenticating each other)
* Terminating TLS on EC2 instances or on-premises servers using private certificates from ACM Private CA
* Automating certificate issuance and renewal in CI/CD pipelines to reduce certificate expiry incidents
* Enforcing HTTPS across all environments by associating ACM certificates with Elastic Beanstalk environments or CloudFront origins
