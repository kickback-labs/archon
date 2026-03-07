# Hub-and-Spoke Network

## Description

The Hub-and-Spoke pattern is the standard enterprise network topology for large-scale cloud environments. A central "hub" virtual network (VPC/VNet) acts as the primary transit and security inspection point. Workload networks ("spokes") connect exclusively to the hub — not to each other. All intra-spoke and internet-bound traffic routes through the hub, where centralised security appliances (Next-Generation Firewalls, Network Virtual Appliances, IDS/IPS) inspect and control every flow.

This topology provides centralised governance and simplified compliance: security teams configure firewall rules in one place, and those rules apply uniformly to all spokes. VPN and dedicated connections (Direct Connect, ExpressRoute, Interconnect) terminate in the hub, providing hybrid connectivity to all spokes through a single managed egress point.

## When to Use

- Large enterprise cloud deployments with many workload accounts or VPCs that need centralised security inspection
- Hybrid cloud environments where on-premises connectivity must be shared across multiple cloud workloads
- Compliance environments requiring all traffic to pass through a centralised inspection and logging chokepoint
- Multi-account organisations (AWS Landing Zone, Azure Landing Zone, GCP Landing Zone) — hub-and-spoke is the default recommended topology

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `networking` | Hub VPC/VNet with NVA/NGFW, Transit Gateway (AWS), Azure Virtual WAN, or Cloud Hub (GCP); spoke VPCs peered to hub; VPN/ExpressRoute in hub |
| `security_identity` | Centralised firewall rules, intrusion detection, egress filtering, centralised DNS |
| `devops` | Network flow logging (VPC Flow Logs), centralised firewall log aggregation, network topology monitoring |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Security** | All traffic passes through a single inspection point — uniform policy enforcement across all workloads |
| **Operational simplicity** | Security changes are made in one place and apply everywhere |
| **Bandwidth bottleneck** | The hub's NVA throughput is a ceiling — high-bandwidth spoke-to-spoke traffic saturates the hub |
| **Latency** | All spoke-to-spoke traffic traverses the hub — adds 1–5ms of latency compared to direct peering |
| **Cost** | NVA licensing and hub compute costs are ongoing, even during low-traffic periods |

## Common Pitfalls

- Undersizing the hub NVA for peak spoke-to-spoke traffic — the hub becomes the bottleneck during data-intensive inter-workload operations
- Not implementing spoke-to-spoke direct peering as an escape hatch for latency-sensitive high-bandwidth flows (see Full Mesh / Direct Peering)
- Hub as a single point of failure — the hub must itself be deployed with zone redundancy
- Not automating spoke onboarding — manually managing peering connections for dozens of spokes is error-prone
