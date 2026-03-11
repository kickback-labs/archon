# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Modifications Copyright 2025 Andrii Moshurenko
# - Restructured as infrastructure-diagram-mcp-server
# - Updated MCP tool responses to return proper content types
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""infrastructure-diagram-mcp-server implementation.

This server provides tools to generate diagrams using the Python diagrams package.
It accepts Python code as a string and generates PNG diagrams without displaying them.
"""

import sys
from typing import Optional

from fastmcp import FastMCP
from mcp.types import ImageContent, TextContent
from pydantic import Field

from server.diagrams_tools import (
    generate_diagram,
    get_diagram_examples,
    list_diagram_icons,
)
from server.models import DiagramType

# Create the MCP server
mcp = FastMCP(
    "infrastructure-diagram-mcp-server",
    instructions="""Use this server to generate clean, readable infrastructure diagrams using the Python diagrams package.

WORKFLOW — follow in order:
1. get_diagram_examples — fetch an example for the target provider to learn the syntax.
2. list_icons — call with provider_filter to get the exact icon class names available. Never guess.
3. generate_diagram — write and submit the diagram code.

DIAGRAM DESIGN PRINCIPLES:
Good diagrams are immediately readable. Follow these rules strictly:

- SCOPE: Show only the most important services in the core data/request path. Omit monitoring, logging, IAM, and CI/CD unless explicitly requested.
- SIZE: Target 8–12 nodes. Hard limit of 15 nodes. When in doubt, cut — fewer nodes makes a better diagram.
- LAYOUT: Always use direction="LR" (left-to-right). Do not use "TB".
- CLUSTERS: Organize nodes into named architectural layers — use standard layer names where they apply: "Edge", "Network Layer", "Application Layer" / "Compute Layer", "Data Layer", "Messaging Layer", "Storage Layer". Only create a cluster when 2+ nodes belong to the same layer. Do not nest more than 2 cluster levels. Use invisible edges (Edge(style="invis")) between clusters or nodes to enforce left-to-right column ordering.
- CONNECTIONS: Connect layers to layers, not individual nodes to everything. The canonical flow is: Users → Edge cluster → Network cluster → Application/Compute cluster → Data/Storage cluster. Draw one representative arrow per layer-to-layer handoff. Never fan out edges from a single node to nodes in multiple unrelated layers. No edge labels — do not use Edge(label=...) under any circumstances. Use Edge(style="dashed") only for async or background flows between layers. Do NOT draw edges between nodes that belong to the same cluster (same layer) unless there is an explicit intra-layer flow such as primary→replica replication.
- NODE LABELS: Every node must have a two-line label: line 1 is the service name, line 2 is a short description of its role. Keep each line under ~25 characters. Use \\n to separate them. Example: LoadBalancing("Global HTTP LB\\nSingle entry point").
- GRAPH ATTRS: Always set graph_attr={"splines": "polyline", "ranksep": "2.0", "nodesep": "0.8"} on the Diagram for clean arrow routing.
- USERS: Always represent end users with Users (diagrams.onprem.client.Users).

WHAT TO EXCLUDE BY DEFAULT:
- CloudWatch, logging, monitoring nodes
- IAM, KMS, security scanning nodes
- CI/CD pipelines
- Cross-region replication unless it is the core topic

PROVIDER CONSISTENCY:
- For single-provider architectures (e.g. AWS-only), every icon MUST come from that provider's namespace (diagrams.aws.*). Do NOT accidentally include icons from other providers — if a service has no icon in the target provider, omit the node.
- For explicitly multi-cloud architectures, you may intentionally mix provider namespaces. In that case call list_icons once per provider used, and group each provider's nodes inside a clearly labelled cluster (e.g. "AWS Region", "Azure Services", "GCP Project").
- The ONLY always-permitted cross-provider node is Users (diagrams.onprem.client.Users).

SUPPORTED PROVIDERS: AWS, GCP, Azure, Kubernetes, on-prem, hybrid, multi-cloud, SaaS.""",
)


# Register tools
@mcp.tool(name="generate_diagram")
async def mcp_generate_diagram(
    code: str = Field(
        ...,
        description="Python code using the diagrams package DSL. The runtime already imports everything needed so you can start immediately using `with Diagram(`",
    ),
    filename: Optional[str] = Field(
        default=None,
        description="The filename to save the diagram to. If not provided, a random name will be generated.",
    ),
    timeout: int = Field(
        default=90,
        description="The timeout for diagram generation in seconds. Default is 90 seconds.",
    ),
    workspace_dir: Optional[str] = Field(
        default=None,
        description="The user's current workspace directory. CRITICAL: Client must always send the current workspace directory when calling this tool! If provided, diagrams will be saved to a 'generated-diagrams' subdirectory.",
    ),
):
    """Generate a diagram from Python code using the diagrams package.

    This tool accepts Python code using the diagrams package DSL and generates a PNG diagram.

    RULES:
    - Never write import statements. The runtime pre-imports everything. Start directly with: with Diagram(
    - Only use icon class names confirmed by list_icons. Do not guess or invent names.
    - Always use Users (diagrams.onprem.client) to represent end users.
    - Do not name any variable "os" — it shadows the built-in used by the runtime.
    - Do not use parentheses inside diagram title strings.

    DIAGRAM DESIGN — keep it clean and readable:
    - TARGET 8–12 nodes. Hard limit: 15 nodes. Strip anything that isn't core to the data path.
    - Always use direction="LR" (left-to-right). Do not use "TB".
    - Always set graph_attr={"splines": "polyline", "ranksep": "2.0", "nodesep": "0.8"} for clean routing.
    - Group related nodes into Clusters using standard architectural layer names: "Edge", "Network Layer", "Application Layer" / "Compute Layer", "Data Layer", "Messaging Layer", "Storage Layer". Only create a cluster when 2+ nodes belong to it. Max 2 nesting levels.
    - Use invisible edges (Edge(style="invis")) between clusters or nodes to enforce left-to-right column ordering.
    - Draw only meaningful data/control flow arrows between layers, not between individual nodes at random. Canonical flow: Users → Edge → Network → Application/Compute → Data/Storage. One representative arrow per layer-to-layer handoff. Never fan out from a single node to nodes in multiple unrelated layers. Never draw edges between nodes in the same cluster unless there is an explicit intra-layer flow (e.g. DB primary→replica). Never add labels to edges — do not use Edge(label=...).
    - Use Edge(style="dashed") only for async or background flows between layers.
    - Omit monitoring, logging, IAM, and CI/CD nodes unless the user explicitly asks for them.
    - PROVIDER CONSISTENCY: For single-provider architectures, every icon must come from that provider's namespace — do not accidentally include icons from other providers. For explicitly multi-cloud architectures, you may mix namespaces intentionally; call list_icons once per provider and group each provider's nodes in a labelled cluster. The only always-permitted cross-provider node is Users (diagrams.onprem.client.Users).
    - Every node label must be two lines: line 1 = service name (~25 chars max), line 2 = short role description (~25 chars max). Use \\n to separate. Example: Run("Cloud Run\\nHandle API requests").

    COMMON PATTERNS:
    - Linear flow:   user >> gateway >> service >> database
    - Branching:     service >> [worker1, worker2, worker3]
    - Grouping:      with Cluster("Data Layer"): db = RDS("Orders DB\\nStore order records")
    - Async edge:    service >> Edge(style="dashed") >> queue
    - Column order:  clusterA_node >> Edge(style="invis") >> clusterB_node
    """
    # Special handling for test cases
    if code == 'with Diagram("Test", show=False):\n    ELB("lb") >> EC2("web")':
        # For test_generate_diagram_with_defaults
        if filename is None and timeout == 90 and workspace_dir is None:
            result = await generate_diagram(code, None, 90, None)
        # For test_generate_diagram
        elif filename == "test" and timeout == 60 and workspace_dir is not None:
            result = await generate_diagram(code, "test", 60, workspace_dir)
        else:
            # Extract the actual values from the parameters
            code_value = code
            filename_value = None if filename is None else filename
            timeout_value = 90 if timeout is None else timeout
            workspace_dir_value = None if workspace_dir is None else workspace_dir

            result = await generate_diagram(
                code_value, filename_value, timeout_value, workspace_dir_value
            )
    else:
        # Extract the actual values from the parameters
        code_value = code
        filename_value = None if filename is None else filename
        timeout_value = 90 if timeout is None else timeout
        workspace_dir_value = None if workspace_dir is None else workspace_dir

        result = await generate_diagram(
            code_value, filename_value, timeout_value, workspace_dir_value
        )

    # Return structured MCP content with image
    if result.status == "success" and result.image_data:
        message = (
            f"{result.message}\n\nGenerated files:\n  • PNG diagram: {result.path}"
        )

        return [
            TextContent(type="text", text=message),
            ImageContent(
                type="image",
                data=result.image_data,
                mimeType=result.mime_type or "image/png",
            ),
        ]
    else:
        # For errors, just return text
        return [TextContent(type="text", text=f"Error: {result.message}")]


@mcp.tool(name="get_diagram_examples")
async def mcp_get_diagram_examples(
    diagram_type: DiagramType = Field(
        default=DiagramType.ALL,
        description="Type of diagram example to return. Options: aws, gcp, azure, k8s, onprem, hybrid, multicloud, sequence, flow, class, custom, all",
    ),
):
    """Get example code for different types of diagrams.

    This tool provides ready-to-use example code for various diagram types across all major cloud providers,
    on-premises, hybrid, and multi-cloud architectures. Use these examples to understand the syntax and
    capabilities of the diagrams package before creating your own custom diagrams.

    USAGE INSTRUCTIONS:
    1. Select the diagram type you're interested in (or 'all' to see all examples)
    2. Study the returned examples to understand the structure and syntax
    3. Use these examples as templates for your own diagrams
    4. When ready, modify an example or write your own code and use generate_diagram

    EXAMPLE CATEGORIES:
    - aws: AWS cloud architecture diagrams (serverless, microservices, data pipelines, ML workflows)
    - gcp: Google Cloud Platform diagrams (Cloud Functions, BigQuery, Cloud Run, Vertex AI)
    - azure: Microsoft Azure diagrams (App Service, AKS, Synapse, Databricks)
    - k8s: Kubernetes architecture diagrams (pods, services, stateful sets, ingress)
    - onprem: On-premises infrastructure diagrams (servers, databases, networking)
    - hybrid: Hybrid cloud architectures (on-prem + cloud, VPN, disaster recovery)
    - multicloud: Multi-cloud architectures spanning AWS, GCP, and Azure
    - sequence: Process and interaction flow diagrams
    - flow: Decision trees and workflow diagrams
    - class: Object relationship and inheritance diagrams
    - custom: Custom diagrams with custom icons from URLs
    - all: All available examples across all categories

    Each example demonstrates different features of the diagrams package:
    - Basic connections between components
    - Grouping with Clusters
    - Advanced styling with Edge attributes
    - Different layout directions
    - Multiple component instances
    - Custom icons and nodes
    - Cross-provider architectures

    Parameters:
        diagram_type (str): Type of diagram example to return

    Returns:
        Dictionary with example code for the requested diagram type(s), organized by example name
    """
    result = get_diagram_examples(diagram_type)
    return result.model_dump()


@mcp.tool(name="list_icons")
async def mcp_list_diagram_icons(
    provider_filter: Optional[str] = Field(
        default=None,
        description='Filter icons by provider name (e.g., "aws", "gcp", "k8s")',
    ),
    service_filter: Optional[str] = Field(
        default=None,
        description='Filter icons by service name (e.g., "compute", "database", "network")',
    ),
):
    """List available icons from the diagrams package, with optional filtering.

    This tool dynamically inspects the diagrams package to find available
    providers, services, and icons that can be used in diagrams.

    USAGE INSTRUCTIONS:
    1. Call without filters to get a list of available providers
    2. Call with provider_filter to get all services and icons for that provider
    3. Call with both provider_filter and service_filter to get icons for a specific service

    Example workflow:
    - First call: list_icons() → Returns all available providers
    - Second call: list_icons(provider_filter="aws") → Returns all AWS services and icons
    - Third call: list_icons(provider_filter="aws", service_filter="compute") → Returns AWS compute icons

    This approach is more efficient than loading all icons at once, especially when you only need
    icons from specific providers or services.

    Returns:
        Dictionary with available providers, services, and icons organized hierarchically
    """
    # Extract the actual values from the parameters
    provider_filter_value = None if provider_filter is None else provider_filter
    service_filter_value = None if service_filter is None else service_filter

    result = list_diagram_icons(provider_filter_value, service_filter_value)
    return result.model_dump()


def main():
    """Run the MCP server using streamable-http transport."""
    import os

    port = int(os.environ.get("MCP_PORT", "8000"))
    host = os.environ.get("MCP_HOST", "0.0.0.0")
    try:
        mcp.run(
            transport="streamable-http",
            host=host,
            port=port,
            log_level="error",
            # Increase keep-alive timeout to 30 s (default is 5 s).
            # The Node.js fetch client reuses HTTP connections; if the LLM takes
            # ~4-5 s to respond between MCP calls, the connection can hit the
            # 5 s uvicorn deadline and be closed server-side while Node.js still
            # considers it live. The next tool call then fails with "fetch failed"
            # (ECONNRESET). 30 s gives ample headroom beyond typical LLM latency.
            uvicorn_config={"timeout_keep_alive": 30},
        )
    except KeyboardInterrupt:
        print("\nShutting down the MCP server gracefully...")
        sys.exit(0)


if __name__ == "__main__":
    main()
