---
cloud_provider: "Azure"
service_category: "compute"
service_name: "Dedicated Host"
pricing_model: "on-demand"
managed: false
tier: 2
---
## Azure Dedicated Host

### Description
Azure Dedicated Host provides single-tenant physical servers in Azure datacenters on which you deploy your Azure Virtual Machines, ensuring that the underlying hardware is not shared with any other customer's workloads. When you provision a Dedicated Host, you choose the host SKU (VM series, number of physical cores, and VM sizes supported), and all VMs deployed on that host are exclusively yours. This model addresses compliance and regulatory requirements that mandate physical isolation, such as HIPAA, ITAR, or PCI DSS, and provides visibility into the underlying server's core count for server-based software licensing purposes. You gain control over maintenance windows — platform-initiated operations such as OS patching or hardware restarts can be scheduled to a window you define, minimizing unplanned downtime for sensitive workloads. Dedicated Host supports Windows, Linux, and SQL Server VMs across multiple VM series (Dsv3, Esv3, Fsv2, and others), and integrates with Azure Hybrid Benefit for unlimited virtualization rights, allowing existing Windows Server Datacenter or SQL Server Enterprise licenses with Software Assurance to cover all VMs on the host. Pricing is charged at the host level regardless of the number of VMs running on it; software licenses are billed separately at the VM level.

### Use Cases
* Regulatory and compliance isolation (e.g., running workloads that require physical single-tenancy to satisfy HIPAA, ITAR, PCI DSS, or government certifications that prohibit shared hardware)
* Server-based software license optimization (e.g., applying Windows Server Datacenter or SQL Server Enterprise licenses with Software Assurance to the host's physical cores for unlimited VM virtualization via Azure Hybrid Benefit)
* Controlled maintenance scheduling (e.g., aligning Azure platform maintenance windows to off-peak business hours for business-critical applications that cannot tolerate unplanned restarts)
* Workload placement control (e.g., pinning a specific set of VMs to a dedicated host to satisfy corporate policy on hardware isolation or to guarantee proximity and low latency between VMs on the same host)
* Migration of on-premises licensed workloads (e.g., lifting Windows Server or SQL Server workloads from on-premises dedicated servers to Azure while preserving existing licensing rights during the 180-day concurrent use allowance)
