# Epic: Interactive Flashcards (Micro-App)

## The Problem
Students and professionals preparing for interviews or learning new concepts struggle with passive reading. Effective memorization requires "active recall," but building or configuring heavy spaced-repetition software (like Anki) is often overkill for someone who just wants to run through a quick deck of terms before a meeting.

## Desired Outcome
A frictionless, gamified "Flashcard" micro-app that allows users to instantly review a deck of questions and answers. It forces active recall by hiding the answer until interacted with, then allows users to self-grade their knowledge, providing a final score to gamify the learning process.

## Core Capabilities
- **Deck State Manager:** A centralized client-side store that holds the collection of flashcards (Question/Answer pairs), tracks the user's progress (current card index), and maintains a running score.
- **Interactive Flip UI:** A presentation component that simulates a physical flashcard. It displays the question and conceals the answer until the user explicitly interacts (e.g., clicks) to "flip" it.
- **Evaluation Engine:** A conditional logic flow that surfaces self-grading controls (Correct / Wrong) only *after* the card is flipped, updating the score and autonomously advancing to the next card or the final summary screen.

## Constraints & Environment
- The application MUST operate entirely on the client-side to ensure zero-latency transitions between cards and flips.
- The deck state is ephemeral; there is no backend database saving user progress or custom decks for this MVP iteration.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, CSS transitions/animations for flipping, conditional rendering logic) and file structure before writing any code.
