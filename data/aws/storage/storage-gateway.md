---
cloud_provider: "AWS"
service_category: "storage"
service_name: "Storage Gateway"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Storage Gateway

### Description
AWS Storage Gateway is a hybrid cloud storage service that gives on-premises applications access to virtually unlimited AWS cloud storage without disrupting existing workflows. It deploys as a virtual machine (on VMware, Hyper-V, or Linux KVM) or as a hardware appliance, and integrates transparently with on-premises backup, file, and block storage workflows. Storage Gateway offers three gateway types: S3 File Gateway (NFS/SMB access to Amazon S3), FSx File Gateway (low-latency local access to Amazon FSx for Windows File Server), Tape Gateway (virtual tape library backed by S3 and S3 Glacier), and Volume Gateway (iSCSI block storage backed by S3 with optional EBS migration). Data stored through the gateway is encrypted in transit and at rest. It supports compliance requirements with WORM storage, audit logging, and encryption.

### Use Cases
* Backing up on-premises servers and databases into S3 or S3 Glacier without changing existing backup software (e.g., Veeam, Commvault, Veritas)
* Replacing on-premises physical tape libraries with virtual tapes in AWS, eliminating tape management overhead
* Extending on-premises file shares to S3 for data lake ingestion (e.g., media and video archives)
* Providing low-latency local access to Amazon FSx for Windows File Server shares for remote offices and branch offices
* Expanding on-premises block storage capacity using Volume Gateway as an iSCSI target backed by the cloud
* Enabling cloud recovery options for on-premises workloads without full migration
