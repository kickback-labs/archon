---
cloud_provider: "Azure"
service_category: "security_identity"
service_name: "Microsoft Purview Information Protection"
pricing_model: "subscription"
managed: true
tier: 2
---
## Azure Microsoft Purview Information Protection

### Description
Microsoft Purview Information Protection (formerly Microsoft Information Protection / MIP) is a built-in, intelligent, unified, and extensible solution for discovering, classifying, and protecting sensitive data wherever it lives or travels — across Microsoft 365 apps, Azure services, on-premises file shares, and third-party cloud environments. It operates across three integrated capability layers: **Know your data** (sensitive information types, trainable classifiers, and data classification dashboards to identify sensitive content at scale), **Protect your data** (sensitivity labels applied in Office apps, Teams meetings, SharePoint, and Azure services; encryption via Azure Rights Management; and visual markings), and **Prevent data loss** (DLP policies that detect and block oversharing of sensitive items across endpoints, Exchange, Teams, SharePoint, and Chrome). Sensitivity labels are the cornerstone: a single labeling schema is applied consistently by users or automatically by auto-labeling policies across documents, emails, meetings, and schematized data in Azure SQL and Cosmos DB via the Purview Data Map. The Microsoft Information Protection SDK extends labeling to third-party applications and services. Licensing is tied to Microsoft 365 E3/E5 or equivalent compliance add-ons.

### Use Cases
* Data discovery and classification at scale — use built-in sensitive information types (credit card numbers, SSNs, PHI) and trainable classifiers (resumes, contracts) to automatically identify sensitive content across SharePoint, OneDrive, Exchange, Teams, and on-premises file shares
* Sensitivity labeling for documents and email — apply labels (e.g., Confidential, Highly Confidential) manually in Office apps or automatically via auto-labeling policies; labels persist with the file and enforce encryption and access controls wherever it travels
* Encryption with customer-controlled keys — protect emails and documents with Azure Rights Management encryption; optionally use Double Key Encryption (DKE) for content that must remain inaccessible to Microsoft under any circumstance
* Data loss prevention (DLP) policy enforcement — block or warn users who attempt to share sensitive content (e.g., credit card numbers) via email, Teams chat, SharePoint uploads, or through Chrome browser extensions and endpoints running Windows 10/11
* Meeting and Teams message protection — apply sensitivity labels to Teams meetings and channels to control recording, transcription, and external participant permissions
* Unified labeling across hybrid environments — use the information protection scanner to label and protect files on on-premises file servers; extend labels to cloud apps via Microsoft Defender for Cloud Apps
* Purview Data Map auto-labeling — propagate sensitivity labels to schematized data columns in Azure SQL Database, Azure Cosmos DB, and Azure Data Lake Storage discovered by the Purview Data Map scan
