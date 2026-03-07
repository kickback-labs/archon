---
cloud_provider: "Azure"
service_category: "integration_messaging"
service_name: "Queue Storage"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Queue Storage

### Description
Azure Queue Storage is a fully managed, cloud-native message queuing service for storing large numbers of messages and enabling asynchronous, decoupled communication between application components. Each message can be up to 64 KB in size and is accessible via authenticated HTTP or HTTPS calls from anywhere in the world. Queues can hold millions of messages, limited only by the total capacity of the backing storage account, and messages have a configurable time-to-live (default 7 days; can be set to any positive value or -1 for no expiry using API version 2017-07-29 or later). Queue Storage is part of the Azure Storage account alongside Blob, Table, and File services, which means it shares the same account-level redundancy options (LRS, ZRS, GRS, GZRS) and access-control mechanisms (storage account keys, SAS tokens, and Entra ID RBAC via Azure Storage RBAC roles). It is a lightweight, low-cost queuing primitive well suited to the Web-Queue-Worker architectural pattern, where a frontend enqueues tasks and one or more background workers dequeue and process them independently. Unlike Azure Service Bus, Queue Storage does not support ordered delivery, dead-lettering, duplicate detection, or publish-subscribe; it is optimized for high-volume, at-least-once simple task queuing at minimal cost.

### Use Cases
* Decoupling a web front end from compute-intensive background processing (e.g., image resizing, report generation) so the frontend remains responsive under load
* Work distribution across a pool of autoscaled worker processes, each pulling tasks from the queue at its own pace
* Retry and back-off buffering where failed processing attempts are returned to the queue with a visibility timeout before being re-processed
* Simple task scheduling triggered by Azure Functions Queue Storage binding, invoking serverless code for each dequeued message
* Audit trail of pending work items when integrated with Azure Table Storage to log dequeue counts and processing status
* Lightweight integration between loosely coupled Azure services without the overhead or cost of a full enterprise broker like Service Bus
