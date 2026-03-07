---
cloud_provider: "Azure"
service_category: "integration_messaging"
service_name: "Logic Apps"
pricing_model: "serverless"
managed: true
tier: 1
---
## Azure Logic Apps

### Description
Azure Logic Apps is a fully managed cloud platform for building and running automated integration workflows that connect applications, data, services, and systems across cloud, on-premises, and hybrid environments with little to no code. Workflows are assembled visually using a designer backed by over 1,400 prebuilt connectors spanning Azure services, Microsoft 365, SAP, Salesforce, databases, file servers, and external REST APIs. Two primary hosting models are available: Consumption (multitenant, pay-per-execution) for simple event-driven workflows, and Standard (single-tenant, App Service Plan or ASE v3) for workloads that require VNet integration, stateful or stateless execution, and higher throughput. Logic Apps natively supports enterprise B2B integration through EDI standards such as AS2, EDIFACT, and X12 via integration accounts, and can host AI-powered agentic workflows by incorporating Azure OpenAI models. Workflows are defined in JSON (ARM templates), enabling infrastructure-as-code deployment across environments.

### Use Cases
* Enterprise application integration connecting on-premises systems (SAP, IBM MQ, file servers) with cloud services without writing custom middleware
* B2B EDI message exchange with trading partners using AS2, EDIFACT, and X12 protocols managed via integration accounts
* Event-driven automation triggered by Azure Event Grid, Service Bus, or blob uploads to orchestrate multi-step business processes
* SaaS data synchronisation, such as syncing CRM records between Salesforce and SharePoint or routing orders between e-commerce and ERP systems
* Approval and human-in-the-loop workflows where conditional steps send emails and wait for responses before continuing
* Scheduled data pipeline orchestration calling APIs, transforming payloads, and writing results to databases or storage accounts
