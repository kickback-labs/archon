---
cloud_provider: "Azure"
service_category: "networking"
service_name: "Firewall Manager"
pricing_model: "on-demand"
managed: true
tier: 3
---
## Azure Firewall Manager

### Description
Azure Firewall Manager is a centralized security policy and route management service for cloud-based network perimeters. It enables organizations to author, deploy, and manage Azure Firewall policies—and integrate third-party security-as-a-service (SECaaS) providers—across two deployment architectures: secured virtual hubs (Azure Virtual WAN hubs with associated security policies) and hub virtual networks (standard VNets acting as a central firewall hub). Firewall Manager supports hierarchical policy authorship, where central IT teams define global base policies with organization-wide rules and delegate local policies to teams for self-service agility, with local policies inheriting and extending the base. It also manages Web Application Firewall (WAF) policies for Azure Front Door and Application Gateway from a single pane. Additional capabilities include centralized route management (eliminating manual UDRs on spoke VNets), DDoS protection plan association, and integration with partner SECaaS providers for advanced internet traffic filtering. Azure Firewall Policies can span multiple regions; a policy created in one region can be applied to firewalls in another.

### Use Cases
* Centralized firewall policy governance across multiple Azure regions and subscriptions (e.g., a global enterprise enforcing a single set of FQDN allow/deny rules across 20 Azure Firewall instances in different regions without per-instance rule duplication)
* Hierarchical policy with DevOps self-service (e.g., central IT authoring a base policy with locked-down outbound rules, while application teams write supplementary local policies for their specific microservice egress needs)
* Securing Azure Virtual WAN hub-and-spoke topologies (e.g., routing all branch-to-internet and VNet-to-internet traffic through an Azure Firewall in a secured virtual hub with logging and threat intelligence filtering)
* Third-party SECaaS integration for advanced internet security (e.g., routing outbound internet traffic through a Zscaler or Check Point cloud security service for user-aware filtering alongside Azure Firewall for east-west traffic)
* Centralized WAF policy management across Front Door and Application Gateway (e.g., attaching a single OWASP WAF policy with custom rules to multiple Application Gateway instances from one Firewall Manager interface)
* DDoS protection plan association at scale (e.g., linking all VNets in a management group to a shared DDoS Protection Standard plan through Firewall Manager instead of configuring each VNet individually)
* Simplified inter-hub traffic inspection in Virtual WAN (e.g., enabling Routing Intent to force all secured hub-to-hub traffic through Azure Firewall for east-west inspection and compliance logging)
