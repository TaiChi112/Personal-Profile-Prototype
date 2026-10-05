# Epic: Body Metrics Calculator (Micro-App)

## The Problem
Individuals beginning their fitness or diet journeys often struggle to find a straightforward, ad-free tool to calculate their baseline body metrics. Many existing online calculators are cluttered, slow, or require users to surrender email addresses just to see their Basal Metabolic Rate (BMR) and Body Mass Index (BMI).

## Desired Outcome
A frictionless, beautifully designed "Body Metrics" micro-app that allows users to instantly calculate their BMI and BMR by simply adjusting their biometric inputs. It provides immediate visual feedback and health categorization without requiring any sign-up or data persistence.

## Core Capabilities
- **Biometric State Engine:** A centralized, client-side state module that securely and ephemerally tracks user inputs (age, gender, weight, height) without lag.
- **Algorithmic Health Engine:** A reactive computation layer that applies standard medical formulas (e.g., Mifflin-St Jeor equation) to derive accurate BMI and BMR values instantly.
- **Dynamic Visual Feedback:** A user interface that contextually responds to calculated metrics, automatically color-coding and labeling the user's BMI category (Underweight, Normal, Overweight, Obese) to provide immediate, intuitive understanding.

## Constraints & Environment
- The application MUST be entirely stateless and operate strictly on the client-side to ensure zero latency and a fluid user experience.
- Sensitive biometric data must NEVER be stored persistently in a database to completely bypass GDPR/health data compliance overhead. Session or ephemeral state only.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, client-side mathematical formula modules, dynamic UI component libraries) and file structure before writing any code.
