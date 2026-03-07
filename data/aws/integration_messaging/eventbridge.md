---
cloud_provider: "AWS"
service_category: "integration_messaging"
service_name: "EventBridge"
pricing_model: "per-request"
managed: true
tier: 1
---
## AWS EventBridge

### Description
Amazon EventBridge is a serverless event bus that routes events between AWS services, SaaS applications, and custom application components without requiring custom integration code. It processes events from over 200 AWS services natively, from third-party SaaS providers (Zendesk, Datadog, Shopify, and others) via partner event sources, and from custom applications via the PutEvents API. Event rules match on event content using pattern matching and route matching events to targets including Lambda, SQS, SNS, Step Functions, API Gateway, and more. EventBridge Scheduler enables reliable scheduling of millions of one-time or recurring tasks. A schema registry with automatic schema discovery allows teams to discover and share event schemas across their organisation.

### Use Cases
* Decoupling microservices through event-driven architecture (e.g., triggering downstream services on order state changes without direct coupling)
* Reacting to AWS infrastructure events in real time (e.g., auto-remediating non-compliant resources on CloudTrail events)
* SaaS integration routing (e.g., routing Zendesk ticket events to a Lambda function for CRM synchronisation)
* Scheduled tasks and cron jobs at scale (e.g., triggering nightly batch jobs or delayed follow-up reminders using EventBridge Scheduler)
* Audit and compliance monitoring (e.g., capturing all EC2 state change events to an SQS queue for compliance logging)
