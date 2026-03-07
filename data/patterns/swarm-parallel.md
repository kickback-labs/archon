# Swarm / Parallel Agent

## Description

The Swarm (Parallel Agent) pattern dispatches multiple independent AI agents simultaneously to solve different facets of the same problem, then aggregates their outputs into a unified result. Unlike the Orchestrator-Worker pattern (which may run sequentially), Swarm is inherently parallel — all agents run concurrently, and the total wall-clock time is bounded by the slowest agent, not the sum of all agents.

The pattern is most valuable when a problem has clearly separable, independent sub-problems that can be solved without inter-agent communication. Each agent in the swarm focuses on its slice of the problem with full context about the overall goal.

## When to Use

- Accelerating complex analysis by distributing work across multiple agents simultaneously
- The problem decomposes into truly independent sub-problems with no ordering dependencies between them
- Time-to-answer is more important than sequential thoroughness — parallelism trades sequential depth for speed
- Each sub-problem benefits from a fresh, focused agent context rather than a single agent tracking multiple threads

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Concurrent LLM inference for all agents; the aggregator node (may be another LLM or deterministic code) |
| `integration_messaging` | Coordination mechanism for parallel dispatch and result collection (async futures, message queues, step function parallel branches) |
| `devops` | Per-agent latency and cost tracking; timeout management; partial failure handling in the aggregator |

## Relationship to Scatter-Gather

Swarm is the AI-agent equivalent of the Scatter-Gather integration pattern: the orchestrator scatters work to parallel agents, and a synthesis step gathers and combines their outputs. The key difference is that Swarm involves LLM agents rather than API calls.

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Speed** | Total time ≈ slowest agent, not sum of all agents — significant speedup for parallelisable problems |
| **Cost** | Multiple concurrent LLM invocations multiply token costs proportionally |
| **Independence** | Agents cannot share intermediate results — problems with inter-dependencies between sub-tasks cannot use this pattern |
| **Aggregation complexity** | Merging multiple agents' outputs requires careful synthesis — contradictory outputs must be resolved |

## Common Pitfalls

- Using Swarm when sub-tasks have ordering dependencies — the result of agent A must inform agent B means these cannot safely run in parallel
- Not setting per-agent timeouts — a slow agent blocks the aggregation step indefinitely if no timeout is enforced
- Aggregator that simply concatenates outputs — the synthesis step must actively resolve conflicts and contradictions between agents, not just join their text
- Over-parallelising — dispatching 20 agents for a problem that a single well-prompted agent could solve adds cost and synthesis complexity without quality benefit
