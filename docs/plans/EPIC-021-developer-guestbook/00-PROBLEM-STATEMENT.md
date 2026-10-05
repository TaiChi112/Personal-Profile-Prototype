# Epic: Developer Guestbook & Endorsements

## The Problem
A resume website inherently lacks verified social proof. Without third-party validation or a way for visitors to leave feedback, the profile lacks community trust and interactivity, relying solely on self-proclaimed skills.

## Desired Outcome
An interactive Guestbook and Skill Endorsement system that builds organic social proof. It should capture anonymous feedback to maximize engagement while driving authenticated user acquisition through verified features like skill endorsements.

## Core Capabilities
- **Anonymous Feedback:** An open Guestbook allowing visitors to leave simple messages without friction.
- **Secure Authentication:** Robust OAuth integration to verify identities for premium actions.
- **Verified Endorsements:** A Skill Endorsement mechanism (similar to LinkedIn) tied strictly to authenticated profiles.
- **Social Proof UI:** A live interface displaying guestbook messages, skill scores, and the avatars of verified endorsers.

## Constraints & Environment
- Must safely handle anonymous user input to prevent basic injection or spam attacks.
- Endorsement actions must strictly enforce authentication and one-vote-per-user-per-skill rules.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., Auth providers, database schema relationships, UI components) and file structure before writing any code.
