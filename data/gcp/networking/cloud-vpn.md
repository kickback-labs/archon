---
cloud_provider: "GCP"
service_category: "networking"
service_name: "Cloud VPN"
pricing_model: "on-demand"
managed: true
tier: 2
---
## GCP Cloud VPN

### Description
Cloud VPN securely extends on-premises or peer networks to Google Cloud VPC networks using IPsec VPN tunnels, encrypting all traffic in transit. It offers two gateway types: HA VPN (high-availability, recommended) and Classic VPN (legacy). HA VPN automatically provisions two external IP addresses across two interfaces per gateway, supports only dynamic BGP routing via Cloud Router, and delivers a 99.99% SLA in a redundant two-tunnel topology or 99.9% SLA with a single-interface configuration. Classic VPN uses a single interface and external IP, supports static (policy-based or route-based) routing, and offers a 99.9% SLA. Each Cloud VPN tunnel supports up to 250,000 packets per second (approximately 1–3 Gbps depending on packet size); multiple tunnels can be created to increase aggregate throughput. HA VPN supports IPv4-only, IPv6-only, and dual-stack (IPv4/IPv6) configurations and IKEv1/IKEv2 with configurable cipher suites. Cloud VPN can be layered over Cloud Interconnect (HA VPN over Cloud Interconnect) for IPsec-encrypted private connectivity. Cloud VPN traffic between two GCP gateways stays within Google's network and does not traverse the public internet.

### Use Cases
* Connecting on-premises data centers or branch offices to GCP VPC networks with encrypted IPsec tunnels when dedicated circuits are not available or cost-justified
* Establishing secure multi-cloud connectivity between GCP and AWS or Azure using HA VPN with BGP dynamic routing
* Linking multiple VPC networks across regions or projects using HA VPN gateways for private inter-VPC communication
* Adding IPsec encryption on top of Cloud Interconnect VLAN attachments (HA VPN over Cloud Interconnect) to meet data security compliance requirements
* Supporting hybrid DNS and Private Google Access for on-premises hosts to reach GCP internal IPs and Google APIs without NAT
* Providing SD-WAN and SASE overlay connectivity using GRE encapsulation through Cloud VPN tunnels
* Scaling throughput beyond a single tunnel's capacity by adding parallel HA VPN tunnels and distributing traffic via ECMP BGP
