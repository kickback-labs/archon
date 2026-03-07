---
cloud_provider: "GCP"
service_category: "networking"
service_name: "Media CDN"
pricing_model: "on-demand"
managed: true
tier: 3
---
## GCP Media CDN

### Description
Media CDN is Google Cloud's high-throughput media delivery solution optimized for streaming video and large file downloads, complementing Cloud CDN (which targets web acceleration workloads). It uses Google's global edge-caching infrastructure — the same infrastructure that serves YouTube — to cache and serve content as close to end users as possible, reducing origin load and improving perceived latency for byte-range and sequential workloads. Media CDN is configured via `EdgeCacheService` and `EdgeCacheOrigin` resources and supports origins hosted on Cloud Storage, other cloud providers, or on-premises HTTP endpoints. The architecture has three components: a router (handles request matching, header manipulation, and path rewrites), a cache (stores responses at edge PoPs), and a cache filler (fetches from origin on cache miss and applies origin-level settings). Routing is defined at fine-grained route level, allowing per-URI control over caching policies, TTLs, cache keys, and custom headers. Media CDN supports HTTP/2 and QUIC for client-to-edge connections to maximize throughput. Content protection is provided through dual-token authentication (recommended), signed URLs, and signed cookies — tokens can be scoped to an exact URL prefix and time window. Security is enforced via Google Cloud Armor edge security policies, including IP allowlists/denylists, geo-based filtering, ASN-based filtering, and Google Threat Intelligence integration. SSL/TLS is built-in with no additional charge, and Google-managed certificates are supported as a bring-your-own-domain (BYOD) service. Cache invalidation is supported by host/path, URL prefix, wildcard, and cache tags (built-in tags for status, origin, and media type). Custom response headers expose geographic data, cache hit/miss status, and cache location. Logs are delivered near real-time to Cloud Logging and can be exported to Cloud Storage or Pub/Sub. Custom code can be injected into the request-response path via Service Extensions plugins (Preview). Media CDN is a request-access product — contact the Google Cloud sales team to enable it.

### Use Cases
* Delivering live and on-demand video streams (HLS, DASH) at scale to global audiences using Google's YouTube-class edge infrastructure
* Serving large file downloads (game binaries, software installers, firmware images) from edge caches to reduce origin egress and improve download speeds
* Protecting streaming content from unauthorized redistribution using dual-token authentication (e.g., time-limited, IP-scoped signed tokens for each session)
* Fronting a private Cloud Storage bucket as a media origin using origin authentication, so Media CDN fetches from private buckets without exposing them publicly
* Applying Cloud Armor edge security policies to block requests from malicious IP ranges, specific ASNs, or geographic regions before they reach origin infrastructure
* Using fine-grained per-route cache key configuration to maximize cache efficiency (e.g., stripping irrelevant query parameters from cache keys for video segments)
* Injecting custom response headers to surface cache location, country, and hit/miss status to downstream players or analytics pipelines
* Invalidating cached video manifests or segments by cache tag or URL pattern after a content update without rebuilding the entire CDN configuration
* Enabling QUIC/HTTP2 for adaptive bitrate (ABR) streaming clients to reduce connection latency and improve rebuffering rates on mobile networks
* Using Service Extensions plugins for custom tokenization, header normalization, or A/B routing logic at the edge without running origin-side proxy infrastructure
