---
cloud_provider: "GCP"
service_category: "ai_ml"
service_name: "Vertex AI Agent Builder"
pricing_model: "on-demand"
managed: true
tier: 1
---
## GCP Vertex AI Agent Builder

### Description
Vertex AI Agent Builder is GCP's open, full-stack platform for building, deploying, scaling, and governing enterprise-grade AI agents and multi-agent systems. It provides three pillars: Build (via the open-source Agent Development Kit (ADK) with support for LangGraph, CrewAI, and other frameworks; open protocols including Model Context Protocol (MCP) and Agent2Agent (A2A) for interoperability; and 100+ connectors to enterprise systems via Apigee and Application Integration), Scale (via Agent Engine — a serverless, auto-scaling managed runtime for deploying agents with session/memory management, evaluation, and sandboxed code execution), and Govern (native Google Cloud IAM identity per agent, full tracing/logging/monitoring, Model Armor for runtime safety, and Security Command Center integration). Agents can be grounded in enterprise data using Vertex AI Search (RAG out of the box), Vector Search (hybrid retrieval), Google Search, and Google Maps.

### Use Cases
* Building multi-agent workflows that orchestrate specialized agents — using ADK or open-source frameworks — to handle complex, multi-step enterprise business processes such as document processing, procurement, and customer service escalation
* Deploying production AI agents to Agent Engine for serverless, auto-scaling execution with persistent session memory, so agents maintain context across conversation turns without custom infrastructure
* Connecting agents to enterprise data sources and APIs through MCP servers, 100+ pre-built integration connectors, and Apigee-managed APIs to ground responses in authoritative organizational knowledge
* Enabling cross-framework, cross-vendor agent collaboration using the open A2A protocol, allowing agents built on different stacks (ADK, LangGraph, Salesforce, ServiceNow) to discover each other and work together
* Publishing internally built agents to Gemini Enterprise for controlled enterprise-wide distribution with centralized governance, monitoring, and access controls
