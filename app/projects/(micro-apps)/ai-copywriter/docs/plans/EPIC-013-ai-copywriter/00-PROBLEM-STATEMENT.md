# Epic: AI Ad Hook & Copywriter (Micro-App)

## The Problem
Marketers and e-commerce business owners struggle to write high-converting ad copy and often lack the budget to hire professional copywriters. Generic AI chatbots produce robotic, unpersuasive text that fails to utilize proven psychological marketing frameworks, resulting in poor ad performance and wasted ad spend.

## Desired Outcome
An "AI Ad Hook & Copywriter" micro-app that acts as an expert digital marketer. Users simply paste a product URL, and the system automatically scrapes the context, analyzes it, and generates platform-specific, high-converting ad copy based on proven marketing frameworks, monetized via a scalable credit-based billing system.

## Core Capabilities
- **Automated Context Extraction:** A backend URL web scraper designed to autonomously extract product details and value propositions from target websites.
- **Psychological AI Engine:** An LLM engine strictly prompted with marketing psychology frameworks (e.g., AIDA, PAS) that outputs structured JSON.
- **Platform-Specific UI:** A clean, tab-based dashboard that categorizes generated scripts (Facebook, TikTok, Email) with one-click copy functionality.
- **Credit-Based Monetization:** A robust billing architecture featuring user authentication, a credit wallet system, and payment gateway integration for top-ups.

## Constraints & Environment
- The AI must be heavily constrained via system prompts to avoid robotic marketing jargon (e.g., "revolutionary", "unleash") to ensure human-like authenticity.
- The scraper must gracefully handle sites that block bots (by falling back or throwing clear errors) and must not attempt authenticated/login-based scraping.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., robust web scraping techniques, structured LLM generation, credit-based database schemas, payment gateways) and file structure before writing any code.
