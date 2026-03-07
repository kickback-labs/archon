---
cloud_provider: "AWS"
service_category: "migration_hybrid"
service_name: "Snow Family"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Snow Family (Snowball / Snowball Edge)

### Description
The AWS Snow Family is a collection of physical edge computing and data transfer devices designed for environments with limited connectivity, high data volumes, or edge processing requirements. AWS Snowball Edge Storage Optimized (up to 210 TB usable HDD + 28 TB NVMe SSD) and Snowball Edge Compute Optimized (up to 104 TB usable storage + GPU option) are rugged, tamper-resistant appliances delivered to the customer's site. Data is encrypted with 256-bit encryption managed by AWS KMS, and the encryption keys never leave AWS. Snowball Edge devices also run EC2 compute instances and Lambda functions locally for edge processing before shipping data back to AWS. AWS Snowcone is a smaller form factor (14 TB usable) for space-constrained environments. All devices feature chain-of-custody tracking via an E Ink shipping label and an onboard LCD screen.

### Use Cases
* Large-scale data migration with limited bandwidth (e.g., moving 100+ TB datasets from an on-premises data center to S3 when network transfer would take weeks or months)
* Edge computing in disconnected or intermittently connected environments (e.g., running EC2 workloads on a ship, oil rig, or military forward operating base)
* Data collection and pre-processing at remote sites (e.g., aggregating IoT sensor data at a mining site and processing it locally before shipping to AWS)
* Tactical edge and ruggedized deployments (e.g., Snowball Edge Compute Optimized with GPU for ML inference in field environments)
* Secure data center decommission (e.g., physically transferring data from a legacy data center being shut down)
* Content distribution to remote or offline locations (e.g., pre-loading media or software to sites with no reliable internet)
