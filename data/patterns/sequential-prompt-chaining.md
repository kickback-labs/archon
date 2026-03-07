# Sequential / Prompt Chaining

## Description

The Sequential (Prompt Chaining) pattern structures an AI workflow as a linear pipeline of discrete LLM calls, where the output of each step is programmatically passed as the input to the next. Each step is a focused, bounded task — extracting structured data, classifying content, generating a draft, formatting output — rather than asking a single LLM call to do everything at once.

This pattern maximises predictability and interpretability: the exact transformation happening at each step is explicit, observable, and independently testable. It is the right choice when the business process is well-defined, sequential, and deviation from the prescribed steps is unacceptable.

## When to Use

- Multi-step business processes where the sequence of steps is fixed and deviation is not permitted
- Each step requires a different prompt, model, or context — optimised per step rather than a single monolithic prompt
- Debugging and auditability are priorities — each step's input and output can be inspected independently
- Output quality improves significantly when complex tasks are broken into focused sub-prompts rather than a single compound prompt
- Regulatory or compliance environments where every AI decision step must be logged and explainable

## Implied Pillars

| Pillar | Role in this pattern |
|---|---|
| `compute` | LLM inference at each step; steps may use different models (e.g., a cheap fast model for classification, an expensive capable model for generation) |
| `devops` | Step-level logging and latency tracking; pipeline orchestration framework (LangChain, LlamaIndex, custom); failure and retry handling per step |

## Example Pipeline

```
Step 1: Extract structured requirements from user's free-text input
    ↓
Step 2: Classify the request type (new feature / bug / query)
    ↓
Step 3: Generate a draft response tailored to the request type
    ↓
Step 4: Format the response according to company template
    ↓
Final output
```

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Predictability** | The pipeline always follows the same path — highly debuggable and auditable |
| **Flexibility** | Cannot adapt the pipeline structure based on intermediate results — dynamic branching requires a different pattern |
| **Latency** | Steps are sequential — total latency is the sum of all step latencies |
| **Error propagation** | A poor output at step N degrades all subsequent steps — error handling and validation between steps is critical |
| **Optimisability** | Each step can be independently optimised (model selection, prompt tuning, caching) |

## Common Pitfalls

- Making steps too large — a step that tries to do too much defeats the purpose of decomposition
- Not validating output structure between steps — an LLM that produces malformed output at step 2 breaks the entire pipeline downstream
- Not caching expensive intermediate steps — recomputing an expensive extraction step for every downstream retry is wasteful
- Using sequential chaining when the steps are actually independent — independent steps should run in parallel (Swarm pattern) to reduce latency
