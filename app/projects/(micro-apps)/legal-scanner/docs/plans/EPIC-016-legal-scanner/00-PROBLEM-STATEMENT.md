# Epic: AI Legal Red-Flag Detector (Micro-App)

## The Problem
Non-technical freelancers and small business owners frequently sign contracts (NDAs, service agreements) without fully understanding the dense legal jargon. Hiring a lawyer is prohibitively expensive, leading to predatory clauses (e.g., IP forfeiture, hidden penalties) being accepted unknowingly.

## Desired Outcome
An "AI Legal Red-Flag Detector" micro-app that empowers non-lawyers by translating complex legal text into plain language. It scans uploaded PDFs for risky clauses, presents them in an intuitive split-screen UI alongside the original document, and monetizes via a pay-per-scan model.

## Core Capabilities
- **Ephemeral Document Parsing:** Secure PDF upload and text extraction mechanisms that do not rely on permanent server storage.
- **AI Translation Engine:** An LLM prompted specifically to translate jargon and identify risks, outputting structured JSON mapped to document pages.
- **Contextual UI:** A split-screen interface displaying the original PDF document side-by-side with the AI's translated red flags.
- **Pay-Per-Scan Monetization:** A gated billing integration that blurs full reports until a one-time payment is confirmed.

## Constraints & Environment
- The application must prominently display liability disclaimers stating it does not provide binding legal advice.
- The system must NEVER draft new legal documents or suggest specific legal remedies to avoid unauthorized practice of law.
- Uploaded PDFs must be processed ephemerally (e.g., in memory or via auto-expiring temporary storage) to guarantee strict data privacy.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., ephemeral file parsing, LLM structured outputs, client-side PDF rendering, payment gateways) and file structure before writing any code.
