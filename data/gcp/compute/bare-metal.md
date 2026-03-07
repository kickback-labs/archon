---
cloud_provider: "GCP"
service_category: "compute"
service_name: "Bare Metal Solution"
pricing_model: "subscription"
managed: true
tier: 3
---
## GCP Bare Metal Solution

### Description
Bare Metal Solution provides dedicated, single-tenant physical servers hosted in Google Cloud colocation facilities and connected to Google Cloud via a fully managed, low-latency (sub-2 ms) interconnect. It is purpose-built for running specialized workloads—primarily Oracle databases and SAP HANA—that cannot run efficiently or are not certified to run inside a hypervisor or on shared multi-tenant hardware. Unlike Compute Engine VMs, Bare Metal Solution gives customers root OS access to the physical machine, enabling them to install Oracle Real Application Clusters (RAC), Oracle Data Guard, Oracle RMAN, and custom kernel configurations exactly as they would on-premises. Google manages the data center physical infrastructure (power, cooling, networking, hardware replacement), while customers retain full control of the operating system and database software stack. Servers are provisioned with Intel Cascade Lake CPUs, high-density DRAM (up to the highest available ratios), and Tier-1 NVMe SSD storage, tuned for demanding database I/O profiles. Networking uses a fully managed Cloud Interconnect to connect bare metal servers to VPCs in the same or adjacent Google Cloud regions, making all GCP services (Cloud Storage, BigQuery, Vertex AI, etc.) available with private connectivity. Billing, support, and SLAs are unified under Google Cloud, including 24/7 coverage for Priority 1 and 2 issues. Supported OSes include RHEL, SUSE, Oracle Linux, and Windows Server. Oracle licensing on Bare Metal Solution requires fewer licenses per CPU core compared to AWS or Azure virtualized environments (up to ~50% reduction), because Oracle counts cores on a 1:1 basis on certified bare metal hardware.

### Use Cases
* Running Oracle RAC for high availability with full support for all Oracle database options and patchsets that are not supported on hypervisors or managed database services (e.g., Oracle GoldenGate, Oracle Streams)
* Oracle Data Guard active standby for disaster recovery, using the same playbooks and runbooks as on-premises with sub-second failover
* SAP HANA and SAP ERP on HANA workloads that require certified, high-memory, single-tenant hardware and cannot tolerate noisy-neighbor effects
* Lift-and-shift of Oracle workloads to the cloud with zero application changes, zero license recalculation, and zero database administrator retraining
* Regulatory and compliance scenarios requiring physical isolation of database servers (e.g., financial institutions with data residency requirements needing a private, dedicated host)
* Hybrid database architecture where Oracle on Bare Metal Solution offloads analytics to BigQuery, AI/ML to Vertex AI, and backups to Cloud Storage through the low-latency interconnect
* Workloads that use Oracle features explicitly prohibited on public cloud VMs by Oracle's license terms (e.g., Oracle Multitenant, Oracle In-Memory, Oracle Advanced Compression)
