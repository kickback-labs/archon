---
cloud_provider: "Azure"
service_category: "other"
service_name: "Azure Digital Twins"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Digital Twins

### Description
Azure Digital Twins is a platform as a service (PaaS) that enables creation of comprehensive digital representations — called twin graphs — of real-world environments such as buildings, factories, energy networks, railways, cities, and more, using customizable models defined in Digital Twins Definition Language (DTDL), a JSON-LD-based schema language. Twins are structured as a property graph where nodes represent entities (rooms, machines, assets) and edges represent semantic relationships between them; this graph can be queried in real time using Azure Digital Twins' SQL-like query language. The service integrates directly with Azure IoT Hub to ingest live device telemetry and keep twin properties current, and with Azure Functions to execute custom business logic in response to twin state changes. Data history functionality automatically streams all graph updates to Azure Data Explorer for time-series querying and historical analysis. Downstream egress to Azure Data Lake, Synapse Analytics, Event Hubs, Event Grid, and Service Bus is supported via event routes. The 3D Scenes Studio (preview) provides a low-code visual builder for mapping digital twin graph state onto 3D models, enabling spatial monitoring dashboards.

### Use Cases
* Smart building and campus management (e.g., modeling rooms, floors, HVAC zones, and occupancy sensors as a DTDL twin graph, then querying live comfort conditions and energy consumption across a campus in real time)
* Industrial manufacturing and factory digital twins (e.g., representing production lines, machines, and their inter-dependencies as twins, then triggering Azure Functions-based maintenance workflows when sensor telemetry indicates anomalous vibration)
* Energy grid and utility network modeling (e.g., creating a digital twin of a power distribution network and running graph queries to simulate fault propagation before deploying a configuration change)
* Supply chain and logistics asset tracking (e.g., modeling warehouses, shelving units, and parcels as twins that update in real time via IoT Hub telemetry and exposing current inventory state via REST API to a WMS)
* Smart city infrastructure (e.g., representing traffic signals, environmental sensors, and transit vehicles as a city-scale twin graph and feeding live data into Azure Synapse for predictive traffic management)
* 3D spatial visualization of operational environments (e.g., using 3D Scenes Studio to map digital twin health data onto 3D building models so facility operations teams can visually identify equipment issues)
