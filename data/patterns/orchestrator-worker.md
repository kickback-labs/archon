# Orchestrator-Worker

## Description

The Orchestrator-Worker pattern (also called the Coordinator pattern) is a multi-agent architecture where a central "orchestrator" agent acts as the front door and task decomposer. The orchestrator receives a complex, potentially ambiguous user prompt, decomposes it into discrete sub-tasks, and delegates each sub-task to a specialised "worker" agent with a narrow, domain-specific focus. Worker agents execute their tasks (potentially using their own tools) and return results to the orchestrator, which synthesises the outputs into a final coherent response.

This is the architecture that Archon itself uses: a Pattern Agent decomposes the problem, Specialist Agents handle individual domain pillars in parallel, a Critic Agent validates, and a Synthesis Agent assembles the final output.

## When to Use

- User requests are complex and multi-domain — no single specialised agent can answer the full question
- Different parts of a problem require different expertise, tools, or context — dedicated worker agents outperform a single generalist agent
- Parallel execution of sub-tasks is possible — running workers concurrently reduces total response latency
- Output quality benefits from specialisation — a dedicated financial compliance agent will outperform a general-purpose agent on compliance questions

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | LLM inference for orchestrator and all worker agents; may run on different models (larger orchestrator, smaller focused workers) |
| `integration_messaging` | Communication channel between orchestrator and workers (in-process function calls, message queue, or async HTTP) |
| `devops` | Per-agent observability, distributed trace across orchestrator-worker call chain, worker error rate and latency monitoring |

## Variants

| Variant | Description |
|---|---|
| **Sequential orchestration** | Orchestrator runs workers one at a time, passing outputs as inputs to the next |
| **Parallel orchestration** | Orchestrator dispatches all workers simultaneously and aggregates results (Scatter-Gather applied to agents) |
| **Hierarchical orchestration** | Worker agents themselves act as mini-orchestrators, delegating to sub-workers — for extremely complex tasks |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Quality** | Specialised workers outperform generalists on their domain tasks |
| **Latency** | Parallel dispatch minimises wall-clock time; sequential orchestration multiplies individual latencies |
| **Complexity** | The orchestrator's decomposition logic is the most critical component — poorly decomposed tasks degrade quality |
| **Cost** | Multiple agent invocations multiply LLM token costs compared to a single agent response |
| **Failure handling** | The orchestrator must handle partial worker failures gracefully — one failed worker should not abort the entire response |

## Common Pitfalls

- Orchestrator that delegates too granularly — creating 15 workers for a task a single specialised agent could handle adds latency and cost without quality benefit
- Not making the orchestrator stateful — an orchestrator that cannot track which workers succeeded and which failed cannot recover from partial failures
- Workers with overlapping scope — ambiguous boundaries cause duplicate work and contradictory outputs
- Not logging the orchestrator's decomposition decisions — these decisions are the most important reasoning step to debug when quality is poor
