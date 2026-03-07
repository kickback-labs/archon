---
cloud_provider: "GCP"
service_category: "networking"
service_name: "Cloud NAT"
pricing_model: "on-demand"
managed: true
tier: 2
---
## GCP Cloud NAT

### Description
Cloud NAT is a distributed, software-defined managed NAT service that provides outbound internet and private network address translation for Google Cloud resources without requiring proxy VMs or appliances. It is implemented in Google's Andromeda networking stack directly on the physical hosts running VMs, so it adds no additional network hop and does not reduce per-VM bandwidth. Cloud NAT supports two modes: Public NAT (outbound IPv4/IPv6-to-IPv4 internet access for resources without external IPs) and Private NAT (private-to-private translation between VPC networks or between VPC and on-premises/other cloud networks via Network Connectivity Center spokes, Cloud Interconnect, or Cloud VPN). Resources supported include Compute Engine VMs, GKE clusters, Cloud Run (via Direct VPC Egress or Serverless VPC Access), Cloud Run functions, App Engine standard, and regional internet NEGs. Cloud NAT gateways support automatic scaling of NAT IP addresses, manual IP assignment for whitelisting with partner services, and configurable port allocation per VM. It does not allow unsolicited inbound connections — only responses to established outbound connections are permitted. Metrics and logs are available via Cloud Monitoring and Cloud Logging for compliance, debugging, and accounting.

### Use Cases
* Enabling VMs without external IP addresses to download OS patches, container images, or software packages from the internet securely
* Providing outbound internet access for GKE node pools and pods running in private clusters with no public IPs
* Sharing a fixed set of external IP addresses with third-party services that whitelist by source IP (e.g., payment processors, SaaS APIs)
* Resolving overlapping IP address ranges between VPC networks or on-premises networks using Private NAT via Network Connectivity Center
* Supporting Cloud Run and Cloud Run functions with Direct VPC Egress to reach internet endpoints or private backends via NAT
* Enabling Hybrid NAT for workloads in VPC networks that communicate with on-premises or other cloud networks over Cloud Interconnect or Cloud VPN where IP address ranges conflict
* Scaling automatically to handle burst outbound traffic from autoscaling managed instance groups without manual NAT IP provisioning
