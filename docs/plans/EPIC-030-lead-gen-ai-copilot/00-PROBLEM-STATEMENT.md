# Epic: Lead-Gen Technical Co-Pilot

## The Problem
A standard portfolio relies on passive lead generation. Visitors read content but often leave without engaging because there is no active mechanism to consult them, connect their specific problems to the developer's expertise, and guide them toward a purchase.

## Desired Outcome
An intelligent, sales-driven AI Co-Pilot that engages visitors interactively. It acts as an automated technical consultant, answering questions using the developer's specific case studies and actively guiding users toward purchasing the Productized Service tiers.

## Core Capabilities
- **Knowledge Base (RAG):** A Retrieval-Augmented Generation system fueled by the site's case studies and service offerings.
- **Automated Ingestion Pipeline:** A script to automatically chunk, embed, and store site content into a Vector Database.
- **Consultative Sales AI:** A conversational API specifically prompted to provide technical help while naturally suggesting relevant service packages.
- **Interactive UI:** An engaging chat widget supporting rich markdown rendering for seamless call-to-action buttons.

## Constraints & Environment
- The AI's knowledge must be strictly bounded to the provided context to prevent hallucinating non-existent services or prices.
- The AI must prioritize being genuinely helpful (consultative selling) over aggressive sales tactics to maintain professional credibility.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., Vector databases, embedding models, RAG frameworks, UI widgets) and file structure before writing any code.
