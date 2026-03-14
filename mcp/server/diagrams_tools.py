"""Diagram generation and example functions for the diagrams-mcp-server."""

import importlib
import inspect
import logging
import os
import re
import signal
import sys
import uuid
from typing import Optional

import diagrams

from server.models import (
    DiagramExampleResponse,
    DiagramGenerateResponse,
    DiagramIconsResponse,
    DiagramType,
)

logger = logging.getLogger(__name__)


async def generate_diagram(
    code: str,
    filename: Optional[str] = None,
    timeout: int = 90,
    workspace_dir: Optional[str] = None,
) -> DiagramGenerateResponse:
    """Generate a diagram from Python code using the `diagrams` package.

    You should use the `get_diagram_examples` tool first to get examples of how to use the `diagrams` package.

    This function accepts Python code as a string that uses the diagrams package DSL
    and generates a PNG diagram without displaying it. The code is executed with
    show=False to prevent automatic display.

    Supported diagram types:
    - AWS architecture diagrams
    - GCP architecture diagrams
    - Azure architecture diagrams
    - Kubernetes diagrams
    - On-premises diagrams
    - Hybrid / Multi-cloud diagrams
    - Sequence, Flow, and Class diagrams
    - Custom diagrams with custom nodes

    Args:
        code: Python code string using the diagrams package DSL
        filename: Output filename (without extension). If not provided, a random name will be generated.
        timeout: Timeout in seconds for diagram generation
        workspace_dir: The user's current workspace directory. If provided, diagrams will be saved to a "generated-diagrams" subdirectory.

    Returns:
        DiagramGenerateResponse: Response with the path to the generated diagram and status
    """
    if filename is None:
        filename = f"diagram_{uuid.uuid4().hex[:8]}"

    # Determine the output path
    if os.path.isabs(filename):
        # If it's an absolute path, strip .png extension if present
        # (diagrams library adds .png automatically)
        output_path = filename[:-4] if filename.endswith(".png") else filename
        # Set output_dir to the directory containing the file
        output_dir = os.path.dirname(output_path) or os.getcwd()
        os.makedirs(output_dir, exist_ok=True)
    else:
        # For non-absolute paths, use the "generated-diagrams" subdirectory

        # Strip any path components to ensure it's just a filename
        # (for relative paths with directories like "path/to/diagram.png")
        simple_filename = os.path.basename(filename)

        # Strip .png extension if present, as the diagrams library adds it automatically
        if simple_filename.endswith(".png"):
            simple_filename = simple_filename[:-4]

        # Use workspace_dir if provided and writable, otherwise fall back to temp directory
        if (
            workspace_dir
            and os.path.isdir(workspace_dir)
            and os.access(workspace_dir, os.W_OK)
        ):
            # Create a "generated-diagrams" subdirectory in the workspace
            output_dir = os.path.join(workspace_dir, "generated-diagrams")
        else:
            # Fall back to a secure temporary directory if workspace_dir isn't provided or isn't writable
            import tempfile

            temp_base = tempfile.gettempdir()
            output_dir = os.path.join(temp_base, "generated-diagrams")

        # Create the output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)

        # Combine directory and filename
        output_path = os.path.join(output_dir, simple_filename)

    try:
        # Create a namespace for execution
        namespace = {}

        # Import necessary modules directly in the namespace
        # nosec B102 - These exec calls are necessary to import modules in the namespace
        exec(  # nosem: python.lang.security.audit.exec-detected.exec-detected
            # nosem: python.lang.security.audit.exec-detected.exec-detected
            "import os",
            namespace,
        )
        # nosec B102 - These exec calls are necessary to import modules in the namespace
        exec(  # nosem: python.lang.security.audit.exec-detected.exec-detected
            "import diagrams", namespace
        )
        # nosec B102 - These exec calls are necessary to import modules in the namespace
        exec(  # nosem: python.lang.security.audit.exec-detected.exec-detected
            "from diagrams import Diagram, Cluster, Edge, Node", namespace
        )  # nosem: python.lang.security.audit.exec-detected.exec-detected
        # nosec B102 - These exec calls are necessary to import modules in the namespace
        exec(  # nosem: python.lang.security.audit.exec-detected.exec-detected
            """import diagrams.saas.crm as saas_crm
import diagrams.saas.identity as saas_identity
import diagrams.saas.chat as saas_chat
import diagrams.saas.recommendation as saas_recommendation
import diagrams.saas.cdn as saas_cdn
import diagrams.saas.communication as saas_communication
import diagrams.saas.media as saas_media
import diagrams.saas.logging as saas_logging
import diagrams.saas.security as saas_security
import diagrams.saas.social as saas_social
import diagrams.saas.alerting as saas_alerting
import diagrams.saas.analytics as saas_analytics
import diagrams.saas.automation as saas_automation
import diagrams.saas.filesharing as saas_filesharing
import diagrams.onprem.vcs as onprem_vcs
import diagrams.onprem.database as onprem_database
import diagrams.onprem.gitops as onprem_gitops
import diagrams.onprem.workflow as onprem_workflow
import diagrams.onprem.etl as onprem_etl
import diagrams.onprem.inmemory as onprem_inmemory
import diagrams.onprem.identity as onprem_identity
import diagrams.onprem.network as onprem_network
import diagrams.onprem.proxmox as onprem_proxmox
import diagrams.onprem.cd as onprem_cd
import diagrams.onprem.container as onprem_container
import diagrams.onprem.certificates as onprem_certificates
import diagrams.onprem.mlops as onprem_mlops
import diagrams.onprem.dns as onprem_dns
import diagrams.onprem.compute as onprem_compute
import diagrams.onprem.logging as onprem_logging
import diagrams.onprem.registry as onprem_registry
import diagrams.onprem.security as onprem_security
import diagrams.onprem.client as onprem_client
import diagrams.onprem.groupware as onprem_groupware
import diagrams.onprem.iac as onprem_iac
import diagrams.onprem.analytics as onprem_analytics
import diagrams.onprem.messaging as onprem_messaging
import diagrams.onprem.tracing as onprem_tracing
import diagrams.onprem.ci as onprem_ci
import diagrams.onprem.search as onprem_search
import diagrams.onprem.storage as onprem_storage
import diagrams.onprem.auth as onprem_auth
import diagrams.onprem.monitoring as onprem_monitoring
import diagrams.onprem.aggregator as onprem_aggregator
import diagrams.onprem.queue as onprem_queue
import diagrams.gis.database as gis_database
import diagrams.gis.cli as gis_cli
import diagrams.gis.server as gis_server
import diagrams.gis.python as gis_python
import diagrams.gis.organization as gis_organization
import diagrams.gis.cplusplus as gis_cplusplus
import diagrams.gis.mobile as gis_mobile
import diagrams.gis.javascript as gis_javascript
import diagrams.gis.desktop as gis_desktop
import diagrams.gis.ogc as gis_ogc
import diagrams.gis.java as gis_java
import diagrams.gis.routing as gis_routing
import diagrams.gis.data as gis_data
import diagrams.gis.geocoding as gis_geocoding
import diagrams.gis.format as gis_format
import diagrams.elastic.saas as elastic_saas
import diagrams.elastic.observability as elastic_observability
import diagrams.elastic.elasticsearch as elastic_elasticsearch
import diagrams.elastic.orchestration as elastic_orchestration
import diagrams.elastic.security as elastic_security
import diagrams.elastic.beats as elastic_beats
import diagrams.elastic.enterprisesearch as elastic_enterprisesearch
import diagrams.elastic.agent as elastic_agent
import diagrams.programming.runtime as programming_runtime
import diagrams.programming.framework as programming_framework
import diagrams.programming.flowchart as programming_flowchart
import diagrams.programming.language as programming_language
import diagrams.gcp.storage as gcp_storage
import diagrams.gcp.compute as gcp_compute
import diagrams.gcp.network as gcp_network
import diagrams.gcp.database as gcp_database
import diagrams.gcp.analytics as gcp_analytics
import diagrams.gcp.ml as gcp_ml
import diagrams.gcp.devtools as gcp_devtools
import diagrams.gcp.operations as gcp_operations
import diagrams.gcp.iot as gcp_iot
import diagrams.gcp.api as gcp_api
import diagrams.gcp.security as gcp_security
import diagrams.gcp.migration as gcp_migration
import diagrams.azure.web as azure_web
import diagrams.azure.database as azure_database
import diagrams.azure.storage as azure_storage
import diagrams.azure.compute as azure_compute
import diagrams.azure.analytics as azure_analytics
import diagrams.azure.integration as azure_integration
import diagrams.azure.devops as azure_devops
import diagrams.azure.ml as azure_ml
import diagrams.azure.iot as azure_iot
import diagrams.azure.network as azure_network
import diagrams.azure.general as azure_general
import diagrams.azure.mobile as azure_mobile
import diagrams.azure.security as azure_security
import diagrams.azure.identity as azure_identity
import diagrams.azure.migration as azure_migration
import diagrams.generic.database as generic_database
import diagrams.generic.blank as generic_blank
import diagrams.generic.network as generic_network
import diagrams.generic.virtualization as generic_virtualization
import diagrams.generic.place as generic_place
import diagrams.generic.device as generic_device
import diagrams.generic.compute as generic_compute
import diagrams.generic.os as generic_os
import diagrams.generic.storage as generic_storage
import diagrams.k8s.others as k8s_others
import diagrams.k8s.rbac as k8s_rbac
import diagrams.k8s.network as k8s_network
import diagrams.k8s.ecosystem as k8s_ecosystem
import diagrams.k8s.compute as k8s_compute
import diagrams.k8s.chaos as k8s_chaos
import diagrams.k8s.infra as k8s_infra
import diagrams.k8s.podconfig as k8s_podconfig
import diagrams.k8s.controlplane as k8s_controlplane
import diagrams.k8s.clusterconfig as k8s_clusterconfig
import diagrams.k8s.storage as k8s_storage
import diagrams.k8s.group as k8s_group
import diagrams.aws.cost as aws_cost
import diagrams.aws.ar as aws_ar
import diagrams.aws.general as aws_general
import diagrams.aws.database as aws_database
import diagrams.aws.management as aws_management
import diagrams.aws.ml as aws_ml
import diagrams.aws.game as aws_game
import diagrams.aws.enablement as aws_enablement
import diagrams.aws.network as aws_network
import diagrams.aws.quantum as aws_quantum
import diagrams.aws.iot as aws_iot
import diagrams.aws.robotics as aws_robotics
import diagrams.aws.migration as aws_migration
import diagrams.aws.mobile as aws_mobile
import diagrams.aws.compute as aws_compute
import diagrams.aws.media as aws_media
import diagrams.aws.engagement as aws_engagement
import diagrams.aws.security as aws_security
import diagrams.aws.devtools as aws_devtools
import diagrams.aws.integration as aws_integration
import diagrams.aws.business as aws_business
import diagrams.aws.analytics as aws_analytics
import diagrams.aws.blockchain as aws_blockchain
import diagrams.aws.storage as aws_storage
import diagrams.aws.satellite as aws_satellite
import diagrams.aws.enduser as aws_enduser
""",
            namespace,
        )
        # nosec B102 - These exec calls are necessary to import modules in the namespace
        exec(  # nosem: python.lang.security.audit.exec-detected.exec-detected
            "from urllib.request import urlretrieve", namespace
        )  # nosem: python.lang.security.audit.exec-detected.exec-detected

        # Process the code to ensure show=False and set the output path
        if "with Diagram(" in code:
            # Find all instances of Diagram constructor using paren-counting so
            # that parentheses inside string literals (e.g. in the diagram title)
            # don't prematurely end the match.
            def find_diagram_args(source: str):
                """Return list of (original_args, start_idx, end_idx) for each
                'with Diagram(...)' block found in source."""
                results = []
                search_from = 0
                pattern = re.compile(r"with\s+Diagram\s*\(")
                while True:
                    m = pattern.search(source, search_from)
                    if not m:
                        break
                    open_paren = m.end() - 1  # index of the '('
                    depth = 0
                    in_single = False
                    in_double = False
                    i = open_paren
                    while i < len(source):
                        ch = source[i]
                        if ch == "'" and not in_double:
                            in_single = not in_single
                        elif ch == '"' and not in_single:
                            in_double = not in_double
                        elif not in_single and not in_double:
                            if ch == "(":
                                depth += 1
                            elif ch == ")":
                                depth -= 1
                                if depth == 0:
                                    # i is the closing paren
                                    args = source[open_paren + 1 : i]
                                    results.append((args, open_paren + 1, i))
                                    search_from = i + 1
                                    break
                        i += 1
                    else:
                        break  # unmatched paren, stop
                return results

            diagram_matches = find_diagram_args(code)

            # Process in reverse order so that index positions stay valid
            for original_args, start_idx, end_idx in reversed(diagram_matches):
                # Check if show parameter is already set
                has_show = "show=" in original_args
                has_filename = "filename=" in original_args

                # Prepare new arguments
                new_args = original_args

                # Escape backslashes in path for Windows compatibility
                # Using forward slashes works on all platforms in Python
                output_path_escaped = output_path.replace("\\", "/")

                # Add or replace parameters as needed
                # If filename is already set, we need to replace it with our output_path
                if has_filename:
                    # Replace the existing filename parameter
                    filename_pattern = r'filename\s*=\s*[\'"]([^\'"]*)[\'"]'
                    new_args = re.sub(
                        filename_pattern, f"filename='{output_path_escaped}'", new_args
                    )
                else:
                    # Add the filename parameter
                    if new_args and not new_args.endswith(","):
                        new_args += ", "
                    new_args += f"filename='{output_path_escaped}'"

                # Add show=False if not already set
                if not has_show:
                    if new_args and not new_args.endswith(","):
                        new_args += ", "
                    new_args += "show=False"

                # Splice the new args back in using the exact character positions
                code = code[:start_idx] + new_args + code[end_idx:]

        # Execute diagram code with timeout support
        # Unix: Use SIGALRM (lightweight, reliable)
        # Windows: Run without timeout (SIGALRM not available, multiprocessing has issues with graphviz)
        is_unix = sys.platform != "win32" and hasattr(signal, "SIGALRM")

        if is_unix:
            # Unix: Use signal-based timeout
            def timeout_handler(signum, frame):
                raise TimeoutError(
                    f"Diagram generation timed out after {timeout} seconds"
                )

            signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(timeout)

        original_cwd = os.getcwd()
        try:
            os.chdir(output_dir)
            # nosec B102 - exec is necessary to run user-provided diagram code
            exec(
                code, namespace
            )  # nosem: python.lang.security.audit.exec-detected.exec-detected
        finally:
            os.chdir(original_cwd)
            if is_unix:
                signal.alarm(0)  # Cancel the alarm

        # Check if the file was created
        png_path = f"{output_path}.png"
        if os.path.exists(png_path):
            # Read the image file and encode as base64
            import base64

            with open(png_path, "rb") as img_file:
                image_data = base64.b64encode(img_file.read()).decode("utf-8")

            response = DiagramGenerateResponse(
                status="success",
                path=png_path,
                message=f"Diagram generated successfully at {png_path}",
                image_data=image_data,
                mime_type="image/png",
            )

            return response
        else:
            return DiagramGenerateResponse(
                status="error",
                message="Diagram file was not created. Check your code for errors.",
            )
    except TimeoutError as e:
        return DiagramGenerateResponse(status="error", message=str(e))
    except Exception as e:
        # More detailed error logging
        error_type = type(e).__name__
        error_message = str(e)
        return DiagramGenerateResponse(
            status="error",
            message=f"Error generating diagram: {error_type}: {error_message}",
        )


def get_diagram_examples(
    diagram_type: DiagramType = DiagramType.ALL,
) -> DiagramExampleResponse:
    """Get example code for different types of diagrams.

    Args:
        diagram_type: Type of diagram example to return.

    Returns:
        DiagramExampleResponse: Dictionary with example code for the requested diagram type(s)
    """
    # Normalise: accept plain strings (e.g. "gcp") or DiagramType enum members
    if not isinstance(diagram_type, DiagramType):
        try:
            diagram_type = DiagramType(str(diagram_type).lower())
        except ValueError:
            diagram_type = DiagramType.ALL

    examples = {}

    # Basic examples
    if diagram_type in [DiagramType.AWS, DiagramType.ALL]:
        examples[
            "aws_basic"
        ] = """with Diagram("Web Service on AWS", show=False, direction="LR",
    graph_attr={"splines": "spline", "concentrate": "true", "ranksep": "2.0", "nodesep": "0.8"}):
    users = onprem_client.Users("End Users")
    lb = aws_network.ELB("Load Balancer\\nDistribute incoming traffic")
    web = aws_compute.EC2("Web Server\\nServe application requests")
    db = aws_database.RDS("PostgreSQL DB\\nStore user data")
    users >> lb >> web >> db
"""

    if diagram_type in [DiagramType.SEQUENCE, DiagramType.ALL]:
        examples["sequence"] = """with Diagram("User Authentication Flow", show=False):
    user = onprem_client.Users("User")
    login = programming_flowchart.InputOutput("Login Form")
    auth = programming_flowchart.Decision("Authenticated?")
    success = programming_flowchart.Action("Access Granted")
    failure = programming_flowchart.Action("Access Denied")

    user >> login >> auth
    auth >> success
    auth >> failure
"""

    if diagram_type in [DiagramType.FLOW, DiagramType.ALL]:
        examples["flow"] = """with Diagram("Order Processing Flow", show=False):
    start = programming_flowchart.Predefined("Start")
    order = programming_flowchart.InputOutput("Order Received")
    check = programming_flowchart.Decision("In Stock?")
    process = programming_flowchart.Action("Process Order")
    wait = programming_flowchart.Delay("Backorder")
    ship = programming_flowchart.Action("Ship Order")
    end = programming_flowchart.Predefined("End")

    start >> order >> check
    check >> process >> ship >> end
    check >> wait >> process
"""

    if diagram_type in [DiagramType.CLASS, DiagramType.ALL]:
        examples["class"] = """with Diagram("Simple Class Diagram", show=False):
    base = programming_language.Python("BaseClass")
    child1 = programming_language.Python("ChildClass1")
    child2 = programming_language.Python("ChildClass2")

    base >> child1
    base >> child2
"""

    # Advanced examples from the documentation
    if diagram_type in [DiagramType.AWS, DiagramType.ALL]:
        examples[
            "aws_grouped_workers"
        ] = """with Diagram("Grouped Workers on AWS", show=False, direction="LR",
    graph_attr={"splines": "spline", "concentrate": "true", "ranksep": "2.0", "nodesep": "0.8"}):
    users = onprem_client.Users("End Users")
    lb = aws_network.ELB("Load Balancer\\nDistribute traffic")
    with Cluster("Worker Pool"):
        workers = [aws_compute.EC2("Worker 1\\nProcess jobs"),
                   aws_compute.EC2("Worker 2\\nProcess jobs"),
                   aws_compute.EC2("Worker 3\\nProcess jobs")]
    db = aws_database.RDS("Event Store\\nPersist results")
    users >> lb >> workers >> db
"""

        examples[
            "aws_clustered_web_services"
        ] = """with Diagram("Clustered Web Services on AWS", show=False, direction="LR",
    graph_attr={"splines": "spline", "concentrate": "true", "ranksep": "2.0", "nodesep": "0.8"}):
    users = onprem_client.Users("End Users")
    dns = aws_network.Route53("Route 53\\nDNS routing")
    lb = aws_network.ELB("Load Balancer\\nDistribute traffic")

    with Cluster("Application Layer"):
        svc_group = [aws_compute.ECS("web-1\\nServe requests"),
                     aws_compute.ECS("web-2\\nServe requests"),
                     aws_compute.ECS("web-3\\nServe requests")]

    with Cluster("Data Layer"):
        db_primary = aws_database.RDS("Primary DB\\nWrite traffic")
        db_primary - [aws_database.RDS("Read Replica\\nRead traffic")]
        cache = aws_database.ElastiCache("Redis Cache\\nSession & query cache")

    users >> dns >> lb >> svc_group
    svc_group >> cache >> db_primary
"""

        examples[
            "aws_event_processing"
        ] = """with Diagram("Event Processing on AWS", show=False, direction="LR",
    graph_attr={"splines": "spline", "concentrate": "true", "ranksep": "2.0", "nodesep": "0.8"}):
    users = onprem_client.Users("End Users")

    with Cluster("Ingestion"):
        source = aws_compute.EKS("EKS Cluster\\nProduce events")
        queue = aws_integration.SQS("SQS Queue\\nBuffer events")

    with Cluster("Processing"):
        handlers = [aws_compute.Lambda("Processor 1\\nHandle events"),
                    aws_compute.Lambda("Processor 2\\nHandle events")]

    with Cluster("Storage"):
        store = aws_storage.S3("S3 Bucket\\nRaw event archive")
        dw = aws_analytics.Redshift("Redshift\\nAnalytics warehouse")

    users >> source >> queue >> handlers
    handlers >> store
    handlers >> dw
"""

        examples[
            "aws_bedrock"
        ] = """with Diagram("S3 Image Processing with Bedrock", show=False, direction="LR",
    graph_attr={"splines": "spline", "concentrate": "true", "ranksep": "2.0", "nodesep": "0.8"}):
    user = onprem_client.Users("End Users")

    with Cluster("Amazon S3"):
        input_folder = aws_storage.S3("Input Bucket\\nReceive uploaded images")
        output_folder = aws_storage.S3("Output Bucket\\nStore processed results")

    fn = aws_compute.Lambda("Image Processor\\nOrchestrate pipeline")
    bedrock = aws_ml.Bedrock("Claude Sonnet\\nDetect bounding boxes")

    user >> input_folder >> fn >> bedrock
    bedrock >> fn >> output_folder
"""

    if diagram_type in [DiagramType.K8S, DiagramType.ALL]:
        examples[
            "k8s_exposed_pod"
        ] = """with Diagram("Exposed Pod with 3 Replicas", show=False):
    net = k8s_network.Ingress("domain.com") >> k8s_network.Service("svc")
    net >> [k8s_compute.Pod("pod1"),
            k8s_compute.Pod("pod2"),
            k8s_compute.Pod("pod3")] << k8s_compute.ReplicaSet("rs") << k8s_compute.Deployment("dp") << k8s_compute.HPA("hpa")
"""

        examples["k8s_stateful"] = """with Diagram("Stateful Architecture", show=False):
    with Cluster("Apps"):
        svc = k8s_network.Service("svc")
        sts = k8s_compute.StatefulSet("sts")

        apps = []
        for _ in range(3):
            pod = k8s_compute.Pod("pod")
            pvc = k8s_storage.PVC("pvc")
            pod - sts - pvc
            apps.append(svc >> pod >> pvc)

    apps << k8s_storage.PV("pv") << k8s_storage.StorageClass("sc")
"""

    if diagram_type in [DiagramType.ONPREM, DiagramType.ALL]:
        examples[
            "onprem_web_service"
        ] = """with Diagram("Web Service On-Premises", show=False, direction="LR",
    graph_attr={"splines": "spline", "concentrate": "true", "ranksep": "2.0", "nodesep": "0.8"},
    edge_attr={"minlen": "2"}):
    users = onprem_client.Users("End Users")
    ingress = onprem_network.Nginx("Nginx\nIngress & TLS termination")

    with Cluster("Application Layer"):
        grpc1 = onprem_compute.Server("gRPC Server 1\nHandle requests")
        grpc2 = onprem_compute.Server("gRPC Server 2\nHandle requests")

    with Cluster("Data Layer"):
        primary = onprem_inmemory.Redis("Redis Primary\nSession store")
        primary - onprem_inmemory.Redis("Redis Replica\nRead failover")
        db = onprem_database.PostgreSQL("PostgreSQL\nStore user records")

    with Cluster("Analytics"):
        aggregator = onprem_aggregator.Fluentd("Fluentd\nAggregate logs")
        stream = onprem_queue.Kafka("Kafka\nStream events")

    junction = Node("", shape="plaintext", width="0", height="0")

    users >> ingress >> [grpc1, grpc2]
    [grpc1, grpc2] - Edge(headport="w", minlen="1") - junction
    junction >> Edge(headport="w", minlen="2") >> [primary, db, aggregator]
    aggregator >> stream
"""

        examples[
            "onprem_web_service_colored"
        ] = """with Diagram("Web Service with Async Flows", show=False, direction="LR",
    graph_attr={"splines": "spline", "concentrate": "true", "ranksep": "2.0", "nodesep": "0.8"},
    edge_attr={"minlen": "2"}):
    users = onprem_client.Users("End Users")
    ingress = onprem_network.Nginx("Nginx\nIngress & load balancing")

    with Cluster("Application Layer"):
        grpc1 = onprem_compute.Server("gRPC Server 1\nHandle requests")
        grpc2 = onprem_compute.Server("gRPC Server 2\nHandle requests")

    with Cluster("Data Layer"):
        session = onprem_inmemory.Redis("Redis\nSession store")
        db = onprem_database.PostgreSQL("PostgreSQL\nStore user records")

    aggregator = onprem_aggregator.Fluentd("Fluentd\nAggregate & forward logs")
    stream = onprem_queue.Kafka("Kafka\nStream events")

    junction = Node("", shape="plaintext", width="0", height="0")

    users >> ingress >> [grpc1, grpc2]
    [grpc1, grpc2] - Edge(headport="w", minlen="1") - junction
    junction >> Edge(headport="w", minlen="2") >> [session, db, aggregator]
    aggregator >> Edge(style="dashed") >> stream
"""

    if diagram_type in [DiagramType.CUSTOM, DiagramType.ALL]:
        examples[
            "custom_rabbitmq"
        ] = """# Download an image to be used into a Custom Node class
rabbitmq_url = "https://jpadilla.github.io/rabbitmqapp/assets/img/icon.png"
rabbitmq_icon = "rabbitmq.png"
urlretrieve(rabbitmq_url, rabbitmq_icon)

with Diagram("Broker Consumers", show=False):
    with Cluster("Consumers"):
        consumers = [
            k8s_compute.Pod("worker"),
            k8s_compute.Pod("worker"),
            k8s_compute.Pod("worker")]

    queue = Custom("Message queue", rabbitmq_icon)

    queue >> consumers >> aws_database.Aurora("Database")
"""

    # GCP examples
    if diagram_type in [DiagramType.GCP, DiagramType.ALL]:
        # Three-tier serverless architecture following GCP best practices
        examples[
            "gcp_basic"
        ] = """with Diagram("GCP Serverless Application", show=False, direction="LR",
    graph_attr={"splines": "spline", "concentrate": "true", "ranksep": "2.0", "nodesep": "0.8"}):
    users = onprem_client.Users("End Users")
    lb = gcp_network.LoadBalancing("Cloud LB\\nRoute & load balance")

    with Cluster("Application Layer"):
        api_handler = gcp_compute.Functions("API Handler\\nProcess requests")
        events = gcp_analytics.PubSub("Pub/Sub\\nAsync event bus")
        async_worker = gcp_compute.Functions("Async Worker\\nBackground processing")

    with Cluster("Data Layer"):
        firestore = gcp_database.Firestore("Firestore\\nStore documents")
        cache = gcp_database.Memorystore("Memorystore\\nCache hot data")

    users >> lb >> api_handler
    api_handler >> cache >> firestore
    api_handler >> events >> async_worker
"""

        examples[
            "gcp_data_pipeline"
        ] = """with Diagram("GCP Data Pipeline", show=False, direction="LR"):
    with Cluster("Analytics Project"):
        source = gcp_analytics.PubSub("events")

        with Cluster("VPC Network"):
            with Cluster("Processing Subnet"):
                dataflow = gcp_analytics.Dataflow("transform")
                dataproc = gcp_analytics.Dataproc("batch")

        warehouse = gcp_analytics.BigQuery("analytics")
        viz = gcp_analytics.Datalab("analysis")

    source >> [dataflow, dataproc] >> warehouse >> viz
"""

        examples[
            "gcp_microservices"
        ] = """with Diagram("GCP Microservices Architecture", show=False, direction="LR",
    graph_attr={"splines": "spline", "concentrate": "true", "ranksep": "2.0", "nodesep": "0.8"}):
    users = onprem_client.Users("End Users")
    lb = gcp_network.LoadBalancing("Cloud LB\\nDistribute user traffic")

    with Cluster("Application Layer"):
        auth = gcp_compute.Run("Auth Service\\nAuthenticate users")
        orders = gcp_compute.Run("Orders Service\\nManage order lifecycle")

    with Cluster("Messaging"):
        queue = gcp_analytics.PubSub("Pub/Sub\\nDecouple services")

    with Cluster("Data Layer"):
        sql = gcp_database.SQL("Cloud SQL\\nStore user records")
        firestore = gcp_database.Firestore("Firestore\\nStore order data")
        cache = gcp_database.Memorystore("Memorystore\\nCache sessions")

    users >> lb >> [auth, orders]
    auth >> cache >> sql
    orders >> firestore
    orders >> queue
"""

        # MLOps architecture with Vertex AI Pipelines following Google Cloud best practices
        examples[
            "gcp_ml_pipeline"
        ] = """with Diagram("GCP MLOps Pipeline", show=False, direction="LR"):
    with Cluster("ML Project"):
        with Cluster("Data Sources"):
            bq_source = gcp_analytics.BigQuery("feature store")
            gcs_data = gcp_storage.Storage("training data")

        with Cluster("Development"):
            notebooks = gcp_ml.AIPlatform("Vertex Workbench")
            experiments = gcp_ml.AIPlatform("Experiments")

        with Cluster("CI/CD Pipeline"):
            source = gcp_devtools.SourceRepositories("pipeline code")
            build = gcp_devtools.Build("Cloud Build")
            registry = gcp_devtools.ContainerRegistry("Artifact Registry")

        with Cluster("Vertex AI Pipelines"):
            pipeline = gcp_analytics.Dataflow("training pipeline")
            train = gcp_ml.AIPlatform("model training")
            evaluate = gcp_ml.AIPlatform("evaluation")
            model_registry = gcp_ml.AIPlatform("Model Registry")

        with Cluster("Serving"):
            endpoint = gcp_ml.AIPlatform("prediction endpoint")
            monitor = gcp_operations.Logging("model monitoring")

    [bq_source, gcs_data] >> notebooks >> experiments
    experiments >> source >> build >> registry
    registry >> pipeline >> train >> evaluate >> model_registry
    model_registry >> endpoint >> monitor
"""

        # Event-driven architecture with Pub/Sub, Cloud Run functions, and error handling
        examples[
            "gcp_event_driven"
        ] = """with Diagram("GCP Event-Driven Architecture", show=False, direction="LR"):
    with Cluster("Events Project"):
        with Cluster("Event Sources"):
            user_events = gcp_analytics.PubSub("user-events")
            storage_events = gcp_storage.Storage("file uploads")
            scheduler = gcp_operations.Scheduler("cron triggers")

        with Cluster("Event Routing"):
            main_topic = gcp_analytics.PubSub("event-router")
            dead_letter = gcp_analytics.PubSub("dead-letter-topic")
            dlq_handler = gcp_compute.Functions("dlq-processor")

        with Cluster("Event Handlers (Cloud Run)"):
            with Cluster("Notification Service"):
                notif = gcp_compute.Run("notifications")
            with Cluster("Analytics Service"):
                analytics = gcp_compute.Run("analytics-processor")
            with Cluster("Audit Service"):
                audit = gcp_compute.Run("audit-logger")

        with Cluster("State Management"):
            state = gcp_database.Firestore("event-state")
            cache = gcp_database.Memorystore("dedup-cache")

        monitoring = gcp_operations.Monitoring("alerts")
        logs = gcp_operations.Logging("event-logs")

    [user_events, storage_events, scheduler] >> main_topic
    main_topic >> [notif, analytics, audit]
    main_topic >> Edge(style="dashed") >> dead_letter >> dlq_handler
    [notif, analytics, audit] >> cache >> state
    [notif, analytics, audit] >> logs >> monitoring
"""

        # IoT streaming architecture with proper data flow and processing tiers
        examples[
            "gcp_iot_streaming"
        ] = """with Diagram("GCP IoT Streaming Platform", show=False, direction="LR"):
    with Cluster("IoT Project"):
        with Cluster("Device Layer"):
            devices = gcp_iot.IotCore("IoT Core Registry")
            telemetry = gcp_analytics.PubSub("telemetry-topic")
            commands = gcp_analytics.PubSub("command-topic")

        with Cluster("Stream Processing Layer"):
            with Cluster("Dataflow Jobs"):
                hot_path = gcp_analytics.Dataflow("real-time aggregation")
                cold_path = gcp_analytics.Dataflow("batch enrichment")

            with Cluster("Alert Processing"):
                alert_fn = gcp_compute.Functions("threshold-alerts")
                ml_inference = gcp_ml.AIPlatform("anomaly detection")

        with Cluster("Storage Layer"):
            time_series = gcp_database.Bigtable("time-series-db")
            warehouse = gcp_analytics.BigQuery("analytics-warehouse")
            archive = gcp_storage.Storage("cold-storage")

        with Cluster("Visualization"):
            dashboard = gcp_analytics.Datalab("dashboards")
            monitoring = gcp_operations.Monitoring("alerts")

    devices >> telemetry >> hot_path
    hot_path >> time_series >> dashboard
    hot_path >> alert_fn >> monitoring
    hot_path >> ml_inference
    telemetry >> cold_path >> warehouse >> dashboard
    cold_path >> archive
    commands >> devices
"""

        # Shared VPC example showing GCP networking best practices
        examples[
            "gcp_shared_vpc"
        ] = """with Diagram("GCP Shared VPC Architecture", show=False, direction="TB"):
    interconnect = gcp_network.DedicatedInterconnect("Cloud Interconnect")

    with Cluster("Shared VPC Host Project"):
        with Cluster("Shared VPC Network"):
            with Cluster("us-central1"):
                prod_subnet = gcp_network.VPC("prod-subnet\\n10.0.1.0/24")
                dev_subnet = gcp_network.VPC("dev-subnet\\n10.0.2.0/24")

            with Cluster("us-east1"):
                dr_subnet = gcp_network.VPC("dr-subnet\\n10.0.3.0/24")

            nat = gcp_network.NAT("Cloud NAT")
            fw = gcp_network.FirewallRules("Firewall Rules")

    with Cluster("Production Service Project"):
        with Cluster("GKE Cluster"):
            prod_gke = gcp_compute.GKE("prod-cluster")
            prod_nodes = [
                gcp_compute.ComputeEngine("node-1"),
                gcp_compute.ComputeEngine("node-2")
            ]

    with Cluster("Development Service Project"):
        dev_run = gcp_compute.Run("dev-services")
        dev_sql = gcp_database.SQL("dev-db")

    interconnect >> fw >> prod_subnet
    prod_subnet >> prod_gke >> prod_nodes
    dev_subnet >> dev_run >> dev_sql
    [prod_subnet, dev_subnet] >> nat
"""

    # Azure examples
    if diagram_type in [DiagramType.AZURE, DiagramType.ALL]:
        examples[
            "azure_basic"
        ] = """with Diagram("Azure Web Application", show=False, direction="LR",
    graph_attr={"splines": "spline", "concentrate": "true", "ranksep": "2.0", "nodesep": "0.8"}):
    users = onprem_client.Users("End Users")
    app = azure_web.AppServices("App Service\\nHost web application")
    db = azure_database.SQLServers("Azure SQL\\nStore relational data")
    storage = azure_storage.BlobStorage("Blob Storage\\nStore static assets")
    users >> app >> db
    app >> storage
"""

        examples[
            "azure_serverless"
        ] = """with Diagram("Azure Serverless Architecture", show=False, direction="LR"):
    http = azure_integration.APIManagement("api gateway")
    func = azure_compute.FunctionApps("business logic")

    with Cluster("Data Layer"):
        cosmos = azure_database.CosmosDb("documents")
        cache = azure_database.CacheForRedis("cache")

    events = azure_integration.EventHubs("event stream")

    http >> func >> cosmos
    func >> cache
    func >> events
"""

        examples[
            "azure_microservices"
        ] = """with Diagram("Azure Microservices on AKS", show=False):
    gateway = azure_network.ApplicationGateway("gateway")
    aks = azure_compute.KubernetesServices("AKS cluster")

    with Cluster("Services"):
        services = [
            azure_compute.ContainerInstances("auth"),
            azure_compute.ContainerInstances("orders"),
            azure_compute.ContainerInstances("payments")
        ]

    with Cluster("Databases"):
        sql = azure_database.SQLServers("users")
        cosmos = azure_database.CosmosDb("orders")

    monitor = azure_general.LogAnalyticsWorkspaces("monitoring")
    registry = azure_compute.ContainerRegistries("images")

    gateway >> aks >> services
    services[0] >> sql
    services[1] >> cosmos
    services >> monitor
    registry >> aks
"""

        examples[
            "azure_data_platform"
        ] = """with Diagram("Azure Data Platform", show=False, direction="TB"):
    sources = [
        azure_storage.BlobStorage("raw data"),
        azure_integration.EventHubs("streaming")
    ]

    with Cluster("Processing"):
        databricks = azure_analytics.Databricks("transform")
        synapse = azure_analytics.SynapseAnalytics("warehouse")

    analysis = azure_analytics.AnalysisServices("analytics")

    sources >> databricks >> synapse >> analysis
"""

        examples[
            "azure_event_driven"
        ] = """with Diagram("Azure Event-Driven Microservices", show=False, direction="LR"):
    gateway = azure_integration.APIManagement("api gateway")

    with Cluster("Event Bus"):
        events = azure_integration.EventHubs("event stream")
        grid = azure_integration.EventGridTopics("event routing")

    with Cluster("Microservices"):
        services = [
            azure_compute.FunctionApps("orders"),
            azure_compute.FunctionApps("inventory"),
            azure_compute.FunctionApps("shipping")
        ]

    with Cluster("State"):
        cosmos = azure_database.CosmosDb("event store")
        queue = azure_integration.ServiceBus("saga coordinator")

    gateway >> services[0] >> events
    events >> grid >> services[1:]
    services >> cosmos
    services >> queue
"""

        examples[
            "azure_ntier"
        ] = """with Diagram("Azure N-Tier Application", show=False, direction="TB"):
    users = azure_network.TrafficManagerProfiles("global traffic")

    with Cluster("Presentation Tier"):
        web = azure_web.AppServices("web app")
        cdn = azure_network.CDNProfiles("static content")

    with Cluster("Application Tier"):
        lb = azure_network.ApplicationGateway("load balancer")
        apps = [
            azure_compute.VM("app server 1"),
            azure_compute.VM("app server 2"),
            azure_compute.VM("app server 3")
        ]

    with Cluster("Data Tier"):
        primary = azure_database.SQLServers("primary db")
        replica = azure_database.SQLServers("read replica")
        cache = azure_database.CacheForRedis("cache")

    users >> [web, cdn]
    web >> lb >> apps
    apps >> cache >> primary
    primary >> Edge(style="dashed") >> replica
"""

        examples[
            "azure_iot_edge"
        ] = """with Diagram("Azure IoT Edge Solution", show=False, direction="LR"):
    devices = azure_iot.IotCentralApplications("iot devices")
    hub = azure_iot.IotHub("iot hub")

    with Cluster("Stream Analytics"):
        stream = azure_analytics.StreamAnalyticsJobs("hot path")
        batch = azure_storage.DataLakeStorage("cold path")

    with Cluster("Processing"):
        functions = azure_compute.FunctionApps("event processing")
        ml = azure_ml.MachineLearningServiceWorkspaces("ml inference")

    with Cluster("Storage & Visualization"):
        cosmos = azure_database.CosmosDb("time series")
        insights = azure_analytics.TimeSeriesInsightsEnvironments("analytics")

    devices >> hub >> [stream, batch]
    stream >> functions >> cosmos
    stream >> ml
    cosmos >> insights
"""

    # Hybrid cloud examples
    if diagram_type in [DiagramType.HYBRID, DiagramType.ALL]:
        examples[
            "hybrid_aws_onprem"
        ] = """with Diagram("Hybrid Cloud Architecture", show=False, direction="LR"):
    with Cluster("On-Premises Data Center"):
        onprem_db = onprem_database.PostgreSQL("legacy db")
        onprem_app = onprem_compute.Server("legacy app")

    vpn = onprem_network.VPN("site-to-site")

    with Cluster("AWS Cloud"):
        vpc = aws_network.VPC("vpc")
        with Cluster("Application Tier"):
            alb = aws_network.ELB("load balancer")
            apps = [
                aws_compute.EC2("app1"),
                aws_compute.EC2("app2")
            ]
        rds = aws_database.RDS("cloud db")

    onprem_app >> vpn >> vpc >> alb >> apps
    apps >> rds
    apps >> Edge(style="dashed") >> onprem_db
"""

        examples[
            "hybrid_k8s_cloud"
        ] = """with Diagram("Hybrid Kubernetes Setup", show=False):
    with Cluster("On-Premises"):
        onprem_k8s = onprem_compute.Server("k8s master")
        onprem_workers = [
            onprem_compute.Server("worker1"),
            onprem_compute.Server("worker2")
        ]
        onprem_nfs = onprem_storage.Glusterfs("nfs")

    with Cluster("Cloud"):
        cloud_k8s = aws_compute.EKS("eks cluster")
        cloud_storage = aws_storage.S3("object storage")

    mesh = onprem_network.Istio("service mesh")

    onprem_k8s >> onprem_workers >> onprem_nfs
    cloud_k8s >> cloud_storage
    onprem_k8s >> Edge(style="dashed") >> mesh >> cloud_k8s
"""

        examples[
            "hybrid_disaster_recovery"
        ] = """with Diagram("Hybrid DR Architecture", show=False, direction="TB"):
    with Cluster("Primary Site (On-Prem)"):
        primary_lb = onprem_network.Nginx("load balancer")
        primary_app = [onprem_compute.Server("app1"), onprem_compute.Server("app2")]
        primary_db = onprem_database.PostgreSQL("primary db")

    with Cluster("DR Site (Cloud)"):
        dr_lb = aws_network.ELB("standby lb")
        dr_app = [aws_compute.EC2("standby1"), aws_compute.EC2("standby2")]
        dr_db = aws_database.RDS("replica db")

    dns = aws_network.Route53("dns failover")

    dns >> primary_lb >> primary_app >> primary_db
    primary_db >> Edge(style="dashed") >> dr_db
    dns >> Edge(style="dotted") >> dr_lb >> dr_app >> dr_db
"""

    # Multi-cloud examples
    if diagram_type in [DiagramType.MULTICLOUD, DiagramType.ALL]:
        examples[
            "multicloud_global_app"
        ] = """with Diagram("Multi-Cloud Global Application", show=False, direction="LR"):
    dns = aws_network.Route53("global dns")

    with Cluster("AWS Region (US)"):
        aws_lb = aws_network.ELB("alb")
        aws_app = [aws_compute.EC2("app1"), aws_compute.EC2("app2")]
        aws_db = aws_database.RDS("primary db")

    with Cluster("GCP Region (EU)"):
        gcp_lb = gcp_network.LoadBalancing("lb")
        gcp_app = [gcp_compute.Run("app1"), gcp_compute.Run("app2")]
        gcp_db = gcp_database.SQL("replica db")

    with Cluster("Azure Region (APAC)"):
        azure_lb = azure_network.ApplicationGateway("gateway")
        azure_app = [azure_web.AppServices("app1"), azure_web.AppServices("app2")]
        azure_db = azure_database.SQLServers("read replica")

    dns >> [aws_lb, gcp_lb, azure_lb]
    aws_lb >> aws_app >> aws_db
    gcp_lb >> gcp_app >> gcp_db
    azure_lb >> azure_app >> azure_db
    aws_db >> Edge(style="dashed") >> [gcp_db, azure_db]
"""

        examples[
            "multicloud_data_mesh"
        ] = """with Diagram("Multi-Cloud Data Mesh", show=False, direction="TB"):
    with Cluster("Data Sources"):
        aws_source = aws_storage.S3("aws data lake")
        gcp_source = gcp_storage.Storage("gcp data lake")
        azure_source = azure_storage.BlobStorage("azure data lake")

    with Cluster("Processing Layer"):
        aws_proc = aws_analytics.Glue("aws etl")
        gcp_proc = gcp_analytics.Dataflow("gcp pipeline")
        azure_proc = azure_analytics.Databricks("azure transform")

    with Cluster("Analytics"):
        aws_analytics_node = aws_analytics.Athena("aws query")
        gcp_analytics_node = gcp_analytics.BigQuery("gcp warehouse")
        azure_analytics_node = azure_analytics.SynapseAnalytics("azure analytics")

    unified = onprem_monitoring.Grafana("unified dashboard")

    aws_source >> aws_proc >> aws_analytics_node
    gcp_source >> gcp_proc >> gcp_analytics_node
    azure_source >> azure_proc >> azure_analytics_node
    [aws_analytics_node, gcp_analytics_node, azure_analytics_node] >> unified
"""

        examples[
            "multicloud_cicd"
        ] = """with Diagram("Multi-Cloud CI/CD Pipeline", show=False, direction="LR"):
    repo = onprem_vcs.Github("source code")
    cicd = onprem_ci.Jenkins("ci/cd")

    with Cluster("Build & Registry"):
        build = onprem_container.Docker("build")
        aws_registry = aws_compute.ECR("aws ecr")
        gcp_registry = gcp_devtools.ContainerRegistry("gcp registry")
        azure_registry = azure_compute.ContainerRegistries("azure acr")

    with Cluster("Deployment Targets"):
        aws_deploy = aws_compute.EKS("aws eks")
        gcp_deploy = gcp_compute.GKE("gcp gke")
        azure_deploy = azure_compute.KubernetesServices("azure aks")

    monitor = onprem_monitoring.Datadog("monitoring")

    repo >> cicd >> build
    build >> [aws_registry, gcp_registry, azure_registry]
    aws_registry >> aws_deploy
    gcp_registry >> gcp_deploy
    azure_registry >> azure_deploy
    [aws_deploy, gcp_deploy, azure_deploy] >> monitor
"""

    return DiagramExampleResponse(examples=examples)


def list_diagram_icons(
    provider_filter: Optional[str] = None, service_filter: Optional[str] = None
) -> DiagramIconsResponse:
    """List available icons from the diagrams package, with optional filtering.

    Args:
        provider_filter: Optional filter by provider name (e.g., "aws", "gcp")
        service_filter: Optional filter by service name (e.g., "compute", "database")

    Returns:
        DiagramIconsResponse: Dictionary with available providers, services, and icons
    """
    logger.debug("Starting list_diagram_icons function")
    logger.debug(f"Filters - provider: {provider_filter}, service: {service_filter}")

    try:
        # If no filters provided, just return the list of available providers
        if not provider_filter and not service_filter:
            # Get the base path of the diagrams package
            diagrams_path = os.path.dirname(diagrams.__file__)
            providers = {}

            # List of provider directories to exclude
            exclude_dirs = ["__pycache__", "_template"]

            # Just list the available providers without their services/icons
            for provider_name in os.listdir(os.path.join(diagrams_path)):
                provider_path = os.path.join(diagrams_path, provider_name)

                # Skip non-directories and excluded directories
                if (
                    not os.path.isdir(provider_path)
                    or provider_name.startswith("_")
                    or provider_name in exclude_dirs
                ):
                    continue

                # Add provider to the dictionary with empty services
                providers[provider_name] = {}

            return DiagramIconsResponse(
                providers=providers, filtered=False, filter_info=None
            )

        # Dictionary to store filtered providers and their services/icons
        providers = {}

        # Get the base path of the diagrams package
        diagrams_path = os.path.dirname(diagrams.__file__)

        # List of provider directories to exclude
        exclude_dirs = ["__pycache__", "_template"]

        # If only provider filter is specified
        if provider_filter and not service_filter:
            provider_path = os.path.join(diagrams_path, provider_filter)

            # Check if the provider exists
            if not os.path.isdir(provider_path) or provider_filter in exclude_dirs:
                return DiagramIconsResponse(
                    providers={},
                    filtered=True,
                    filter_info={
                        "provider": provider_filter,
                        "error": "Provider not found",
                    },
                )

            # Add provider to the dictionary
            providers[provider_filter] = {}

            # Iterate through all service modules in the provider
            for service_file in os.listdir(provider_path):
                # Skip non-Python files and special files
                if not service_file.endswith(".py") or service_file.startswith("_"):
                    continue

                service_name = service_file[:-3]  # Remove .py extension

                # Import the service module
                module_path = f"diagrams.{provider_filter}.{service_name}"
                try:
                    service_module = importlib.import_module(  # nosem: python.lang.security.audit.non-literal-import.non-literal-import
                        module_path  # nosem: python.lang.security.audit.non-literal-import.non-literal-import
                    )  # nosem: python.lang.security.audit.non-literal-import.non-literal-import

                    # Find all classes in the module that are Node subclasses
                    icons = []
                    for name, obj in inspect.getmembers(service_module):
                        # Skip private members and imported modules
                        if name.startswith("_") or inspect.ismodule(obj):
                            continue

                        # Check if it's a class and likely a Node subclass
                        if inspect.isclass(obj) and hasattr(obj, "_icon"):
                            icons.append(name)

                    # Add service and its icons to the provider
                    if icons:
                        providers[provider_filter][service_name] = sorted(icons)

                except (ImportError, AttributeError, Exception) as e:
                    logger.error(f"Error processing {module_path}: {str(e)}")
                    continue

            return DiagramIconsResponse(
                providers=providers,
                filtered=True,
                filter_info={"provider": provider_filter},
            )

        # If both provider and service filters are specified
        elif provider_filter and service_filter:
            provider_path = os.path.join(diagrams_path, provider_filter)

            # Check if the provider exists
            if not os.path.isdir(provider_path) or provider_filter in exclude_dirs:
                return DiagramIconsResponse(
                    providers={},
                    filtered=True,
                    filter_info={
                        "provider": provider_filter,
                        "service": service_filter,
                        "error": "Provider not found",
                    },
                )

            # Add provider to the dictionary
            providers[provider_filter] = {}

            # Check if the service exists
            service_file = f"{service_filter}.py"
            service_path = os.path.join(provider_path, service_file)

            if not os.path.isfile(service_path):
                return DiagramIconsResponse(
                    providers={provider_filter: {}},
                    filtered=True,
                    filter_info={
                        "provider": provider_filter,
                        "service": service_filter,
                        "error": "Service not found",
                    },
                )

            # Import the service module
            module_path = f"diagrams.{provider_filter}.{service_filter}"
            try:
                service_module = importlib.import_module(  # nosem: python.lang.security.audit.non-literal-import.non-literal-import
                    module_path  # nosem: python.lang.security.audit.non-literal-import.non-literal-import
                )  # nosem: python.lang.security.audit.non-literal-import.non-literal-import

                # Find all classes in the module that are Node subclasses
                icons = []
                for name, obj in inspect.getmembers(service_module):
                    # Skip private members and imported modules
                    if name.startswith("_") or inspect.ismodule(obj):
                        continue

                    # Check if it's a class and likely a Node subclass
                    if inspect.isclass(obj) and hasattr(obj, "_icon"):
                        icons.append(name)

                # Add service and its icons to the provider
                if icons:
                    providers[provider_filter][service_filter] = sorted(icons)

            except (ImportError, AttributeError, Exception) as e:
                logger.error(f"Error processing {module_path}: {str(e)}")
                return DiagramIconsResponse(
                    providers={provider_filter: {}},
                    filtered=True,
                    filter_info={
                        "provider": provider_filter,
                        "service": service_filter,
                        "error": f"Error loading service: {str(e)}",
                    },
                )

            return DiagramIconsResponse(
                providers=providers,
                filtered=True,
                filter_info={"provider": provider_filter, "service": service_filter},
            )

        # If only service filter is specified (not supported)
        elif service_filter:
            return DiagramIconsResponse(
                providers={},
                filtered=True,
                filter_info={
                    "service": service_filter,
                    "error": "Service filter requires provider filter",
                },
            )

        # Original implementation for backward compatibility
        else:
            # Dictionary to store all providers and their services/icons
            providers = {}

            # Get the base path of the diagrams package
            diagrams_path = os.path.dirname(diagrams.__file__)
            logger.debug(f"Diagrams package path: {diagrams_path}")

            # Iterate through all provider directories
            for provider_name in os.listdir(os.path.join(diagrams_path)):
                provider_path = os.path.join(diagrams_path, provider_name)

                # Skip non-directories and excluded directories
                if (
                    not os.path.isdir(provider_path)
                    or provider_name.startswith("_")
                    or provider_name in exclude_dirs
                ):
                    logger.debug(
                        f"Skipping {provider_name}: not a directory or in exclude list"
                    )
                    continue

                # Add provider to the dictionary
                providers[provider_name] = {}
                logger.debug(f"Processing provider: {provider_name}")

                # Iterate through all service modules in the provider
                for service_file in os.listdir(provider_path):
                    # Skip non-Python files and special files
                    if not service_file.endswith(".py") or service_file.startswith("_"):
                        logger.debug(
                            f"Skipping file {service_file}: not a Python file or starts with _"
                        )
                        continue

                    service_name = service_file[:-3]  # Remove .py extension
                    logger.debug(f"Processing service: {provider_name}.{service_name}")

                    # Import the service module
                    module_path = f"diagrams.{provider_name}.{service_name}"
                    try:
                        logger.debug(f"Attempting to import module: {module_path}")
                        service_module = importlib.import_module(  # nosem: python.lang.security.audit.non-literal-import.non-literal-import
                            module_path  # nosem: python.lang.security.audit.non-literal-import.non-literal-import
                        )  # nosem: python.lang.security.audit.non-literal-import.non-literal-import

                        # Find all classes in the module that are Node subclasses
                        icons = []
                        for name, obj in inspect.getmembers(service_module):
                            # Skip private members and imported modules
                            if name.startswith("_") or inspect.ismodule(obj):
                                continue

                            # Check if it's a class and likely a Node subclass
                            if inspect.isclass(obj) and hasattr(obj, "_icon"):
                                icons.append(name)
                                logger.debug(f"Found icon: {name}")

                        # Add service and its icons to the provider
                        if icons:
                            providers[provider_name][service_name] = sorted(icons)
                            logger.debug(
                                f"Added {len(icons)} icons for {provider_name}.{service_name}"
                            )
                        else:
                            logger.warning(
                                f"No icons found for {provider_name}.{service_name}"
                            )

                    except ImportError as ie:
                        logger.error(f"ImportError for {module_path}: {str(ie)}")
                        continue
                    except AttributeError as ae:
                        logger.error(f"AttributeError for {module_path}: {str(ae)}")
                        continue
                    except Exception as e:
                        logger.error(
                            f"Unexpected error processing {module_path}: {str(e)}"
                        )
                        continue

            logger.debug(f"Completed processing. Found {len(providers)} providers")
            return DiagramIconsResponse(
                providers=providers, filtered=False, filter_info=None
            )

    except Exception as e:
        logger.exception(f"Error in list_diagram_icons: {str(e)}")
        # Return empty response on error
        return DiagramIconsResponse(
            providers={}, filtered=False, filter_info={"error": str(e)}
        )
