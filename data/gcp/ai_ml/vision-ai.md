---
cloud_provider: "GCP"
service_category: "ai_ml"
service_name: "Vision AI"
pricing_model: "per-request"
managed: true
tier: 2
---
## GCP Vision AI

### Description
Cloud Vision API is GCP's fully managed REST API for applying Google's pre-trained computer vision models to images and documents. It exposes multiple detection features per request: label detection (generalized object/scene classification), text detection and document text detection/OCR (sparse and dense text extraction with full structural hierarchy — page, block, paragraph, word, symbol — supporting handwriting and PDF/TIFF files), face detection (landmark localization and emotion likelihood ratings, no facial recognition), landmark detection (identification of famous geographic landmarks with coordinates), logo detection, object localization (bounding boxes for multiple objects in a single image), image properties (dominant colors), SafeSearch/explicit content detection (adult, violence, racy, spoof, medical likelihood ratings), web entity detection (related web images, matching URLs, and best-guess topic labels), and crop hint suggestions. Multiple features can be requested in a single API call. For document-heavy or structured form extraction use cases, GCP recommends Document AI instead of Vision API. The API is stateless, accepts base64-encoded images or Cloud Storage URIs, and supports both synchronous (online) and asynchronous batch annotation.

### Use Cases
* Extracting text from scanned documents, receipts, invoices, or ID cards using OCR with structural hierarchy output (full-text annotation) and storing results in BigQuery for downstream processing
* Moderating user-uploaded images on content platforms by detecting explicit, violent, or otherwise unsafe content using SafeSearch detection before storing images in Cloud Storage
* Building product catalog enrichment pipelines that automatically generate descriptive labels and categories for product images to power search indexing or recommendation engines
* Detecting and counting objects in images for inventory management, quality control, or logistics use cases with the object localization feature returning normalized bounding box coordinates
* Identifying and linking geographic landmarks in user-submitted photos for travel apps or geospatial indexing, with the landmark detection feature returning place names and lat/lon coordinates
* Building image-based web entity enrichment workflows that cross-reference uploaded images against the web to find related content, matching URLs, and contextual labels via web detection
