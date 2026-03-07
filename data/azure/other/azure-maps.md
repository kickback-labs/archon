---
cloud_provider: "Azure"
service_category: "other"
service_name: "Azure Maps"
pricing_model: "per-request"
managed: true
tier: 2
---
## Azure Maps

### Description
Azure Maps is a collection of geospatial REST APIs and client SDKs that provide location intelligence capabilities — including mapping, search, routing, traffic, weather, geofencing, and time zone services — for integration into web, mobile, and backend applications. The Web SDK leverages WebGL for high-performance rendering of interactive vector and raster maps in browsers, while REST APIs expose the same capabilities for server-side processing. The Search service supports geocoding, reverse geocoding, POI search, and autocomplete; the Route service computes optimal paths for multiple travel modes (car, truck, bicycle, walking, electric vehicle) with real-time traffic and historical traffic pattern awareness; and the Traffic service provides live traffic flow and incident data. The Geofencing service allows developers to store spatial boundaries in Azure and query whether a coordinate is inside or outside a fence, enabling location-triggered events. Azure Maps data is powered by TomTom (a disclosed subprocessor) and is not available in China or South Korea. The service integrates natively with Microsoft Fabric Real-Time Intelligence for map visualization layers and with Power BI via a dedicated visual. Authentication uses SAS key or Microsoft Entra ID (AAD).

### Use Cases
* Embedding interactive maps in web and mobile applications (e.g., displaying a store locator with clickable POI pins and custom tile layers in a retail web app using the Azure Maps Web SDK)
* Multi-modal route planning and logistics optimization (e.g., computing optimized multi-stop delivery routes for a fleet of trucks considering weight restrictions, hazmat rules, and real-time traffic using the Route service)
* Geofencing and location-triggered automation (e.g., triggering an Azure Function when a delivery vehicle's GPS coordinate exits a predefined warehouse geofence, initiating a customer ETA notification)
* Real-time traffic monitoring for transportation apps (e.g., overlaying live traffic flow and incident tiles on a dispatch dashboard to help operators reroute field technicians around congestion)
* Geocoding and address validation at scale (e.g., batch-geocoding a CRM database of customer addresses to latitude/longitude coordinates for downstream spatial analytics in Azure Synapse)
* Weather-aware routing and IoT asset tracking (e.g., retrieving weather conditions along a planned delivery route to flag hazardous segments, or mapping real-time GPS telemetry from IoT-connected vehicles on a live map)
* Spatial analytics and Power BI reporting (e.g., visualizing regional sales performance as a choropleth map layer in Power BI using the Azure Maps Power BI visual with custom polygon boundaries)
