---
cloud_provider: "AWS"
service_category: "database"
service_name: "QLDB"
pricing_model: "on-demand"
managed: true
tier: 3
---
## AWS Quantum Ledger Database (QLDB)

### Description
Amazon Quantum Ledger Database (QLDB) is a fully managed ledger database that provides a transparent, immutable, and cryptographically verifiable transaction log owned by a central trusted authority. Unlike blockchain frameworks, QLDB does not require consensus mechanisms or distributed trust — it is designed for applications where a single authoritative party needs to maintain a tamper-proof, append-only history of all changes to application data. All data changes in QLDB are recorded in a journal that cannot be altered or deleted; each change generates a cryptographic hash (SHA-256) that can be used to verify the integrity of the entire history. QLDB uses PartiQL, an SQL-compatible query language, to query both current state and historical data. It is serverless, scaling automatically with no capacity provisioning required, and integrates with AWS KMS for encryption at rest and Amazon VPC for network isolation. Note that QLDB is in long-term support mode and no new feature development is planned; AWS recommends evaluating Amazon Aurora with application-level audit logging for new projects.

### Use Cases
* Financial transaction ledgers requiring an immutable audit trail with cryptographic proof of integrity (e.g., payment history, account transfers)
* Supply chain provenance tracking — recording every state change of goods from manufacturer to consumer with tamper-evident history
* Medical record audit logs where regulators require proof that historical records have not been altered
* Insurance claim history and policy change tracking for regulatory compliance and dispute resolution
* HR and payroll systems that must maintain a tamper-proof record of compensation and employment changes
* Manufacturing quality records requiring verifiable history of each inspection and certification event
* Regulatory compliance systems requiring a centralized trusted ledger for multi-step approval processes
