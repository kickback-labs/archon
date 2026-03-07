---
cloud_provider: "GCP"
service_category: "ai_ml"
service_name: "Conversational Agents"
pricing_model: "per-request"
managed: true
tier: 2
---
## GCP Conversational Agents (Dialogflow CX)

### Description
Conversational Agents (formerly Dialogflow CX) is GCP's advanced platform for building enterprise-grade conversational AI agents — virtual agents that handle concurrent conversations with end-users across text and voice channels. It supports two agent paradigms: flow-based agents (using a visual state machine of pages, intents, and transitions for explicit conversation control) and generative playbook-based agents (using LLM-powered goal-oriented playbooks for more flexible, open-ended interactions). Agents can combine both paradigms in a single deployment and integrate with data stores for grounded, document-backed answers. Built-in integrations cover telephony (Phone Gateway, SIP trunks, Twilio), text channels (Dialogflow Messenger, Slack, Google Chat, Meta platforms), and arbitrary REST/gRPC APIs via webhooks. The platform supports multilingual agents, CMEK, VPC Service Controls, and regional data residency for compliance-sensitive deployments.

### Use Cases
* Building IVR (interactive voice response) systems and virtual call center agents that handle customer service calls over telephony integrations (e.g., SIP trunk or Dialogflow Phone Gateway) with intent detection and form-filling flows
* Deploying customer-facing chatbots on websites or mobile apps using the Dialogflow Messenger widget or the REST API, routing complex queries to live agents via fulfillment webhooks
* Creating generative playbook agents that answer freeform questions by grounding responses in internal knowledge bases (e.g., product documentation uploaded to a Vertex AI Search data store)
* Implementing multi-turn, multi-language virtual assistants for retail, financial services, or telecom with prebuilt flow components (account balance, order status, authentication) and built-in A/B experiment support
* Designing modular agent flows with sub-agents, versions, and environments for staged rollout (dev → staging → production) with continuous test pipelines and validation tools
* Building voice-first agents with speech model selection, voice cloning, speech adaptation, and DTMF fallback for telephony, integrated with Google's STT and TTS infrastructure
