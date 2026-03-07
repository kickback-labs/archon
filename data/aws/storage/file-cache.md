---
cloud_provider: "AWS"
service_category: "storage"
service_name: "File Cache"
pricing_model: "on-demand"
managed: true
tier: 3
---
## AWS File Cache

### Description
Amazon File Cache is a fully managed, high-speed caching service on AWS that provides a temporary, high-performance cache for data stored anywhere — on-premises NFS servers, Amazon S3, or Amazon FSx file systems. It presents a unified namespace to applications running on AWS, aggregating multiple on-premises or in-cloud data sources into a single view without requiring data movement or migration. File Cache uses the Lustre file system internally, delivering sub-millisecond latencies, up to hundreds of GB/s of throughput, and millions of IOPS. It is purpose-built for cloud bursting workloads that need fast, temporary access to on-premises or distributed datasets. Data is cached on demand as applications access it, and the cache can be sized independently of the underlying source data. It integrates with Amazon S3, allowing S3-resident data to be consumed by file-based (POSIX) applications on AWS without workflow changes. Amazon File Cache is a managed service with no servers to provision or manage, and pricing is based on storage capacity provisioned and data transferred.

### Use Cases
* Cloud bursting for visual effects (VFX) rendering and media transcoding, where on-premises asset libraries are cached on AWS for peak compute jobs without permanent data migration
* High-performance computing (HPC) cloud bursting — run on-premises HPC simulation data on AWS compute clusters with hundreds of thousands of cores via a fast shared cache
* Machine learning training that requires fast access to on-premises training datasets cached on AWS GPU instances without duplicating data
* Data analytics pipelines that need to process subsets of large on-premises datasets (petabytes) with high throughput on AWS without ingesting the full dataset
* Providing a unified file namespace to AWS applications that need to access data spread across multiple on-premises NFS servers or S3 buckets simultaneously
* Temporary, disposable HPC file systems for project-based workloads where persistent storage is kept on-premises or in S3 but compute runs in AWS
