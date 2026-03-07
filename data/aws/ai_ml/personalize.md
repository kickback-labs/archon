---
cloud_provider: "AWS"
service_category: "ai_ml"
service_name: "Personalize"
pricing_model: "per-request"
managed: true
tier: 2
---
## AWS Personalize

### Description
Amazon Personalize is a fully managed AI service that enables developers to build and deploy real-time, hyper-personalized recommendation systems without ML expertise. It trains custom models on a business's own interaction data (clicks, views, purchases) and item catalog, using state-of-the-art algorithms that adapt dynamically to changing user behavior rather than relying solely on historical, rules-based logic. Recommendations are delivered with ultra-low latency and can be integrated into websites, mobile apps, email campaigns, and search engines. Personalize supports integration with Amazon Bedrock to combine recommendations with generative AI for contextual content generation and improved customer segmentation. It handles all infrastructure provisioning, model training, and hosting as a managed service.

### Use Cases
* E-commerce product recommendations: surface items a user is most likely to purchase based on browsing and purchase history
* Streaming media personalization: rank and recommend movies, TV shows, or music tailored to individual viewing habits (e.g., Netflix-style recommendations)
* Real-time trending items: highlight retail or travel products gaining popularity among similar users in real time
* Personalized email and push campaigns: generate user-specific product or content lists for marketing automation workflows
* In-app related item discovery: recommend comparable or complementary items to help users explore a product catalog
* Search result re-ranking: personalize the order of search results based on an individual user's preferences and behavior
* Generative AI content with Bedrock: combine Personalize recommendations with Bedrock FMs to create personalized, AI-generated marketing messages
