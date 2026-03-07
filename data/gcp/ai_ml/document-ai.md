---
cloud_provider: "GCP"
service_category: "ai_ml"
service_name: "Document AI"
pricing_model: "per-request"
managed: true
tier: 2
---
## GCP Document AI

### Description
Document AI is GCP's fully managed platform for extracting, classifying, and splitting structured data from unstructured or semi-structured documents using a combination of OCR, foundation models, and generative AI. It exposes several processor types through a unified API: Enterprise Document OCR (text and layout extraction from PDFs and images in 200+ languages, with handwriting recognition, math formula detection, checkbox/selection mark extraction, and font-style information), Form Parser (field-value extraction from generic forms and tables without training), Custom Extractor (Workbench-powered generative AI extractor that works out-of-the-box and can be fine-tuned with as few as 10 labeled documents), Custom Splitter and Classifier (document classification and splitting using ML), and a set of pretrained specialized processors for commonly used document types (W-2, invoice, bank statement, driver's license, US passport, paystub, expense, identity proofing). Document AI Workbench provides a no-code/low-code UI and API to build, fine-tune, and deploy custom processors powered by generative AI. Results can be exported directly to BigQuery for analytics, joined with structured data, or fed into downstream Vertex AI workflows.

### Use Cases
* Automating data entry from incoming paper or digital forms — invoices, purchase orders, contracts, expense reports — by deploying a Custom Extractor or pretrained processor to extract structured fields, then storing results in BigQuery for ERP integration or audit trails
* Digitizing archival document collections (scanned reports, historical records, technical manuals) using Enterprise Document OCR with handwriting recognition support in 50 languages to produce machine-readable text and layout data usable for ML model training or full-text search indexing
* Classifying and routing multi-document packages (loan applications, insurance claims, medical records bundles) using Custom Splitter and Classifier processors that split composite PDF files and assign document types before downstream processing
* Improving fraud detection in financial services by processing identity documents (driver's licenses, passports) with Document AI's identity proofing pretrained processor to verify document authenticity and extract structured identity fields for downstream validation
* Building document Q&A and summarization applications by extracting text and structure via Document AI and then passing the structured output to Vertex AI (PaLM API/Gemini) for generative AI-powered question answering, comparison, or summarization over large document corpora
* Integrating document processing into BigQuery analytics workflows by directly outputting Document AI extraction results into BigQuery objects tables, enabling joins between parsed document metadata and structured operational data for comprehensive analytics
* Accelerating ISV and SaaS product capabilities by embedding Document AI's API endpoint into existing document management or workflow automation platforms, adding generative AI-powered extraction without building OCR or ML infrastructure from scratch
