---
cloud_provider: "Azure"
service_category: "security_identity"
service_name: "Entra Domain Services"
pricing_model: "subscription"
managed: true
tier: 2
---
## Azure Entra Domain Services

### Description
Microsoft Entra Domain Services (formerly Azure AD Domain Services) provides managed Active Directory Domain Services (AD DS) in Azure without the need to deploy, manage, or patch domain controllers. It exposes traditional AD DS capabilities — domain join, Group Policy, LDAP, and Kerberos/NTLM authentication — as a fully managed service backed by two redundant Windows Server domain controllers deployed in the selected Azure region. The managed domain performs a one-way synchronization from Microsoft Entra ID, making users, groups, and credentials available for legacy applications that rely on Windows-integrated authentication. It supports both cloud-only and hybrid Entra ID tenants (synchronized via Microsoft Entra Connect), and can be extended with replica sets in additional Azure regions for geographic disaster recovery. Entra Domain Services is the primary Azure path for lift-and-shifting Windows Server applications that cannot adopt modern OAuth/OIDC-based authentication.

### Use Cases
* Lift-and-shift of legacy Windows applications — enable domain join and Kerberos/NTLM authentication for applications that cannot use modern auth protocols (e.g., older .NET apps, SharePoint farms)
* Managed LDAP directory — provide LDAP bind and read access (and LDAP write for objects created in the managed domain) without managing an on-premises LDAP server or AD DS VMs
* Group Policy management for cloud VMs — apply GPOs to Azure-joined VMs without spinning up and maintaining Windows Server domain controller VMs
* Hybrid identity bridge — synchronize on-premises AD users via Microsoft Entra Connect so they can authenticate to cloud resources using the same credentials, without managing AD replication manually
* Geographic disaster recovery for domain-dependent apps — add replica sets in multiple Azure regions so domain services remain available if a primary region goes offline
* Secure LDAP (LDAPS) over the internet — configure LDAPS for applications that require encrypted directory queries from outside the virtual network
