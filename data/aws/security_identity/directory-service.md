---
cloud_provider: "AWS"
service_category: "security_identity"
service_name: "Directory Service"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Directory Service

### Description
AWS Directory Service provides managed Microsoft Active Directory (AD) in the AWS cloud, enabling organizations to migrate and run AD-dependent workloads without managing domain controller infrastructure. It offers three options: AWS Managed Microsoft AD (a full, native Microsoft AD on Windows Server, deployed across two Availability Zones for high availability), AD Connector (a proxy that redirects authentication requests to an existing on-premises AD without caching credentials in the cloud), and Simple AD (a Samba 4-based, low-cost, standalone directory for small organizations). AWS Managed Microsoft AD supports standard AD features including Group Policy, Kerberos, LDAP, and trust relationships with on-premises AD domains. It integrates natively with AWS services such as Amazon EC2 (domain join), Amazon RDS for SQL Server, Amazon FSx for Windows File Server, Amazon WorkSpaces, Amazon QuickSight, and AWS IAM Identity Center. Directory data is encrypted at rest using EBS encryption and in transit, and the service meets compliance standards including SOC, PCI, HIPAA, and FedRAMP. AWS handles patching, backups, replication, and failover automatically.

### Use Cases
* Running AD-dependent Windows workloads (e.g., .NET applications, SQL Server) in AWS without maintaining self-managed domain controllers on EC2
* Domain-joining EC2 Windows instances to a managed AD to apply Group Policy, enable Kerberos authentication, and manage users centrally
* Connecting Amazon FSx for Windows File Server or Amazon RDS for SQL Server to a managed AD for integrated Windows Authentication
* Extending an existing on-premises AD into AWS using a forest trust with AWS Managed Microsoft AD, allowing hybrid identity without replicating the entire directory
* Redirecting AWS service authentication to an on-premises AD via AD Connector without storing any directory data in AWS
* Enabling Amazon WorkSpaces virtual desktops with existing corporate AD credentials and Group Policy enforcement
* Meeting compliance requirements (PCI, HIPAA, FedRAMP) for directory services without managing the underlying infrastructure
