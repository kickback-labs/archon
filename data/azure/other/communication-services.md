---
cloud_provider: "Azure"
service_category: "other"
service_name: "Azure Communication Services"
pricing_model: "per-request"
managed: true
tier: 2
---
## Azure Communication Services (ACS)

### Description
Azure Communication Services is a fully managed, cloud-based communications platform that provides REST APIs and client SDKs for embedding real-time voice and video calling, chat, SMS, email, and Advanced Messaging (WhatsApp) directly into custom applications, without requiring expertise in underlying telephony or signaling infrastructure. ACS is identity-agnostic — developers control user identity and authentication — and supports cross-platform client libraries for JavaScript (web), iOS (Swift), Android (Java), and Windows (.NET), along with a prebuilt UI Library for accelerating web and mobile app development. It integrates with Microsoft Teams, enabling Azure-built apps to join Teams meetings and interoperate with Teams users, making it suitable for hybrid enterprise-consumer communication scenarios (e.g., remote healthcare, banking). Direct routing support via SIP and session border controllers (SBCs) allows organizations to bring their own PSTN carriers and phone numbers.

### Use Cases
* Embedding voice and video calling into web or mobile apps (e.g., adding a "Talk to a doctor" video call button to a patient portal built on custom infrastructure)
* SMS and WhatsApp messaging for customer engagement (e.g., sending appointment reminders or OTP codes via SMS, or conducting support interactions over WhatsApp Advanced Messaging)
* Transactional and marketing email delivery (e.g., programmatically sending order confirmation emails via the Email SDK with Azure-provisioned sender domains)
* Teams interoperability for business-to-consumer scenarios (e.g., connecting external patients or clients to Microsoft Teams meetings hosted by employees)
* Building interactive voice response (IVR) and call automation workflows (e.g., using Call Automation SDK to orchestrate outbound calls with speech recognition and DTMF input handling)
* Consumer-to-consumer in-app communications (e.g., building real-time chat and video for a marketplace or gaming app using ACS Chat SDK and the open-source UI toolkit)
