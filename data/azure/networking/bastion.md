---
cloud_provider: "Azure"
service_category: "networking"
service_name: "Bastion"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Bastion

### Description
Azure Bastion is a fully managed PaaS service that provides secure, browser-based or native-client RDP and SSH connectivity to virtual machines (VMs) directly over TLS on port 443, without requiring the VMs to have public IP addresses, agents, or special client software. Deployed inside a VNet using a dedicated subnet (AzureBastionSubnet), it protects VMs from external port scanning and eliminates the need to expose RDP (3389) or SSH (22) ports to the internet. Bastion serves all VMs in the VNet—and in peered VNets—from a single deployment, reducing management overhead. Four SKUs are available: Developer (free, shared infrastructure, dev/test), Basic (dedicated, fixed capacity), Standard (scalable, native client, file transfer, shareable links), and Premium (all Standard features plus session recording and private-only deployment without a public IP). Azure Bastion integrates with Microsoft Entra ID authentication and supports Kerberos for Windows VMs.

### Use Cases
* Secure VM administration without public IPs or exposed RDP/SSH ports (e.g., connecting to a fleet of backend VMs in a private subnet directly from the Azure portal without modifying NSG rules)
* Compliance-driven session recording (e.g., capturing all RDP/SSH administrator sessions to VMs for audit and forensic purposes using the Premium SKU)
* Native RDP/SSH client access without a jump server (e.g., using the locally installed Windows Remote Desktop client or OpenSSH to connect to Azure VMs through Bastion Standard, with full file transfer support)
* Reducing attack surface in zero-trust architectures (e.g., disabling all inbound internet-facing ports on VM NSGs and using Bastion as the sole access path)
* Centralized access for hub-and-spoke topologies (e.g., deploying one Bastion instance in a hub VNet and using VNet peering to access VMs in multiple spoke VNets)
* Shared access via shareable links (e.g., generating a time-limited link so a contractor can connect to a specific VM without needing Azure portal access)
