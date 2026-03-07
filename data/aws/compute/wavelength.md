---
cloud_provider: "AWS"
service_category: "compute"
service_name: "Wavelength"
pricing_model: "on-demand"
managed: true
tier: 3
---
## AWS Wavelength

### Description
AWS Wavelength embeds AWS compute and storage services within telecommunications providers' 5G networks, enabling developers to build applications that require ultra-low latency to mobile and connected devices at the network edge. Wavelength Zones are AWS infrastructure deployments at the edge of telco networks, and they expose the same AWS APIs, tools, and services as a standard AWS region, so existing applications require minimal modification. Data processed in a Wavelength Zone stays within the geographic boundary defined by the telco's network, helping customers meet data residency and regulatory requirements. The service is built on the AWS Nitro System and is sovereign-by-design. Wavelength integrates with AWS partners including Verizon, Vodafone, KDDI, and SK Telecom.

AWS Wavelength is ideal for latency-sensitive workloads where even single-digit millisecond response times matter, such as real-time AI inference on the edge, live video processing, or interactive gaming.

### Use Cases
* Meeting strict data residency requirements by keeping data within country or jurisdiction boundaries (e.g., regulated industries in healthcare and finance)
* Accelerating AI/ML inference at the edge close to 5G devices (e.g., real-time image analytics in retail or medical diagnostics)
* Ultra-low latency gaming platforms that require sub-10ms response times for players on 5G networks
* Live video production and media streaming at the edge (e.g., real-time transcoding and delivery for live broadcasts)
* Industrial IoT and smart factory applications requiring local compute with cloud connectivity
* Augmented reality (AR) and virtual reality (VR) applications served over 5G with low-latency rendering
