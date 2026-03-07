---
cloud_provider: "AWS"
service_category: "other"
service_name: "Simple Email Service"
pricing_model: "per-request"
managed: true
tier: 2
---
## Amazon Simple Email Service (SES)

### Description
Amazon Simple Email Service (Amazon SES) is a cloud-based email delivery service designed for high-volume transactional, marketing, and notification email sending at scale. It processes more than a trillion emails per year for customers including Netflix, Duolingo, and Amazon Retail, offering competitive per-email pricing with no upfront commitments. SES supports dedicated, shared, or customer-owned IP addresses to optimize sender reputation, and provides a Virtual Deliverability Manager (VDM) with inbox placement analytics, engagement tracking, and deliverability recommendations. The Mail Manager feature centralizes management of incoming email flows, enabling archiving, traffic policies, and security controls. SES integrates natively with Amazon WorkMail for managed business email, and with other AWS services such as Lambda for event-driven email processing and SNS for bounce/complaint notifications.

### Use Cases
* Transactional email delivery (e.g., order confirmations, shipping notifications, password resets)
* High-volume marketing and newsletter campaigns (e.g., promotional emails to millions of subscribers)
* Application-embedded email notifications (e.g., alerts and reports triggered by application events)
* Inbound email processing and archiving (e.g., routing, filtering, and storing incoming messages via Mail Manager)
* Multi-tenant SaaS email infrastructure (e.g., sending on behalf of multiple sub-accounts with dedicated IPs per customer)
* Deliverability optimization (e.g., using VDM to diagnose inbox placement issues and improve sender reputation)
