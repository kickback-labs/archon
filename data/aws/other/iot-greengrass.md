---
cloud_provider: "AWS"
service_category: "other"
service_name: "IoT Greengrass"
pricing_model: "per-request"
managed: true
tier: 2
---
## AWS IoT Greengrass

### Description
AWS IoT Greengrass is an open-source edge runtime and cloud service for building, deploying, and managing software on IoT devices and edge hardware. It extends AWS compute, messaging, and machine learning capabilities to edge devices, enabling them to run Lambda functions, containerized applications, or custom components locally — even with intermittent or no cloud connectivity. Greengrass uses a modular component architecture, allowing builders to compose device software from prebuilt AWS-published components (e.g., Stream Manager, Shadow Manager, Docker Application Manager) or custom components, and deploy them at scale without requiring firmware updates. The service integrates with AWS IoT Core for cloud connectivity and device management, and with SageMaker for edge ML inference. Note: Greengrass V1 reached end-of-support on June 1, 2026; only Greengrass V2 is actively supported.

### Use Cases
* Edge ML inference for industrial IoT (e.g., running anomaly detection models on factory sensors without cloud round-trips)
* Local data filtering and aggregation (e.g., collecting and pre-processing machine telemetry before selective cloud upload)
* Remote device fleet management (e.g., deploying and updating application components across thousands of edge devices via OTA)
* Offline-capable edge applications (e.g., running critical process control logic during intermittent connectivity)
* Smart agriculture and precision farming (e.g., local AI-based crop monitoring on edge hardware in remote fields)
* Industrial protocol bridging (e.g., translating OPC-UA or Modbus data streams from legacy equipment to MQTT)
