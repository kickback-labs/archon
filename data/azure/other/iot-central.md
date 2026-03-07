---
cloud_provider: "Azure"
service_category: "other"
service_name: "Azure IoT Central"
pricing_model: "subscription"
managed: true
tier: 2
---
## Azure IoT Central

### Description
Azure IoT Central is a fully managed IoT application platform as a service (aPaaS) that dramatically reduces the complexity of building, deploying, and managing enterprise IoT solutions by providing a no-code/low-code SaaS environment on top of Azure IoT infrastructure. Unlike the lower-level Azure IoT Hub, IoT Central bundles device connectivity, device management, data visualization, rules, alerting, and data export into a single hosted application with a configurable web UI — no gateway servers or broker infrastructure to manage. Devices are modeled via device templates (based on IoT Plug and Play device models), which define telemetry schemas, properties, and commands. IoT Central supports continuous data export to Azure Blob Storage, Event Hubs, Service Bus, and Dataverse for downstream analytics, and exposes a public REST API for integration with line-of-business systems. Applications are billed on a per-device basis (Standard 0/1/2 plans; first two devices free).

### Use Cases
* Rapid IoT proof-of-concept and pilot projects (e.g., evaluating a connected asset monitoring scenario without writing infrastructure code, using industry-focused templates for retail, energy, or healthcare)
* Connected device fleet management (e.g., monitoring telemetry, configuring properties, and sending commands to thousands of field devices through a built-in operator dashboard)
* Industrial condition monitoring (e.g., setting telemetry threshold rules on factory equipment and triggering email or webhook alerts when anomalies are detected)
* Smart building and energy management (e.g., aggregating sensor data from HVAC, lighting, and metering devices and visualizing consumption trends via custom analytics dashboards)
* IoT data pipeline to downstream Azure services (e.g., continuously exporting device telemetry to Azure Event Hubs for ingestion into Azure Stream Analytics or Databricks)
* Managed IoT solution for ISVs (e.g., embedding IoT Central as the device management backend in a vertical SaaS product, using the REST API to integrate device data into a custom frontend)
