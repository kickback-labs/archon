---
cloud_provider: "Azure"
service_category: "networking"
service_name: "Virtual Network Manager"
pricing_model: "on-demand"
managed: true
tier: 3
---
## Azure Virtual Network Manager

### Description
Azure Virtual Network Manager (AVNM) is a centralized network management service that enables organizations to group, configure, deploy, and manage virtual networks (VNets) globally across subscriptions and tenants from a single control plane. Administrators define a management scope over a list of subscriptions or management groups, create logical network groups (with static membership or dynamic membership via Azure Policy), and then apply three types of configurations across those groups: Connectivity (hub-and-spoke or mesh topologies with optional direct spoke-to-spoke connectivity), Security Admin (high-priority firewall rules enforced before NSG rules), and Routing (user-defined routes at scale). Configurations are explicitly deployed to target regions and do not take effect until committed. AVNM also provides centralized IP address management (IPAM) to allocate non-overlapping address space from shared pools, and reachability analysis to troubleshoot connectivity between Azure resources. Pricing is based on per-VNet enrollment and the number of configurations deployed. The subscription-based pricing model retires February 6, 2028.

### Use Cases
* Centralized governance of VNet connectivity policies across hundreds of subscriptions (e.g., applying a single hub-and-spoke connectivity configuration across all VNets in an enterprise landing zone without manual peering setup)
* Enforcing baseline security rules that take precedence over individual team NSGs (e.g., blocking all inbound traffic from the internet to a class of VNets using Security Admin rules, which developers cannot override with permissive NSG rules)
* Automated mesh connectivity between spoke VNets (e.g., enabling direct VM-to-VM communication between spoke VNets without routing through a hub, reducing latency for inter-spoke traffic)
* Organization-wide IP address management and CIDR allocation (e.g., automatically assigning non-overlapping /24 blocks from a shared 10.0.0.0/8 pool to new VNets to prevent address conflicts with on-premises and multi-cloud ranges)
* Safe, staged rollout of network changes (e.g., deploying a new routing configuration to a pilot region first, validating behavior, then rolling it out region by region)
* Reachability troubleshooting across complex topologies (e.g., analyzing why traffic from a spoke VNet cannot reach a shared service endpoint and identifying which Azure policy or UDR is blocking the path)
* Democratized self-service connectivity with guardrails (e.g., letting application teams create their own local security admin rules while central IT enforces global deny rules they cannot modify)
* Scaling user-defined route management without scripting (e.g., using a routing configuration to propagate the same UDRs to all subnets across 50 VNets in one deployment)
