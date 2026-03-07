---
cloud_provider: "Azure"
service_category: "other"
service_name: "Azure Virtual Desktop"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Virtual Desktop (AVD)

### Description
Azure Virtual Desktop is a fully managed desktop and application virtualization service that delivers Windows 11, Windows 10, and Windows Server desktops and apps to any device over the internet. It is the only cloud service offering Windows 10/11 Enterprise multi-session — multiple concurrent users on a single VM — significantly reducing per-user infrastructure costs compared to traditional VDI. Microsoft manages the control plane (gateways, brokers, web access, diagnostics), while customers manage only the session host VMs and images in their Azure subscription. AVD integrates with Microsoft Entra ID for identity, Intune for endpoint management, and Azure Monitor for observability, and supports both pooled (shared) and personal (persistent) host pools with autoscale.

### Use Cases
* Remote work and BYOD enablement (e.g., delivering a full Windows 11 desktop to employees on unmanaged personal devices without exposing corporate data)
* Replacing on-premises Remote Desktop Services (RDS) deployments (e.g., migrating Citrix or RDS infrastructure to a managed Azure service)
* Regulated industry secure desktops (e.g., providing compliant, audited desktop sessions for healthcare or financial services workers handling sensitive data)
* Cost-optimized developer/knowledge worker desktops (e.g., running multi-session pooled Windows 10/11 host pools to share VM resources across users)
* Microsoft 365 Apps optimization (e.g., running Microsoft 365 in multi-user scenarios with FSLogix profile containers for persistent Office settings)
