from fastmcp import FastMCP

# Create an MCP server
mcp = FastMCP("Archon Tooling")

@mcp.tool()
async def get_infrastructure_recommendation(context: str) -> str:
    """Provides infrastructure recommendations based on context."""
    return f"Based on '{context}', I recommend a serverless architecture with AWS Lambda and DynamoDB for cost efficiency and scalability."

if __name__ == "__main__":
    mcp.run()
