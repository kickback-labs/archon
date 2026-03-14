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

ICON USAGE — provider-prefixed aliases (CRITICAL):
The runtime does NOT use wildcard imports. Every provider module is available as a prefixed alias:
  aws_compute, aws_storage, aws_database, aws_network, aws_analytics, aws_integration, aws_ml, aws_iot, aws_security, aws_devtools, aws_management, aws_migration, aws_mobile, aws_media, aws_general, aws_cost, aws_ar, aws_game, aws_enablement, aws_engagement, aws_quantum, aws_robotics, aws_satellite, aws_enduser, aws_blockchain, aws_business
  gcp_compute, gcp_storage, gcp_database, gcp_network, gcp_analytics, gcp_ml, gcp_devtools, gcp_operations, gcp_iot, gcp_api, gcp_security, gcp_migration
  azure_compute, azure_storage, azure_database, azure_network, azure_web, azure_analytics, azure_integration, azure_devops, azure_ml, azure_iot, azure_general, azure_mobile, azure_security, azure_identity, azure_migration
  k8s_compute, k8s_storage, k8s_network, k8s_rbac, k8s_infra, k8s_ecosystem, k8s_podconfig, k8s_controlplane, k8s_clusterconfig, k8s_chaos, k8s_others, k8s_group
  onprem_compute, onprem_database, onprem_network, onprem_storage, onprem_messaging, onprem_queue, onprem_monitoring, onprem_inmemory, onprem_analytics, onprem_client, onprem_container, onprem_ci, onprem_cd, onprem_vcs, onprem_iac, onprem_gitops, onprem_registry, onprem_security, onprem_identity, onprem_dns, onprem_etl, onprem_workflow, onprem_tracing, onprem_mlops, onprem_certificates, onprem_auth, onprem_aggregator, onprem_logging, onprem_groupware, onprem_proxmox, onprem_search
  generic_compute, generic_storage, generic_database, generic_network, generic_os, generic_device, generic_place, generic_virtualization, generic_blank
  saas_crm, saas_identity, saas_chat, saas_recommendation, saas_cdn, saas_communication, saas_media, saas_logging, saas_security, saas_social, saas_alerting, saas_analytics, saas_automation, saas_filesharing
  elastic_agent, elastic_beats, elastic_elasticsearch, elastic_enterprisesearch, elastic_observability, elastic_orchestration, elastic_saas, elastic_security
  programming_flowchart, programming_framework, programming_language, programming_runtime
  gis_cli, gis_cplusplus, gis_data, gis_database, gis_desktop, gis_format, gis_geocoding, gis_java, gis_javascript, gis_mobile, gis_ogc, gis_organization, gis_python, gis_routing, gis_server

Always use the alias to qualify the class. Examples:
  aws_compute.EC2(...)        NOT  EC2(...)
  gcp_storage.Storage(...)    NOT  Storage(...)
  azure_storage.BlobStorage(...) NOT BlobStorage(...)
  onprem_client.Users(...)    NOT  Users(...)
Use list_icons to find exact class names, then prefix them with the correct alias.

DIAGRAM DESIGN PRINCIPLES:
Good diagrams are immediately readable. Follow these rules strictly:

- SCOPE: Show only the most important services in the core data/request path. Omit monitoring, logging, IAM, and CI/CD unless explicitly requested.
- SIZE: Target 8–12 nodes. Hard limit of 15 nodes. When in doubt, cut — fewer nodes makes a better diagram.
- LAYOUT: Always use direction="LR" (left-to-right). Do not use "TB".
- CLUSTERS: Organize nodes into named architectural layers — use standard layer names where they apply: "Edge", "Network Layer", "Application Layer" / "Compute Layer", "Data Layer", "Messaging Layer", "Storage Layer". Only create a cluster when 2+ nodes belong to the same layer. Do not nest more than 2 cluster levels. Use invisible edges (Edge(style="invis")) between clusters or nodes to enforce left-to-right column ordering.
- CONNECTIONS: Follow the Diagrams docs "Merged Edges" approach when several arrows converge on the same downstream service or layer. Use Graphviz edge concentration rather than leaving parallel edges in place: set graph_attr with concentrate="true" and splines="spline", keep the default dot engine, and when helpful use a tiny junction node plus shared headports/minlen so the edges visibly merge before the destination. Connect layers to layers, not individual nodes to everything. The canonical flow is: Users → Edge cluster → Network cluster → Application/Compute cluster → Data/Storage cluster. Draw one representative arrow per layer-to-layer handoff. Never fan out edges from a single node to nodes in multiple unrelated layers, and never draw several parallel arrows that all terminate on the same service when one merged path would express the same relationship. No edge labels — do not use Edge(label=...) under any circumstances. Do NOT draw edges between nodes that belong to the same cluster (same layer) unless there is an explicit intra-layer flow such as primary→replica replication.
- NODE LABELS: Every node must have a two-line label: line 1 is the service name, line 2 is a short description of its role. Keep each line under ~25 characters. Use \\n to separate them. Example: gcp_network.LoadBalancing("Global HTTP LB\\nSingle entry point").
- GRAPH ATTRS: Always set graph_attr={"splines": "spline", "concentrate": "true", "ranksep": "2.0", "nodesep": "0.8"} on the Diagram so compatible edges can merge cleanly. This only works with the default dot engine.
- USERS: Always represent end users with onprem_client.Users(...).

WHAT TO EXCLUDE BY DEFAULT:
- CloudWatch, logging, monitoring nodes
- IAM, KMS, security scanning nodes
- CI/CD pipelines
- Cross-region replication unless it is the core topic

PROVIDER CONSISTENCY:
- For single-provider architectures (e.g. AWS-only), every icon MUST come from that provider's aliases (aws_*). Do NOT accidentally use icons from other provider aliases — if a service has no icon in the target provider, omit the node.
- For explicitly multi-cloud architectures, you may intentionally mix provider aliases. In that case call list_icons once per provider used, and group each provider's nodes inside a clearly labelled cluster (e.g. "AWS Region", "Azure Services", "GCP Project").
- The ONLY always-permitted cross-provider node is onprem_client.Users(...).

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
    - ALWAYS qualify every icon class with its provider-prefixed module alias. Never use bare class names.
      Correct:   aws_compute.EC2(...)   gcp_storage.Storage(...)   onprem_client.Users(...)
      Wrong:     EC2(...)               Storage(...)                Users(...)
    - Only use icon class names confirmed by list_icons. Do not guess or invent names.
    - Always use onprem_client.Users(...) to represent end users.
    - Do not name any variable "os" — it shadows the built-in used by the runtime.
    - Do not use parentheses inside diagram title strings.

    AVAILABLE ALIASES (module → alias):
      diagrams.aws.*      → aws_compute, aws_storage, aws_database, aws_network, aws_analytics,
                            aws_integration, aws_ml, aws_iot, aws_security, aws_devtools,
                            aws_management, aws_migration, aws_mobile, aws_media, aws_general,
                            aws_cost, aws_ar, aws_game, aws_enablement, aws_engagement,
                            aws_quantum, aws_robotics, aws_satellite, aws_enduser,
                            aws_blockchain, aws_business
      diagrams.gcp.*      → gcp_compute, gcp_storage, gcp_database, gcp_network, gcp_analytics,
                            gcp_ml, gcp_devtools, gcp_operations, gcp_iot, gcp_api,
                            gcp_security, gcp_migration
      diagrams.azure.*    → azure_compute, azure_storage, azure_database, azure_network,
                            azure_web, azure_analytics, azure_integration, azure_devops,
                            azure_ml, azure_iot, azure_general, azure_mobile, azure_security,
                            azure_identity, azure_migration
      diagrams.k8s.*      → k8s_compute, k8s_storage, k8s_network, k8s_rbac, k8s_infra,
                            k8s_ecosystem, k8s_podconfig, k8s_controlplane, k8s_clusterconfig,
                            k8s_chaos, k8s_others, k8s_group
      diagrams.onprem.*   → onprem_compute, onprem_database, onprem_network, onprem_storage,
                            onprem_messaging, onprem_queue, onprem_monitoring, onprem_inmemory,
                            onprem_analytics, onprem_client, onprem_container, onprem_ci,
                            onprem_cd, onprem_vcs, onprem_iac, onprem_gitops, onprem_registry,
                            onprem_security, onprem_identity, onprem_dns, onprem_etl,
                            onprem_workflow, onprem_tracing, onprem_mlops, onprem_certificates,
                            onprem_auth, onprem_aggregator, onprem_logging, onprem_groupware,
                            onprem_proxmox, onprem_search
      diagrams.generic.*  → generic_compute, generic_storage, generic_database, generic_network,
                            generic_os, generic_device, generic_place, generic_virtualization,
                            generic_blank
      diagrams.saas.*     → saas_crm, saas_identity, saas_chat, saas_recommendation, saas_cdn,
                            saas_communication, saas_media, saas_logging, saas_security,
                            saas_social, saas_alerting, saas_analytics, saas_automation,
                            saas_filesharing
      diagrams.elastic.*  → elastic_agent, elastic_beats, elastic_elasticsearch,
                            elastic_enterprisesearch, elastic_observability, elastic_orchestration,
                            elastic_saas, elastic_security
      diagrams.programming.* → programming_flowchart, programming_framework,
                               programming_language, programming_runtime
      diagrams.gis.*      → gis_cli, gis_cplusplus, gis_data, gis_database, gis_desktop,
                            gis_format, gis_geocoding, gis_java, gis_javascript, gis_mobile,
                            gis_ogc, gis_organization, gis_python, gis_routing, gis_server

    DIAGRAM DESIGN — keep it clean and readable:
    - TARGET 8–12 nodes. Hard limit: 15 nodes. Strip anything that isn't core to the data path.
    - Always use direction="LR" (left-to-right). Do not use "TB".
    - Always set graph_attr={"splines": "spline", "concentrate": "true", "ranksep": "2.0", "nodesep": "0.8"} so compatible edges can merge cleanly. This only works with the default dot engine.
    - Group related nodes into Clusters using standard architectural layer names: "Edge", "Network Layer", "Application Layer" / "Compute Layer", "Data Layer", "Messaging Layer", "Storage Layer". Only create a cluster when 2+ nodes belong to it. Max 2 nesting levels.
    - Use invisible edges (Edge(style="invis")) between clusters or nodes to enforce left-to-right column ordering.
    - Draw only meaningful data/control flow arrows between layers, not between individual nodes at random. Follow the Diagrams docs "Merged Edges" pattern: if several upstream nodes connect to the same downstream node or layer, configure compatible merged edges with concentrate="true" and splines="spline"; when helpful, use a tiny plaintext junction node and shared headports/minlen so the arrows merge before the destination. Canonical flow: Users → Edge → Network → Application/Compute → Data/Storage. One representative arrow per layer-to-layer handoff. Never fan out from a single node to nodes in multiple unrelated layers. Never leave several parallel edges that all end on the same service when they can be merged into one shared path. Never draw edges between nodes in the same cluster unless there is an explicit intra-layer flow (e.g. DB primary→replica). Never add labels to edges — do not use Edge(label=...).
    - Use Edge(style="dashed") only for async or background flows between layers.
    - Omit monitoring, logging, IAM, and CI/CD nodes unless the user explicitly asks for them.
    - PROVIDER CONSISTENCY: For single-provider architectures, every icon must come from that provider's aliases (e.g. aws_*) — do not accidentally use icons from other provider aliases. For explicitly multi-cloud architectures, you may mix aliases intentionally; call list_icons once per provider and group each provider's nodes in a labelled cluster. The only always-permitted cross-provider node is onprem_client.Users(...).
    - Every node label must be two lines: line 1 = service name (~25 chars max), line 2 = short role description (~25 chars max). Use \\n to separate. Example: gcp_compute.Run("Cloud Run\\nHandle API requests").

    COMMON PATTERNS:
    - Linear flow:   user >> gateway >> service >> database
    - Branching:     service >> [worker1, worker2, worker3]
    - Grouping:      with Cluster("Data Layer"): db = aws_database.RDS("Orders DB\\nStore order records")
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
