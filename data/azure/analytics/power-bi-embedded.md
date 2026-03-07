---
cloud_provider: "Azure"
service_category: "analytics"
service_name: "Power BI Embedded"
pricing_model: "subscription"
managed: true
tier: 2
---
## Azure Power BI Embedded

### Description
Power BI Embedded is an Azure service that allows independent software vendors (ISVs) and developers to embed rich, interactive Power BI reports, dashboards, and tiles directly into custom applications without requiring end users to hold Power BI licenses. It uses an app-owns-data model in which the application authenticates to Power BI using a service principal or master user, then issues embed tokens to end users — making it suitable for embedding analytics in customer-facing SaaS products or multi-tenant applications. Capacity is provisioned through Azure A-SKUs (A1–A8), which can be scaled up or down on demand, paused when not in use, and billed hourly, making it cost-effective for development or variable-load production scenarios. For organizations embedding for internal users (user-owns-data), Power BI Premium (P-SKUs) or Microsoft Fabric (F-SKUs) are the recommended alternatives. Power BI Embedded integrates with Microsoft Fabric, allowing Fabric items such as semantic models and paginated reports to be embedded alongside classic Power BI content.

### Use Cases
* ISV SaaS embedding — embed branded Power BI dashboards and reports in a multi-tenant customer-facing application with no per-user Power BI license requirement (e.g., a logistics SaaS platform showing each customer their own shipment analytics)
* Custom analytics portals — build internal or external portals with embedded interactive reports, applying row-level security (RLS) to scope data per tenant or user
* White-labelled BI — present Power BI visuals fully branded to the ISV's product identity using custom themes and embed configuration options
* Dev/test analytics environments — use free embed trial tokens with a Pro license for prototyping before committing to capacity
* Pay-per-use capacity scaling — pause A-SKU capacity during off-hours to eliminate idle charges, suitable for applications with predictable usage windows
* Paginated report embedding — embed pixel-perfect, paginated reports (RDL format) for operational reporting use cases such as invoices or regulatory filings
