---
cloud_provider: "AWS"
service_category: "compute"
service_name: "ROSA"
pricing_model: "on-demand"
managed: true
tier: 3
---
## Red Hat OpenShift Service on AWS (ROSA)

### Description
Red Hat OpenShift Service on AWS (ROSA) is a fully managed OpenShift service jointly supported by AWS and Red Hat that enables teams to deploy and operate Red Hat OpenShift clusters on AWS infrastructure without managing the control plane. ROSA provides an integrated experience with the full OpenShift platform, including built-in developer tooling, CI/CD pipelines, operator framework, and the OpenShift console. The service is available with two deployment models: Classic (managed control plane on dedicated EC2) and ROSA with HCP (Hosted Control Planes, where the control plane runs as a managed service in an AWS-owned account, reducing cost and attack surface). Billing is flexible — on-demand hourly or annual commitment — and includes Red Hat OpenShift licenses. ROSA integrates with the full range of AWS services including RDS, S3, IAM, CloudWatch, and VPC.

ROSA is suited for organizations with existing Red Hat OpenShift investments or Red Hat expertise who want to extend to the cloud without abandoning their existing platform tooling, developer workflows, or compliance certifications built around OpenShift.

### Use Cases
* Running enterprise OpenShift workloads on AWS with a jointly supported SLA from AWS and Red Hat
* Standardizing application deployment across on-premises OpenShift and cloud using a single platform
* Accelerating application delivery with self-service provisioning, OpenShift Developer Console, and integrated CI/CD (Tekton, Argo CD)
* Modernizing existing applications using OpenShift's built-in container runtimes, Source-to-Image (S2I) builds, and operators
* Organizations with Red Hat compliance requirements (e.g., government or healthcare) using FIPS-compliant OpenShift on AWS
* Reducing control plane management overhead using ROSA with Hosted Control Planes (HCP) for cost-efficient multi-cluster environments
