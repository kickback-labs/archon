# Tool-Based Agent

## Description

The Tool-Based Agent pattern (also known as function calling or ReAct-style agents) extends an LLM beyond text generation by providing it with a registry of callable external tools. When the agent determines it lacks information needed to answer a prompt, it pauses generation, selects the appropriate tool, constructs a structured call payload (JSON), and instructs the runtime to execute the tool. The runtime executes the call, returns the result, and the agent resumes reasoning with the fresh context — iterating as many times as needed until it produces a final answer.

Tools can include: SQL query executors, REST API clients, web search, file readers, calculators, code interpreters, database lookup functions, or any callable system action.

This is the foundation for all more complex agentic patterns.

## When to Use

- An LLM must interact with real-time external systems, live databases, or live APIs to answer questions accurately
- The system needs to take actions on behalf of the user (send email, create tickets, update records)
- Static LLM knowledge is insufficient — answers require current data (prices, inventory, schedules)
- The agent needs multi-step reasoning with intermediate tool results informing subsequent steps

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | LLM inference (OpenAI, Anthropic, Gemini, or self-hosted) + tool execution runtime |
| `integration_messaging` | Tool implementations (API clients, DB connectors, search APIs) |
| `security_identity` | Tool-level authorisation — the agent must only call tools the user is permitted to use; input validation to prevent prompt injection |
| `devops` | Tool call logging, latency monitoring, tool error rate tracking |

## Key Design Considerations

| Consideration | Guidance |
|---|---|
| **Tool schema design** | Clear, precise tool descriptions and parameter schemas directly improve tool selection accuracy |
| **Tool count** | More than 20–30 tools degrades tool selection reliability — consider sub-agents for tool domains |
| **Error handling** | Tools will fail; the agent must handle tool errors gracefully and retry or fall back |
| **Authorisation** | Every tool call must be checked against the calling user's permissions — never trust the LLM to enforce access control |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Capability** | Dramatically expands what the LLM can do — from answering questions to taking actions |
| **Latency** | Each tool call adds round-trip latency — multi-step tool use can take several seconds |
| **Reliability** | LLMs occasionally select the wrong tool or construct incorrect parameters — error handling and human-in-the-loop checkpoints are important for high-stakes actions |
| **Security** | Prompt injection attacks can attempt to hijack tool calls — tool input sanitisation and authorisation checks are mandatory |

## Common Pitfalls

- Exposing tools without user-level authorisation checks — the agent acting as the user must not exceed the user's actual permissions
- Not logging tool calls — tool call audit trails are essential for debugging, compliance, and cost attribution
- Tool descriptions that are too vague — the agent selects tools based on descriptions; poor descriptions cause incorrect tool selection
- Allowing destructive tools (delete, send, transfer) without human confirmation steps — always add a confirmation gate for irreversible actions
