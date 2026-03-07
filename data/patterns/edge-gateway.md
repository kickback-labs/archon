# Edge Gateway

## Description

The Edge Gateway pattern deploys ruggedised, locally-operating hardware or software at the physical edge of the network — on factory floors, remote agricultural sites, retail locations, or connected vehicles — to bridge Operational Technology (OT) and Information Technology (IT). The gateway ingests data from disparate local sensors and industrial equipment via legacy OT protocols (Modbus, OPC-UA, BACnet, CAN bus), translates payloads into cloud-native formats (MQTT, HTTP, JSON), performs local ML inference for real-time physical actuation, and manages data buffering and synchronisation over intermittent WAN connectivity.

The gateway enables local intelligence independent of cloud connectivity — a manufacturing robot does not wait for a cloud round-trip to respond to a sensor reading.

## When to Use

- IoT or industrial environments where local devices use legacy OT protocols incompatible with cloud APIs
- Latency-sensitive physical control loops that cannot tolerate cloud round-trip times (conveyor belt control, HVAC regulation, safety shutoffs)
- Sites with intermittent, unreliable, or expensive WAN connectivity — the gateway must buffer data locally until connectivity is restored
- Local ML inference is required for real-time decisions (quality inspection, predictive maintenance, anomaly detection at the edge)
- Data volume is too high to transmit raw — local pre-processing and aggregation reduce bandwidth requirements

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Edge compute hardware or software (AWS IoT Greengrass, Azure IoT Edge, GCP Cloud IoT Edge, custom embedded Linux) |
| `integration_messaging` | OT protocol adapters (Modbus, OPC-UA drivers); cloud-native messaging client (MQTT, AMQP); local event broker for edge-to-cloud sync |
| `ai_ml` | Edge ML inference runtime (TensorFlow Lite, ONNX Runtime, OpenVINO) for local model execution without cloud connectivity |
| `networking` | Local area network topology (industrial Ethernet, cellular modem, satellite link for remote sites); WAN connectivity management |
| `storage` | Local time-series data buffer for offline durability; cloud sync queue for eventual consistency with cloud analytics |
| `devops` | Remote device management and OTA updates; remote monitoring of gateway health; edge telemetry and alerting |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Offline resilience** | Local operation continues during cloud disconnection — no dependency on WAN for critical functions |
| **Latency** | Sub-millisecond local control loops — impossible via cloud round-trip |
| **Management complexity** | Managing software updates, security patches, and configuration across thousands of geographically distributed edge devices is a significant operational challenge |
| **Hardware cost** | Ruggedised edge compute hardware is more expensive than cloud compute per unit |
| **Connectivity** | Data sync and remote management depend on eventual WAN connectivity — prolonged disconnection creates data backlog |

## Common Pitfalls

- Not planning for OTA (over-the-air) updates from day one — a fleet of thousands of gateways that cannot be remotely updated is a security and operational nightmare
- Underestimating local storage requirements for buffering during extended outages
- Not designing for the "reconnect burst" — when a gateway comes back online after days of offline operation, the cloud ingestion pipeline must handle the burst of buffered data without overwhelming downstream systems
- Deploying ML models to edge devices without a model update workflow — edge models need to be updatable as conditions change
