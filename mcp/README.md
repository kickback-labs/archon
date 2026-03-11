# diagram-mcp

MCP server for generating infrastructure diagrams using the [Python diagrams](https://diagrams.mingrammer.com/) package.

## Overview

This server exposes three MCP tools:

- **`generate_diagram`** — Generate a PNG infrastructure diagram from Python diagrams DSL code
- **`get_diagram_examples`** — Retrieve example code for AWS, GCP, Azure, Kubernetes, on-prem, hybrid, and more
- **`list_icons`** — Browse available icons organized by provider and service

## Supported Providers

- **AWS** — EC2, Lambda, S3, RDS, EKS, and 200+ services
- **GCP** — Cloud Functions, Cloud Run, BigQuery, GKE, Dataflow, and more
- **Azure** — App Service, Functions, AKS, Cosmos DB, Synapse, and more
- **Kubernetes** — Pods, Services, Deployments, StatefulSets, Ingress, and more
- **On-premises** — Servers, databases, networking, storage, proxies, and more
- **Hybrid / Multi-cloud** — Architectures spanning multiple providers
- **SaaS** — GitHub, Slack, Datadog, and other third-party services

## Requirements

- Python 3.12+
- [uv](https://docs.astral.sh/uv/)
- Graphviz (must be installed on the system)

## Setup

```sh
uv sync
```

## Running

```sh
uv run diagram-mcp
```

The server starts on `0.0.0.0:8000` by default. Override with environment variables:

| Variable   | Default   | Description        |
|------------|-----------|--------------------|
| `MCP_HOST` | `0.0.0.0` | Host to bind to    |
| `MCP_PORT` | `8000`    | Port to listen on  |

## Project Structure

```
mcp/
├── server/
│   ├── __init__.py
│   ├── server.py          # FastMCP server + tool definitions
│   ├── diagrams_tools.py  # Diagram generation, examples, and icon listing
│   ├── models.py          # Pydantic request/response models
│   └── scanner.py         # Code security scanning (AST + bandit)
└── pyproject.toml
```

## Transport

Uses the `streamable-http` MCP transport. Connect your MCP client to:

```
http://<host>:<port>/mcp
```
