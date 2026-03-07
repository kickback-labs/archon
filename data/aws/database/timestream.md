---
cloud_provider: "AWS"
service_category: "database"
service_name: "Timestream"
pricing_model: "on-demand"
managed: true
tier: 2
---
## AWS Timestream

### Description
Amazon Timestream is a fully managed, serverless time-series database service purpose-built for collecting, storing, and analyzing time-stamped data at scale. It automatically scales ingestion and query capacity up and down to match workload demand, and manages data lifecycle by moving older data from in-memory storage to a cost-optimized magnetic store tier automatically. Timestream supports a SQL-like query language with built-in time-series analytics functions — smoothing, approximation, interpolation — and integrates natively with AWS IoT Core, Amazon Kinesis, Amazon MSK, AWS Lambda, and Amazon Grafana. Timestream for InfluxDB provides a managed InfluxDB experience for teams standardized on that protocol and API.

### Use Cases
* IoT sensor telemetry storage and analysis (e.g., temperature, vibration, and pressure readings from industrial equipment)
* DevOps and application performance monitoring metrics (e.g., storing and querying CPU, memory, and request-rate time series)
* Fleet tracking and operational analytics for vehicles or devices emitting location or status data at high frequency
* Financial time-series data (e.g., tick data, portfolio valuations, or market indicators requiring aggregation over time windows)
* Log aggregation and anomaly detection for security or operational data streams
* Building real-time dashboards in Amazon Managed Grafana backed by Timestream for live metric visualization
