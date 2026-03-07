# Full Mesh / Direct Peering

## Description

In a Full Mesh network topology, every virtual network (VPC/VNet) is directly peered with every other virtual network, without traffic routing through a central hub. Direct peering eliminates hub latency and bandwidth constraints — traffic flows along the shortest possible path at wire speed. However, VPC peering is typically non-transitive (Network A peered with B and B peered with C does not give A connectivity to C), so a true full mesh requires O(n²) peering connections.

In practice, Full Mesh is rarely applied organisation-wide due to management complexity. Instead, Direct Peering is used selectively between specific pairs of VPCs/VNets that have ultra-low latency or high-bandwidth requirements that make hub routing impractical.

## When to Use

- Ultra-low latency, high-throughput communication between specific network pairs where hub routing overhead is prohibitive
- Database replication between two VPCs — sustained high-volume replication traffic would saturate hub NVA bandwidth
- Large-scale data synchronisation or file transfer between specific workloads
- Gaming or financial trading platforms where sub-millisecond routing matters

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `networking` | Direct VPC peering connections between specific network pairs; no intermediate routing through firewall NVAs |
| `security_identity` | Security enforced at the host/pod level (security groups, NACLs) rather than at a centralised firewall — zero-trust approach required |

## Full Mesh vs Selective Direct Peering

| Approach | Description | Use case |
|---|---|---|
| **Full Mesh** | Every VPC peered with every other | Small number of VPCs (≤ 5) where all need direct connectivity |
| **Selective Direct Peering** | Only specific pairs are directly peered | High-bandwidth pairs that would saturate the hub; all other traffic still routes through hub |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Latency** | Lowest achievable inter-VPC latency — no hub routing overhead |
| **Bandwidth** | No hub NVA bandwidth ceiling — full VPC-to-VPC bandwidth available |
| **Security** | No centralised inspection — security must be enforced at the endpoint level (security groups, host firewalls) |
| **Management complexity** | O(n²) peering connections — becomes unmanageable at scale |
| **Transitivity** | VPC peering is not transitive — cannot use A-B and B-C peering to route A→C traffic |

## Common Pitfalls

- Attempting a full mesh for more than 5–6 VPCs — the number of peering connections grows quadratically
- Not implementing host-level security controls when bypassing hub firewall inspection — direct peering creates a flat network between the two VPCs
- Confusing peering non-transitivity — a common mistake that results in connectivity gaps discovered at runtime
