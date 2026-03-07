---
cloud_provider: "Azure"
service_category: "other"
service_name: "Azure IoT Hub"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure IoT Hub

### Description
Azure IoT Hub is a fully managed cloud gateway service that enables secure, bidirectional communication between IoT applications and millions of connected devices at scale. It acts as the central message broker in an IoT solution, supporting device-to-cloud telemetry ingestion, cloud-to-device commands, and request-reply direct method invocations. Devices authenticate via SAS tokens or X.509 certificates over TLS-secured connections, with per-device identity managed through a built-in identity registry. IoT Hub integrates natively with Azure Event Grid, Stream Analytics, and Event Hubs for downstream data routing and processing.

### Use Cases
* Industrial sensor telemetry ingestion (e.g., collecting temperature and pressure readings from factory floor equipment at millions-of-events-per-second scale)
* Remote device management (e.g., issuing firmware update commands or rebooting devices via direct methods and device twins)
* Fleet monitoring and alerting (e.g., tracking connected vehicle health and triggering alerts when thresholds are exceeded)
* Bidirectional IoT data pipelines (e.g., routing device telemetry to Azure Stream Analytics for real-time anomaly detection)
* Secure device provisioning at scale (e.g., auto-provisioning devices with IoT Hub Device Provisioning Service using X.509 certificates)
