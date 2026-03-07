---
cloud_provider: "GCP"
service_category: "security_identity"
service_name: "Chrome Enterprise Premium"
pricing_model: "subscription"
managed: true
tier: 2
---
## GCP Chrome Enterprise Premium

### Description
Chrome Enterprise Premium is Google Cloud's zero-trust access and secure enterprise browser platform, evolved from BeyondCorp Enterprise. It implements Google's BeyondCorp model: access to web applications, VMs, and APIs is granted per-request based on verified user identity, device security posture, and contextual signals — with no reliance on a traditional VPN. The service provides context-aware access policies via Identity-Aware Proxy (IAP) for Google Cloud workloads, on-premises and AWS/Azure apps (via an app connector or on-premises connector), and SAML-based SaaS applications (via a security gateway). In addition to access control, Chrome Enterprise Premium delivers enterprise browser-level threat and data protection: configurable DLP (blocking copy/paste, download, and print of sensitive data), real-time phishing and malware detection with sandboxing, and threat alerting and reporting — all enforced through the Chrome browser. Access decisions can incorporate user/group membership, IP address, geographic location, time/date restrictions, device management state, device certificates, login credential strength, Chrome security posture, and third-party endpoint signals from partners including CrowdStrike, Microsoft Intune, Check Point, Lookout, Tanium, and VMware.

### Use Cases
* Provide secure remote access to internal web applications on Google Cloud, other clouds, or on-premises without requiring a VPN (e.g., employees accessing an internal HR portal from personal devices)
* Enforce least-privilege access to the Google Cloud console and APIs based on device compliance posture (e.g., block access from devices missing current OS patches)
* Protect SAML-based SaaS applications with context-aware policies evaluated at login time (e.g., block access to Salesforce from unmanaged devices in high-risk geographies)
* Deploy browser-enforced DLP controls to prevent copying, pasting, downloading, or printing sensitive data from enterprise web applications — without requiring endpoint agents
* Integrate third-party EDR scores (e.g., CrowdStrike Falcon ZTA, Microsoft Intune device compliance) into access-level conditions to gate resource access on real-time device health
* Secure access to SSH and RDP ports on Compute Engine VMs without exposing them to the public internet, using IAP TCP tunneling with certificate-based access
* Enable contractors and partners to access a single internal application from their own devices without onboarding them to the corporate VPN or network
