# RAG (Retrieval-Augmented Generation)

## Description

Retrieval-Augmented Generation (RAG) extends a Large Language Model (LLM) with a dynamic retrieval step. Instead of relying solely on the model's frozen training knowledge, a RAG system first searches an authoritative external knowledge source for context relevant to the user's query, then injects that retrieved context into the LLM's prompt. This grounds the model's response in factual, up-to-date, proprietary information — dramatically reducing hallucinations and enabling the model to answer questions about data it was never trained on.

There are three main retrieval strategies, each suited to different query types:

---

### Vector RAG

Unstructured text documents are chunked and converted to dense embedding vectors, stored in a vector database. Retrieval executes a similarity search (cosine or dot product) to find the most semantically relevant chunks for a given query.

**When to use:** Fast semantic similarity search over large unstructured text corpora — documents, wikis, PDFs, knowledge bases. Best for "what does our policy say about X?" style queries.

**Implied pillars:** `ai_ml` (embedding model, vector DB — Pinecone, Weaviate, pgvector, Qdrant), `storage` (document store), `compute` (embedding generation, LLM inference)

**Limitations:** Struggles with multi-hop reasoning and explicit relationship traversal. Cannot answer "which document references both X and Y" efficiently.

---

### Graph RAG

Information is stored as a knowledge graph — entities as nodes, relationships as typed edges. Retrieval traverses the graph to find entity relationships relevant to the query, providing precise, explainable context grounded in explicit connections.

**When to use:** Multi-hop, relational queries that require reasoning over explicit entity relationships — org charts, regulatory dependency graphs, supply chain relationships, medical knowledge graphs.

**Implied pillars:** `ai_ml` (LLM, graph traversal logic), `database` (graph database — Neo4j, Amazon Neptune, Spanner Graph, TigerGraph)

**Limitations:** Building and maintaining a high-quality knowledge graph requires significant ongoing data engineering. Slower retrieval than vector search for broad semantic queries.

---

### Hybrid RAG

Combines vector similarity search with graph-based context enrichment. A fast vector search retrieves broadly relevant chunks, then a graph traversal enriches those chunks with explicit relational context, combining the breadth of semantic search with the precision of structured relationship retrieval.

**When to use:** Enterprise knowledge systems where both broad contextual search and precise relational reasoning are required — the most comprehensive but also most complex RAG variant.

**Implied pillars:** `ai_ml` (embedding model, LLM, graph traversal), `database` (vector DB + graph DB), `storage`, `compute`

---

## General RAG Architecture

```
User query
    → Embedding model → Query vector
    → Vector DB similarity search (+ optional graph traversal)
    → Retrieved context chunks
    → Injected into LLM prompt
    → LLM generates grounded response
```

## Key Trade-offs

| Concern | Implication |
|---|---|
| **Hallucination reduction** | Grounding in retrieved facts significantly reduces confabulation |
| **Knowledge freshness** | Retrieved context reflects current knowledge base — no retraining required |
| **Context window limits** | Retrieved chunks compete for LLM context window space — chunking strategy and top-k selection are critical |
| **Retrieval quality** | Answer quality is bounded by retrieval quality — poor chunking or embedding strategy produces poor context |
| **Latency** | Adds retrieval latency on top of LLM inference — typically 100–500ms additional |

## Common Pitfalls

- Chunking documents too large or too small — overly large chunks include irrelevant content; too-small chunks lose context
- Not evaluating retrieval quality independently from generation quality — a bad retriever hides behind a good generator
- Ignoring metadata filtering — semantic similarity alone is insufficient when documents span multiple domains, languages, or access permission levels
- Not implementing a re-ranking step for precision-sensitive use cases — top-k by cosine similarity is not always top-k by relevance for the actual question
