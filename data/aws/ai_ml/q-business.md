---
cloud_provider: "AWS"
service_category: "ai_ml"
service_name: "Amazon Q Business"
pricing_model: "subscription"
managed: true
tier: 2
---
## AWS Amazon Q Business

### Description
Amazon Q Business is a fully managed, generative AI-powered enterprise assistant that lets employees ask questions in natural language and receive accurate, cited answers grounded in your organization's own data. It indexes content from over 40 prebuilt connectors spanning document repositories (S3, SharePoint, Confluence), databases, data warehouses (via QuickSight integration), and SaaS applications (Salesforce, ServiceNow, Jira) into a unified semantic index. Responses include citations and source snippets, and the service enforces the user's existing IAM Identity Center permissions so each employee only sees data they are authorized to access. Beyond Q&A, users can take direct actions in third-party applications (create Jira tickets, update Salesforce records, manage PagerDuty incidents) and build lightweight, shareable AI apps through Amazon Q Apps without writing code. Administrators can block topics, restrict responses to enterprise content only, and audit all interactions via AWS CloudTrail. Pricing starts at $3 per user per month on the Lite tier, with a Business Pro tier that adds document-level access control and additional connectors.

### Use Cases
* Enterprise knowledge search: answer employee questions by unifying siloed documents, wikis, and SharePoint sites into a single conversational interface
* IT and HR self-service: reduce ticket volume by letting employees resolve common IT and HR queries directly through natural language (e.g., VPN setup steps, leave policy lookup)
* Content generation: draft customer emails, blog posts, and sales scripts using enterprise data as grounding context (e.g., summarizing a meeting transcript into a follow-up email)
* Cross-application workflow automation: perform actions across Jira, Salesforce, and ServiceNow from a single chat interface without switching tabs
* Regulatory compliance Q&A: surface answers from policy documents, audit reports, and compliance handbooks with citations for auditability
* Developer productivity: integrate the Amazon Q index into third-party software vendors' own AI assistants via API to enrich responses with customer-specific enterprise data
* Lightweight app creation: let non-technical users build repeatable generative AI workflows (e.g., a sales team app that drafts follow-up emails from CRM notes)
