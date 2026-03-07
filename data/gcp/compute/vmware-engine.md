---
cloud_provider: "GCP"
service_category: "compute"
service_name: "VMware Engine"
pricing_model: "on-demand"
managed: true
tier: 3
---
## GCP VMware Engine (GCVE)

### Description
Google Cloud VMware Engine (GCVE) is a fully managed, native VMware Cloud Foundation (VCF) environment running on dedicated, single-tenant Google Cloud infrastructure. It lets organizations lift and shift their existing VMware vSphere, vSAN, NSX-T, and vCenter workloads to Google Cloud without modifying applications, tools, automation scripts, or operational runbooks. A private cloud (SDDC) can be provisioned in approximately 30 minutes across 24+ global regions. Google manages the full VMware software stack lifecycle—including patching, upgrades, and hardware replacement—while customers retain administrative access to vCenter, NSX-T, and vSAN through the familiar VMware interfaces. Networking is built on Google Cloud's highly performant, fully redundant infrastructure with up to 200 Gbps capacity and a 99.99% availability SLA. GCVE integrates natively with Google Cloud VPC via private layer-3 connectivity, enabling secure access to all Google Cloud services (BigQuery, Cloud Storage, Vertex AI, Cloud Interconnect) without traffic traversing the public internet. Storage can be scaled independently from compute by attaching Google Cloud NetApp Volumes or Filestore as NFS datastores alongside built-in vSAN storage. BYOL (Bring Your Own License) is supported for VMware Cloud Foundation licenses purchased from Broadcom. Pricing is based on node consumption (minimum 3 nodes) with on-demand and committed use discount (1- or 3-year) options available.

### Use Cases
* Data center exit or consolidation where the entire VMware SDDC must move to the cloud without application refactoring or infrastructure changes (e.g., retiring on-premises vSphere clusters within a defined timeline)
* Disaster recovery site on Google Cloud using VMware Site Recovery Manager (SRM) or Zerto to replicate on-premises VMs to GCVE with defined RTO and RPO objectives
* Burst capacity for on-premises VMware environments during peak demand periods (e.g., Black Friday retail traffic or end-of-quarter financial processing) without capital expenditure
* Virtual desktop infrastructure (VDI) using VMware Horizon or Citrix on GCVE, taking advantage of on-demand scale and global regions to serve remote workers
* Application modernization bridge: run legacy VMware workloads in GCVE while modernizing select components to GKE, Cloud Run, or Cloud SQL, connected via native VPC
* Regulated industries (financial services, healthcare) requiring physical isolation of workloads and familiar VMware operational controls while accessing cloud services
* Oracle and SAP workloads that run on VMware on-premises and need a certified lift-and-shift path to Google Cloud without replatforming to managed database services
