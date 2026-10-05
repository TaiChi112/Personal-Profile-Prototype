# AI-Integrated Socratic Content Framework

## Core Philosophy
This framework is used to generate Computer Science educational content in Fumadocs MDX format. The goal is NEVER to spoon-feed answers or deep technical code immediately. Instead, we aim to:
1. Spark curiosity through real-world/relatable problems (Problem-Based / Project-Based).
2. Explain complex theories using simple, visual analogies.
3. Encourage self-directed learning by providing highly optimized Generative AI Prompts.

## Formatting and Visual Guidelines
1. **Zero Emoji Policy:** Emojis are STRICTLY PROHIBITED in all markdown, mdx, and prompt content. 
2. **Iconography:** Use `lucide-react` components for visual elements in MDX files instead of emojis. Import them at the top of the MDX file.
   - Example: `<Icon name="Terminal" />` or direct import `<Terminal className="w-5 h-5 text-gray-400" />` (depending on the project's MDX configuration).
3. **Emphasis:** Use Markdown formatting (bold, italics, blockquotes, tables) to structure the content clearly.

## Prompt Design Principles (For Copy-Paste Prompts)
When creating prompts for readers to copy-paste to AI, adhere strictly to these rules:
1. **Persona Assignment:** Always assign a role (e.g., "Act as a strict but helpful Senior Backend Engineer").
2. **Anti-Spoon-feeding Constraint:** Explicitly instruct the AI NOT to give the final answer or write code yet. (e.g., "Do not give me the direct solution or code.")
3. **Socratic Engagement:** Instruct the AI to ask leading questions. (e.g., "Ask me one question at a time to help me figure out the solution myself.")
4. **Analogy Continuation:** Make the AI use the same metaphor introduced in the article. (e.g., "Use the traffic jam analogy to explain this.")

## The 3-Act Structure

### Act 1: The Hook (The Problem Scenario)
- **Objective:** Introduce a catastrophic or highly challenging scenario that is easily imaginable.
- **Content:** A story-driven problem statement. No technical jargon yet.
- **Embedded Prompt:** A prompt to help the reader explore the symptoms of the problem.

### Act 2: The Mental Model (Analogies & Socratic Questions)
- **Objective:** Bridge the gap between the scenario and the CS theory using an analogy.
- **Content:** Ask Socratic questions to make the reader think about how they would manually solve the analogy.
- **Embedded Prompt:** A prompt to simulate the concept interactively as a text game.

### Act 3: The Rabbit Hole (Research & Keyword Linking)
- **Objective:** Reveal the actual Computer Science terms for the concepts discussed and encourage deep research.
- **Content:** List of Keywords, related concepts, and the "If you know this, you can solve X" statement.
- **Embedded Prompt:** A prompt for a guided deep-dive into the technical theory.
