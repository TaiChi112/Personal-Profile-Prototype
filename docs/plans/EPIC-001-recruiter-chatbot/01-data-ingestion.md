# Phase 1: Data Ingestion & Vector Database

**สถานะ:** Backlog
**ความเชื่อมโยง:** Milestone 1 (Problem Statement)

---
## 1. Milestone Goal
Establish the foundational data pipeline that empowers the AI chatbot to accurately answer questions based on the candidate's actual resume and project history. Without this localized knowledge base, the AI would be unable to provide personalized responses.

## 2. Acceptance Criteria
- [ ] Establish a designated directory (e.g., `data/resume/`) to store source profile documents.
- [ ] Create an ingestion script (e.g., `scripts/ingest-data.ts`) capable of bulk-scanning the directory.
- [ ] Text parsing must implement intelligent chunking, ensuring semantic sentences are not broken mid-context.
- [ ] The script must successfully generate vector embeddings via a chosen LLM API.
- [ ] Embeddings and metadata must be reliably stored in a PostgreSQL database using `pgvector`.
- [ ] The ingestion script must be strictly idempotent (subsequent runs must not create duplicate records).

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Expect to leverage an LLM SDK for embeddings and an ORM (like Drizzle) for database operations.
- **Constraints:** Ensure the chunking strategy accommodates token limits while preserving context.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
