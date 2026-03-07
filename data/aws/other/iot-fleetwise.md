---
cloud_provider: "AWS"
service_category: "other"
service_name: "IoT FleetWise"
pricing_model: "per-request"
managed: true
tier: 3
---
## AWS IoT FleetWise

### Description
AWS IoT FleetWise is a managed service for collecting, transforming, and transferring vehicle data from connected vehicle fleets to the AWS cloud at scale. It supports intelligent, condition-based data collection — only sending data that meets defined rules (e.g., when a sensor value crosses a threshold) — reducing bandwidth and cloud storage costs compared to continuous streaming approaches. FleetWise uses a standardized vehicle signal catalog and vehicle model system to normalize data across different OEM platforms and hardware configurations without requiring a custom data collection system per vehicle type. It supports both standard CAN bus and vision system data (camera, LiDAR, radar), and automatically synchronizes collected data in the cloud for consumption by analytics and ML services. The service is designed for automotive OEMs, Tier-1 suppliers, and fleet operators building connected vehicle platforms.

### Use Cases
* AI/ML model training for ADAS and autonomous driving (e.g., collecting edge-case sensor data from production vehicles to retrain perception models)
* EV battery health monitoring (e.g., tracking charge levels, thermal events, and degradation patterns across an EV fleet)
* Fleet maintenance and prognostics (e.g., detecting early failure indicators in vehicle components to schedule proactive service)
* In-vehicle infotainment and digital experience personalization (e.g., collecting usage data to improve content recommendations)
* Connected vehicle platform development (e.g., building a scalable data pipeline from vehicle ECUs to cloud analytics services)
* Regulatory and safety data logging (e.g., capturing specific driving events required for insurance or compliance purposes)
* Fleet operations optimization (e.g., monitoring fuel consumption, driver behavior, and route efficiency across commercial fleets)
