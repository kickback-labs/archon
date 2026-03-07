---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "Verified Permissions"
pricing_model: "per-request"
managed: true
tier: 3
---
## Amazon Verified Permissions

### Description
Amazon Verified Permissions is a fully managed, scalable authorization service that enables developers to implement fine-grained, policy-based access control for their own applications using the Cedar policy language. Rather than embedding authorization logic inside application code, Verified Permissions externalizes it into a centrally managed policy store, separating authorization decisions from business logic. Cedar is an open-source policy language designed for human readability, formal verifiability, and high-performance evaluation; it supports attribute-based access control (ABAC), role-based access control (RBAC), and combinations of both. Applications call the Verified Permissions API (IsAuthorized or IsAuthorizedWithToken) at runtime to receive real-time allow/deny decisions based on the principal, action, resource, and context provided. Verified Permissions integrates with Amazon Cognito for identity token validation, and can enforce policies on Amazon API Gateway and AWS AppSync endpoints. Policy changes take effect immediately, allowing runtime updates to permissions without redeploying application code. The service supports automated policy analysis to detect overly permissive or conflicting policies at authoring time. Pricing is per-authorization request, making it consumption-based and well-suited for applications with variable traffic. Verified Permissions is aligned with Zero Trust principles — authorization is evaluated continuously at each request rather than trusted implicitly after initial authentication.

### Use Cases
* Implement fine-grained RBAC for a SaaS application (e.g., allow only users with the "manager" role to approve expense reports above $500, enforced by Verified Permissions policies evaluated per API call)
* Externalize and centralize authorization logic across microservices (e.g., replace scattered if/else permission checks in 10 microservices with a single policy store, reducing code duplication and enabling consistent authorization governance)
* Enforce attribute-based access control (ABAC) at the data level (e.g., allow a healthcare application user to read only patient records where the patient's assigned provider matches the user's provider ID, using Cedar attribute conditions)
* Protect API Gateway and AppSync endpoints with Cedar policies (e.g., evaluate each API Gateway request against Verified Permissions to determine if the caller's JWT claims satisfy the required permissions for that endpoint)
* Enable multi-tenant access control in SaaS platforms (e.g., enforce tenant isolation by ensuring that users in tenant A cannot access resources belonging to tenant B, using tenant ID as a policy attribute)
* Audit and analyze permissions at scale (e.g., use Cedar's formal verification capabilities to check whether any policy allows unintended access paths before deploying a policy change to production)
* Support delegated permissions within applications (e.g., allow an application user to delegate specific access rights to another user for a limited time period, modeled as Cedar policies created dynamically by the application)
* Align application authorization with Zero Trust (e.g., re-evaluate authorization on every API request using current token claims and resource attributes, rather than trusting a session established at login time)
