---
cloud_provider: "GCP"
service_category: "migration_hybrid"
service_name: "Transfer Appliance"
pricing_model: "on-demand"
managed: true
tier: 3
---
## GCP Transfer Appliance

### Description
Google Cloud Transfer Appliance is a high-capacity, ruggedized physical storage device that Google ships to a customer's premises, enabling offline bulk data transfer to Cloud Storage when network upload is impractical due to data volume, bandwidth constraints, or cost. The customer copies data to the appliance (via NFS mount on Linux/macOS, or SCP/SSH on Windows), then ships it back to a Google upload facility where Google ingests the data into a specified Cloud Storage bucket and then performs NIST 800-88-compliant data erasure on the appliance. Transfer Appliance is available in two capacity tiers—TA40 (40 TB) and TA300 (300 TB)—in both freestanding and rack-mounted form factors, allowing multiple units to be combined for petabyte-scale transfers. All data written to the appliance is encrypted with AES-256 using customer-managed keys via Cloud KMS, and the device includes hardware attestation and a Trusted Platform Module (TPM) chip to prevent tampering. An optional online mode allows streaming data directly from the appliance to Cloud Storage over the network in parallel with local copy, reducing total time when some connectivity is available. Transfer Appliance is available in the US, EU, UK, Singapore, Japan, Canada, Australia, and India. Google provides a wipe certificate upon completion, and EU customers' data never leaves EU borders during shipping or upload if a destination EU region is selected. Pricing is charged per engagement based on appliance capacity and rental duration; contact Google sales for exact quotes.

### Use Cases
* Migrating large on-premises archives (e.g., 100–300 TB of backup images or media files) to Cloud Storage when uploading over the network would take months
* Initial bulk data seeding for a cloud migration project before switching live production traffic to Cloud Storage-backed systems
* Offline data collection from research sites, remote oil rigs, or field locations with limited connectivity that need data centralized in Cloud Storage for BigQuery or Dataproc analysis
* Replicating legacy backup archives from tape or NAS to Cloud Storage Archive storage class for cost-effective long-term retention
* Transferring large genomics, medical imaging, or simulation datasets from isolated HPC environments to Cloud Storage for cloud-based processing
* Multi-appliance parallel transfers for petabyte-scale migrations (e.g., decommissioning an on-premises data warehouse and migrating all historical data to BigQuery)
* Data replication for hybrid architecture proof-of-concepts where a copy of on-premises data is needed in the cloud for testing cloud analytics workflows without production network impact
