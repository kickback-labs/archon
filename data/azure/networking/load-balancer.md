---
cloud_provider: "Azure"
service_category: "networking"
service_name: "Load Balancer"
pricing_model: "on-demand"
managed: true
tier: 1
---
## Azure Load Balancer

### Description
Azure Load Balancer is a fully managed, layer-4 (TCP/UDP) load balancing service that distributes inbound traffic across backend virtual machines or virtual machine scale sets according to configured rules and health probes. The Standard SKU supports availability zones, millions of concurrent flows, and a Zero Trust security model where inbound connections are closed by default and must be explicitly permitted via NSGs. It handles both public (internet-facing) and internal (private network) load balancing scenarios, and supports outbound SNAT connectivity for VMs without public IPs. Basic Load Balancer was retired on September 30, 2025; Standard Load Balancer is the current recommended SKU.

### Use Cases
* Distributing internet traffic across a fleet of VMs or VMSS (e.g., web tier horizontal scale-out)
* Internal load balancing between application tiers within a VNet (e.g., app tier to database tier traffic distribution)
* High-availability deployments spanning multiple Availability Zones (e.g., zone-redundant backend pools)
* Providing outbound SNAT connectivity for VMs in private subnets (e.g., egress for backend compute nodes)
* Port forwarding to individual VM instances for management access (e.g., inbound NAT rules for SSH/RDP)
