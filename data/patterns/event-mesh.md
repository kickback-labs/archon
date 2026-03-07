# Event Mesh

## Description

An Event Mesh is a decentralised network of interconnected event brokers capable of intelligently routing event streams between producers and consumers regardless of their physical location, protocol, or cloud environment. Unlike a Service Mesh (which manages synchronous HTTP/gRPC within a single Kubernetes cluster), an Event Mesh routes asynchronous event-driven traffic across wildly diverse environments: cloud-native microservices, on-premises legacy systems, IoT edge devices, and SaaS applications.

The Event Mesh abstracts the underlying topology — a publisher emits an event without needing to know the identity, location, or online status of any consumer. The mesh routes the event to all subscribed consumers, bridging protocol differences (MQTT, AMQP, JMS, HTTP webhooks) and geographic distances transparently.

Leading implementations: Solace PubSub+, Apache ActiveMQ Artemis clusters, AWS EventBridge multi-region, Google Pub/Sub with cross-region subscriptions.

## When to Use

- Routing asynchronous event-driven traffic across diverse environments — cloud, on-premises, edge, and third-party SaaS
- Replacing point-to-point integration spaghetti with a governed, discoverable event routing fabric
- IoT architectures where edge devices, on-premises gateways, and cloud analytics all participate in the same event flow
- Large enterprise integrations where producers and consumers span multiple teams, geographies, and cloud providers
- Building a true event-driven architecture that decouples producers from consumers across organisational boundaries

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `integration_messaging` | The event brokers forming the mesh; event schema registry; topic/subscription management |
| `networking` | Private connectivity between mesh nodes (VPN, ExpressRoute, Interconnect) for intra-mesh broker replication |
| `security_identity` | Event-level access control — which producers can publish to which topics, which consumers can subscribe |
| `migration_hybrid` | Bridges between legacy on-premises messaging systems (JMS, MQ) and cloud-native event brokers |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Decoupling** | Producers and consumers are fully decoupled — neither knows about the other |
| **Reach** | Events flow across clouds, on-premises, and edge without point-to-point custom integrations |
| **Complexity** | Event routing rules, protocol bridging, and mesh topology management are significant operational overhead |
| **Ordering** | Global event ordering across mesh nodes is difficult — only partition-level ordering guarantees apply |
| **Observability** | Tracking an event across multiple mesh nodes in different environments requires end-to-end event correlation IDs |

## Common Pitfalls

- Using an Event Mesh when a single regional message broker (Kafka, SQS) would suffice — the Event Mesh complexity is only justified by genuine cross-environment routing requirements
- Not defining event schema contracts centrally — events flowing through a mesh without a schema registry become unmaintainable
- No dead-letter handling at the mesh level — failed event routing must be captured and replayable
