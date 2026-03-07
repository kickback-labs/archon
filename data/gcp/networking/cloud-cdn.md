---
cloud_provider: "GCP"
service_category: "networking"
service_name: "Cloud CDN"
pricing_model: "on-demand"
managed: true
tier: 2
---
## GCP Cloud CDN

### Description
Cloud CDN (Content Delivery Network) uses Google's global edge network — over 100 points of presence worldwide — to cache and serve content closer to users, reducing latency and origin load. It integrates exclusively with the global external Application Load Balancer (or classic Application Load Balancer), acting as a cache layer in front of backend services, backend buckets (Cloud Storage), or external internet NEGs. Cloud CDN supports multiple cache modes (USE_ORIGIN_HEADERS, CACHE_ALL_STATIC, FORCE_CACHE_ALL), configurable TTL overrides, custom cache keys, and signed URLs/cookies for content access control. Cache invalidation is supported on-demand to purge stale content across Google's edge nodes. Cloud CDN is fully integrated with Cloud Armor for edge security policies applied before CDN cache lookup, and with Service Extensions for custom edge-compute logic pre-cache and post-cache. Egress pricing applies only for cache misses; cache hits are billed at a lower CDN egress rate.

### Use Cases
* Accelerating static website assets (e.g., images, JS, CSS served from Cloud Storage buckets behind a load balancer)
* Reducing origin server load for high-traffic media and software download services by serving from Google's edge cache
* Delivering large file downloads or video-on-demand content with byte-range request support and cache fill optimization
* Protecting premium content with signed URLs or signed cookies to restrict access to authorized users only
* Applying Cloud Armor WAF and DDoS edge security policies before cache lookup to filter malicious traffic at the edge
* Improving API response times for cacheable GET endpoints by caching responses at Google's globally distributed edge nodes
* Customizing cache behavior per request path using cache keys and negative caching for error responses (e.g., 404s)
