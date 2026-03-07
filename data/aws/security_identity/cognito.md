---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "Cognito"
pricing_model: "per-request"
managed: true
tier: 2
---
## AWS Cognito (Amazon Cognito)

### Description
Amazon Cognito is a fully managed customer identity and access management (CIAM) service that handles user sign-up, sign-in, and access control for web and mobile applications. It provides two core components: User Pools (a user directory with built-in authentication flows) and Identity Pools (federated identities that grant temporary AWS credentials). Cognito supports social identity providers (Google, Facebook, Apple), SAML 2.0, and OIDC-based federation, as well as passwordless login via WebAuthn passkeys, SMS OTPs, and email OTPs. It processes over 100 billion authentications per month and scales to millions of users without infrastructure management. Advanced security features include risk-based adaptive authentication, compromised credential monitoring, and IP geo-velocity tracking. Cognito also supports machine-to-machine (M2M) authorization using the OAuth 2.0 client credentials flow, making it suitable for securing microservice APIs without static API keys. It integrates with AWS Amplify, API Gateway, ALB, and AWS Lambda triggers for custom authentication flows.

### Use Cases
* Adding user sign-up and sign-in to a web or mobile app (e.g., a consumer SaaS product with email/password and Google social login)
* Federating enterprise workforce identities into an application using SAML or OIDC (e.g., integrating with Okta or Azure AD for a B2B SaaS product)
* Granting mobile app users temporary, scoped AWS credentials to access S3, DynamoDB, or other AWS services directly (e.g., a mobile app uploading to a user-specific S3 prefix)
* Implementing multi-tenant B2B identity isolation using Cognito User Pool groups or separate User Pools per tenant
* Securing microservice-to-microservice communication using OAuth 2.0 client credentials flow instead of static API keys
* Enforcing adaptive MFA and anomaly detection on login flows to reduce account takeover risk
* Customizing authentication flows with Lambda triggers (e.g., custom pre-signup validation, post-confirmation actions, or custom challenge logic)
