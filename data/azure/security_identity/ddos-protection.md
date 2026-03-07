---
cloud_provider: "Azure"
service_category: "security_identity"
service_name: "DDoS Protection"
pricing_model: "subscription"
managed: true
tier: 2
---
## Azure DDoS Protection

### Description
Azure DDoS Protection is a managed, always-on DDoS mitigation service that defends Azure resources against distributed denial-of-service attacks at Layer 3 and Layer 4. It is automatically tuned to protect specific resources in a virtual network using machine learning-based traffic profiling, requiring no application or infrastructure changes to enable. Two tiers are available: DDoS Network Protection (subscription-based, per-VNet, includes DDoS Rapid Response support and cost guarantees) and DDoS IP Protection (pay-per-protected-IP model for more granular coverage). All Azure subscriptions receive a basic infrastructure-level DDoS defense at no cost; DDoS Protection adds enhanced, resource-specific mitigation on top of that baseline. For Layer 7 web application protection, DDoS Protection is designed to be combined with Azure WAF or Application Gateway WAF.

### Use Cases
* Always-on protection for public IP resources in production VNets — automatically mitigates volumetric, protocol, and resource-layer attacks without manual intervention
* Multi-layered DDoS defense — combine DDoS Network Protection (L3/L4) with Azure Application Gateway WAF (L7) to protect web-facing applications end-to-end
* Attack analytics and post-incident reporting — stream mitigation flow logs to Microsoft Sentinel or a SIEM, receive five-minute increment attack reports and full post-attack summaries
* Cost guarantee for attack-related scale-out — receive Azure service credits for compute and data transfer costs incurred due to documented DDoS attacks (DDoS Network Protection tier)
* Alerting and telemetry via Azure Monitor — configure alerts on attack start/stop and throughput metrics, integrated with Splunk, Azure Storage, and email notifications
* DDoS Rapid Response (DRR) access — engage Microsoft's dedicated DDoS response team during active attacks for investigation and guidance (DDoS Network Protection tier only)
