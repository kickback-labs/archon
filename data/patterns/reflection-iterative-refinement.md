# Reflection / Iterative Refinement

## Description

The Reflection (Iterative Refinement) pattern builds an autonomous evaluation loop directly into the AI pipeline. A "generator" agent produces an initial output, which is immediately passed to a separate "evaluator" (critic) agent programmed with explicit quality rubrics, policy constraints, and safety guardrails. If the evaluator identifies errors, hallucinations, policy violations, or poor reasoning, it returns structured critique to the generator, which rewrites the output. This loop continues until the output passes all evaluation criteria, or a maximum iteration count is reached.

The evaluator agent is independent of the generator — it has a different system prompt, different evaluation lens, and no incentive to approve its own outputs.

## When to Use

- High-stakes outputs where errors are unacceptable before reaching the user — legal documents, medical recommendations, financial calculations, compliance assessments
- Safety-critical AI applications where hallucination or policy violation must be caught programmatically, not just hoped to be absent
- Complex reasoning tasks where a single LLM pass frequently contains logical errors or gaps
- Automated code generation where the generated code should be reviewed against a correctness rubric before being presented
- Any system where output quality must be objectively measurable against defined criteria

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | Separate LLM inference for generator and evaluator (can be same or different models); the evaluator often benefits from being a more capable/slower model |
| `devops` | Iteration count tracking, critique logging, quality metric trending, loop termination monitoring |

## Evaluator Rubric Design

The evaluator's rubric is the most critical design element. It should specify:

| Dimension | Example criteria |
|---|---|
| **Factual accuracy** | Does the output contradict retrieved source documents? |
| **Completeness** | Are all required sections present? |
| **Policy compliance** | Does the output violate any stated constraints? |
| **Logical consistency** | Does the reasoning contain contradictions? |
| **Format correctness** | Does the output conform to the required schema or format? |

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Quality** | Significant quality improvement on complex or safety-critical tasks compared to single-pass generation |
| **Latency** | Each iteration adds full round-trip latency — multiple iterations can add seconds to minutes |
| **Cost** | Each iteration doubles (or more) the LLM token cost |
| **Infinite loop risk** | Without a hard iteration cap, a generator that consistently fails the evaluator loops indefinitely |
| **Evaluator quality** | A poorly designed evaluator that approves bad outputs or rejects good ones is worse than no evaluator |

## Common Pitfalls

- Not setting a maximum iteration count — always terminate after N iterations (typically 2–3) whether or not the evaluator approves
- Using the same model for both generation and evaluation — the model will often approve its own outputs due to self-consistency bias
- Evaluator rubric that is too vague — "is this a good response?" is not a rubric; define specific, measurable pass/fail criteria
- Not logging critique content — the evaluator's critiques are valuable training signal and debugging information
- Applying this pattern to low-stakes, simple tasks — the latency and cost overhead is only justified for genuinely high-risk outputs
