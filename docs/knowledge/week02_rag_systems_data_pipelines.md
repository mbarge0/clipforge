Week 2 – RAG SYSTEMS & DATA PIPELINES
Gauntlet AI Knowledge Hub

## Curriculum Overview

**Focus for Week 2:**
Learn about **Retrieval-Augmented Generation (RAG)**, **GraphRAG**, and **Vector Databases (Vector DBs)**.
Understand **metrics** for building reliable **data orchestration pipelines**.
Add RAG functionality to the cloned enterprise application.
The project this week is a **mobile application (React Native)**, integrating RAG, not a website.

**Key Focus Areas:**
**RAG Architecture** (Mastering RAG, GraphRAG, and Vector DB implementation)
**Data Pipeline Engineering** (Building and optimizing reliable data orchestration pipelines)
**Enterprise Integration** (Integrating RAG systems into enterprise applications)

***

## 1. The Big Picture

Week 2 transitions from basic AI feature integration (Week 1) to building **production-grade, knowledge-aware AI systems**. The goal is to move from simple prompt-injection (where the LLM only knows what's in the prompt) to **Retrieval-Augmented Generation (RAG)**, where the LLM can leverage **external, specific enterprise knowledge**.

You're solving the *hallucination* and *data freshness* problems by giving the AI system access to an accurate, up-to-date **knowledge base**. This requires mastering the architecture: the **Vector DB** for storage, the **Data Pipeline** for maintenance, and the **RAG logic** for retrieval and generation.

***

## 2. Core Risk & Mitigation

The Biggest Mistake: Ineffective Chunking
The Problem
Fixed-size chunking splits documents purely by character or token count, ignoring the logical structure of the text (e.g., paragraphs, sections, tables). This results in two critical failure modes:

Context Fragmentation: A single, coherent idea or answer (like a definition or a conclusion) is split across two or more separate chunks. When the retriever pulls only one of those pieces, the context provided to the LLM is incomplete, leading to an incomplete or incorrect answer.

Noise Introduction: If chunks are too large, they can include an excessive amount of irrelevant information alongside the relevant snippet. This "noise" overwhelms the LLM, making it difficult to extract the correct answer, a phenomenon known as "Not Extracted" or the Lost-in-the-Middle problem.

Outcome: The LLM either hallucinates (due to missing context) or fails to extract the correct answer (due to noisy context).

3. The Strategic Solution: Advanced Chunking
To maximize the accuracy and relevance of the RAG system, the solution lies in smarter text splitting:

Recursive Character Text Splitting
Mechanism: This method uses a list of separators (\n\n, \n, .,  ) and recursively attempts to split the text until the chunks meet the desired size while prioritizing logical structural breaks.

Benefit: It ensures that, where possible, sentences, paragraphs, and sections remain intact. This creates more coherent chunks that are richer in semantic meaning, drastically improving the chances that the retriever surfaces the exact, complete context required for a correct answer.

***

## 3. RAG Architecture Deep Dive

**Retrieval-Augmented Generation (RAG)**
**What it is:** A framework that retrieves relevant documents from an external knowledge source before generating a response with an LLM. It's $R(etrieval) + G(eneration)$.
**How it works:**
1.  **Query:** User asks a question (e.g., "What's the vacation policy?").
2.  **Retrieval:** The system searches the **Vector DB** for documents *semantically similar* to the query.
3.  **Augmentation:** The retrieved documents are bundled with the original query and sent to the LLM as part of the prompt (the "context").
4.  **Generation:** The LLM generates an answer based on the provided context, eliminating hallucinations.

**Vector Databases (Vector DBs)**
**What they are:** Databases designed to efficiently store and query **vector embeddings** (numerical representations of data like text, images, or audio).
**Why they matter:** Standard databases can't perform **semantic search**. Vector DBs use **Approximate Nearest Neighbor (ANN)** algorithms to quickly find vectors (documents) whose meaning is closest to the query vector.
**Key Features:** Highly scalable indexing, fast query times, and support for vector operations.

**GraphRAG**
**What it is:** An advanced RAG technique that uses a **Knowledge Graph** in addition to, or instead of, a standard Vector DB.
**How it works:** Data is structured as **nodes** (entities) and **edges** (relationships). The retrieval step can then traverse the graph to find *related facts* beyond simple semantic similarity, providing richer context to the LLM.
**Example:** Querying a customer dataset: "What projects is Sarah working on, and who manages those projects?" This requires following relationships, which is a graph's strength.

***

## 4. Data Pipeline Engineering

This week, you're building the engine that powers the RAG system: the **Data Pipeline**.

**Goal:** Transform raw, unstructured enterprise data (PDFs, internal wikis, spreadsheets) into clean, queryable vectors in the Vector DB.

**Core Pipeline Steps (ETL for RAG):**
| Step | Description | Key Tools/Concepts |
| :--- | :--- | :--- |
| **E (Extract)** | Loading data from source systems (e.g., SharePoint, Notion, file storage). | Connectors, APIs, Web Scrapers |
| **T (Transform)** | **Chunking** documents into smaller, meaningful pieces; cleaning and normalizing text; adding **metadata** (e.g., source, date). | Text Splitters (LangChain), Data Validation |
| **L (Load)** | Converting the transformed text chunks into **vector embeddings** using an embedding model and loading them into the **Vector DB**. | OpenAI Embeddings, Cohere, Vector DB Clients |

**Reliability Metrics (The '4 C's of Data Pipelines'):**
1.  **Correctness:** Is the data accurately represented? **Metric:** Data validation success rate ($>99.9\%$).
2.  **Consistency:** Is the data in the DB consistent with the source? **Metric:** Difference in document count between source and DB.
3.  **Completeness:** Are all intended data sources processed? **Metric:** Coverage ratio.
4.  **Currency/Freshness:** How old is the data? **Metric:** Average and maximum time since the last update (latency).

***

## 5. Enterprise Integration (React Native Project)

The Week 2 project is integrating the RAG system into a **React Native mobile application clone**. This introduces mobile-specific constraints.

**Design Considerations for Mobile RAG:**
* **Latency:** Mobile users expect fast responses. The RAG query must be highly optimized.
    * **Mitigation:** Cache embeddings locally, prioritize low-latency Vector DB services, and use a fast LLM for the final generation step.
* **API Design:** The mobile app should communicate with a **Backend API (e.g., Node.js/Express)**, which orchestrates the RAG flow. The app should *not* directly connect to the Vector DB or the LLM.
    * **Architecture:** `React Native App` $\to$ `API Gateway/Backend` $\to$ `RAG Service (Retrieval + LLM)` $\to$ `Vector DB`.
* **User Experience (UX):** Displaying the source documents is critical for **trust** and **auditability**. The response must include **citations** (e.g., "Answer based on 'HR Policy 2.1'").
* **Offline Access:** For simple lookups, consider pre-loading a small, critical subset of embeddings onto the device itself, if feasible.

**React Native Implementation Focus:**
1.  Create the mobile UI for an **AI Chat/Search interface**.
2.  Build the **API endpoints** on the backend to accept user queries and manage the RAG workflow.
3.  Design a **clean, asynchronous flow** to handle the multiple network calls (Vector DB lookup, LLM call) without freezing the mobile UI.

***

## 6. Recommended Resources

| Resource Title | Purpose | Link/Concept |
| :--- | :--- | :--- |
| **LangChain/LlamaIndex Documentation** | Practical, high-level frameworks for building RAG applications. Essential for orchestration. | LangChain Documentation |
| **Vector Database Selection Guides** | Learn the trade-offs between popular Vector DBs (Pinecone, Chroma, Milvus, Qdrant). |  Vector DB Comparison Charts |
| **"Attention Is All You Need"** | The foundational paper for the Transformer architecture, which powers the LLMs and embedding models you're using. | Original Transformer Paper |
| **React Native Networking Deep Dive** | Essential for handling asynchronous API calls and managing state in the mobile app. | React Native Fetch/Axios Guides |

***

## 7. Action Prompts

**Prompt 1 (RAG Architecture):** "Design a Python class for a RAG system that uses a Vector DB client, accepts a user query, retrieves the top 3 chunks, and returns a formatted prompt for a GPT-4 model."

**Prompt 2 (Data Pipeline):** "Write a Python script using a library like LlamaIndex to load a directory of markdown files, chunk them by a size of 512, and store them in a local Vector DB (like Chroma)."

**Prompt 3 (Mobile Integration):** "Generate a React Native functional component for a chat interface that sends a user query to a `/api/rag` endpoint and displays the streaming response along with citation links."

**Prompt 4 (GraphRAG):** "Explain a real-world enterprise use case where **GraphRAG** would provide a *significantly* better answer than standard Vector DB RAG for a new employee."