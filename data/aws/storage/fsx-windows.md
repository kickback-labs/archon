---
cloud_provider: "AWS"
service_category: "storage"
service_name: "FSx for Windows File Server"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS FSx for Windows File Server

### Description
Amazon FSx for Windows File Server is a fully managed Windows native file system built on Windows Server, providing shared file storage accessible over the SMB protocol with full NTFS compatibility. It supports Active Directory (AD) integration for user authentication and access control, DFS (Distributed File System) namespaces and replication for multi-site deployments, and file access auditing. FSx for Windows delivers sub-millisecond latencies and high throughput, and is available in Single-AZ and Multi-AZ deployment options for high availability. Automated daily backups, encryption at rest with AWS KMS, and encryption in transit via SMB Kerberos are built in. It integrates with AWS Directory Service or customer-managed AD, making it a drop-in replacement for on-premises Windows file servers.

### Use Cases
* Migrating Windows-based file servers and NTFS workloads to AWS without modifying application code or SMB access patterns
* Providing persistent shared storage for Amazon WorkSpaces and AppStream 2.0 virtual desktop and streaming deployments
* Running Microsoft SQL Server on a shared file server without requiring SQL Server Enterprise licensing (SQL FCI)
* Consolidating remote and branch office file shares in the cloud with low-latency access via FSx File Gateway
* Hosting Windows application data, home directories, and departmental shares with AD-based access control
* Lift-and-shift of NetApp or other SMB-based file servers to AWS with full protocol compatibility
