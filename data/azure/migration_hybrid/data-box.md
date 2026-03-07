---
cloud_provider: "Azure"
service_category: "migration_hybrid"
service_name: "Azure Data Box"
pricing_model: "on-demand"
managed: true
tier: 2
---
## Azure Data Box

### Description
Azure Data Box is a family of physical data transfer appliances that Microsoft ships to customers to move large volumes of data into or out of Azure quickly, securely, and cost-effectively when network transfer is impractical. The current generation (Data Box Next-gen) offers two SKUs with 120 TB and 525 TB usable storage, 100 GbE QSFP28 network interfaces, and SMB Direct/RDMA support for copy speeds up to 7 GB/s for large files. Data is encrypted on-device with AES-256 at all times, and disks are securely wiped per NIST 800-88r1 standards after upload. The service supports both import (on-premises to Azure Storage) and export (Azure to on-premises or another cloud) workflows, and integrates with Azure Blob, Azure Files, HDFS migration, Azure Backup, and Azure File Sync. Orders are managed end-to-end via the Azure portal, with email notifications at each status change.

### Use Cases
* Performing a one-time bulk migration of on-premises data (VM farms, media libraries, historical archives) to Azure Storage when available bandwidth would make network transfer take weeks or months
* Seeding a backup repository to Azure Blob using Data Box as the initial bulk transfer, followed by incremental deltas over the network via backup partners such as Veeam or Commvault
* Exporting Azure data for disaster recovery, returning it to on-premises when a large restore is needed faster than network egress allows
* Migrating an on-premises HDFS cluster to Azure Data Lake Storage Gen2 or Azure Blob by copying HDFS data to the device and uploading to Azure
* Transferring data to a different Azure destination region directly from an on-premises source, with cross-region transfer handled at no extra cost over the Azure backbone
