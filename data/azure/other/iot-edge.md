---
cloud_provider: "Azure"
service_category: "other"
service_name: "Azure IoT Edge"
pricing_model: "subscription"
managed: false
tier: 2
---
## Azure IoT Edge

### Description
Azure IoT Edge is an open-source device runtime that extends Azure cloud intelligence to IoT devices by enabling the deployment, execution, and monitoring of containerized workloads (IoT Edge modules) directly on edge hardware, without requiring constant cloud connectivity. It is a feature of Azure IoT Hub and consists of three components: IoT Edge modules (Docker-compatible containers running Azure services, third-party services, or custom business logic), the IoT Edge runtime (runs on each device and manages module lifecycle, security, and communication), and a cloud-based interface for remote fleet management at scale. The runtime supports both Linux and Windows operating systems and abstracts hardware specifics, making it suitable for hardware ranging from a Raspberry Pi to an industrial server. AI capabilities — including Azure Machine Learning models, Azure Stream Analytics jobs, and custom ML workloads — can be packaged as IoT Edge modules and run on-premises for low-latency inference without round-trips to the cloud. Modules communicate with each other via configurable message pipelines and with IoT Hub (or IoT Central) for upstream telemetry and downstream command delivery. IoT Edge is available in the free and standard tiers of Azure IoT Hub with no additional charge for the runtime itself; costs arise from IoT Hub messaging and any Azure services packaged as modules.

### Use Cases
* Running AI inference at the edge (e.g., deploying a custom Azure ML object detection model as an IoT Edge module on an industrial camera to detect defects on the production line in real time without cloud round-trips)
* Local data pre-processing and bandwidth reduction (e.g., aggregating and filtering high-frequency sensor telemetry on a factory gateway device and sending only anomalies or summaries to Azure IoT Hub, reducing cloud egress costs)
* Offline-capable and disconnected scenarios (e.g., operating an edge gateway on a remote oil rig where intermittent connectivity requires local decision-making with batch sync to the cloud when connectivity is restored)
* Edge-based stream analytics (e.g., deploying an Azure Stream Analytics job as an IoT Edge module to perform real-time windowing aggregations on machine data before forwarding results to Event Hubs)
* Secure device fleet management at scale (e.g., remotely deploying and updating containerized modules across thousands of geographically distributed edge gateways using IoT Hub deployment manifests and automatic deployments)
* IoT gateway pattern for downstream devices (e.g., running IoT Edge on a gateway device that translates legacy OPC-UA or Modbus protocols from downstream PLCs into IoT Hub-compatible MQTT messages)
