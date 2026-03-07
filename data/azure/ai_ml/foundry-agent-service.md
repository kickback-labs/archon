---
cloud_provider: "Azure"
service_category: "ai_ml"
service_name: "Foundry Agent Service"
pricing_model: "per-request"
managed: true
tier: 2
---
## Azure Foundry Agent Service

### Description
Foundry Agent Service is a managed platform within Microsoft Foundry for designing, deploying, and scaling autonomous AI agents at enterprise scale. It supports multi-agent orchestration—where specialized agents collaborate dynamically—and integrates with more than 1,400 connectors via Azure Logic Apps for automated workflow execution. Developers can build agents using their preferred frameworks (Microsoft Agent Framework, LangGraph, and others) and models from the Foundry model catalog, then bring custom-code agents into Foundry with built-in scaling, observability, and governance. Built-in tools cover common enterprise needs across SharePoint, Microsoft Fabric, and Bing-grounded search, while Model Context Protocol (MCP) enables secure connection to custom APIs and data sources. Every agent is assigned a Microsoft Entra Agent ID, providing lifecycle, access, and policy governance at the identity level. Pricing is consumption-based on the models and tools accessed. Foundry Agent Service is designed for complex, regulated enterprise scenarios requiring CI/CD integration and advanced security, differentiating it from the lower-code Microsoft Copilot Studio.

### Use Cases
* Automated customer support agents (e.g., an agent that integrates with a CRM, retrieves customer history, and resolves queries end-to-end without human intervention)
* Multi-agent data analysis workflows (e.g., a financial firm deploying an orchestrator agent that delegates tasks to specialized sub-agents for data retrieval, calculation, and report generation)
* Enterprise knowledge agents grounded on proprietary data (e.g., a legal firm building an agent that searches SharePoint contract repositories and surfaces relevant clauses)
* Agentic DevOps automation (e.g., agents that monitor alerts, triage incidents, update tickets, and escalate based on on-call schedules via Logic Apps connectors)
* Regulated-industry AI deployments (e.g., a bank deploying agents with Entra Agent ID governance, private virtual networks, and OpenTelemetry-based compliance tracing)
* Cross-system workflow automation (e.g., an HR onboarding agent that provisions accounts across Active Directory, Jira, and Slack via 1,400+ Logic Apps connectors)
* One-click deployment to Microsoft 365 (e.g., deploying a department-specific productivity agent directly to Microsoft Teams and Microsoft 365 Copilot)
