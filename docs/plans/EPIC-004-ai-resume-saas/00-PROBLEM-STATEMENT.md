# Epic: AI Resume as a Service (B2B/B2C SaaS)

## The Problem
The current personal profile is single-user, limiting the potential to monetize the AI chatbot feature by offering it to other professionals.

## Desired Outcome
A scalable, multi-tenant B2B/B2C SaaS platform that allows any professional to create their own AI-powered resume profile, complete with subscription tiers and analytics.

## Core Capabilities
- **Multi-Tenant Auth:** Secure login and data isolation for multiple users.
- **Dynamic Routing:** Path-based profile URLs (e.g., `/u/[username]`).
- **Feature Flagging:** Differentiate capabilities for Free vs Premium tiers.
- **Profile Analytics:** Track and display viewer analytics for Premium users.

## Constraints & Environment
- Strict data isolation between users is mandatory.
- Must seamlessly integrate with existing payment or subscription systems.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal SaaS architecture (e.g., DB schema updates, auth providers) and routing strategy before writing any code.
