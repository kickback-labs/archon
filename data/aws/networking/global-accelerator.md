---
cloud_provider: "AWS"
service_category: "networking"
service_name: "Global Accelerator"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Global Accelerator

### Description
AWS Global Accelerator is a network layer service that uses Anycast to route user traffic through the AWS global network, entering at the nearest edge location rather than traversing the public internet. It provides two static global IP addresses that serve as fixed entry points to application endpoints such as ALBs, NLBs, EC2 instances, or Elastic IPs in one or more AWS regions. Global Accelerator performs continuous health checks and automatically reroutes traffic to healthy endpoints within seconds in the event of failure, without relying on DNS TTLs. For standard accelerators, traffic management uses traffic dials (per endpoint group) and endpoint weights. For custom routing accelerators, traffic is deterministically steered to specific EC2 instances in a fleet — useful for stateful applications. TCP and UDP are both supported, and TCP connections are terminated at the edge for reduced round-trip time to application servers.

### Use Cases
* Improving performance for global TCP/UDP applications by routing through the AWS backbone (e.g., multi-region gaming or VoIP services)
* Achieving fast, automatic failover across AWS regions without DNS cache propagation delays (e.g., active-standby disaster recovery)
* Exposing applications via stable static IP addresses that do not change when endpoints are updated (e.g., enterprise firewall allowlisting)
* Accelerating API workloads by terminating TCP connections at the edge (e.g., global REST APIs with latency-sensitive consumers)
* Deterministically routing IoT device traffic to specific backend instances using custom routing accelerators
