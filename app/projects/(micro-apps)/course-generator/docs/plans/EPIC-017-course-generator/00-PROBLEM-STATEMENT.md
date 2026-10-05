# Epic: AI YouTube Crash Course Generator (Micro-App)

## The Problem
Students and professionals lack the time to watch multi-hour educational YouTube videos or podcasts. However, reading the raw, auto-generated transcripts is tedious and counter-productive due to the lack of formatting, headings, or structured learning paths.

## Desired Outcome
An "AI YouTube Crash Course Generator" micro-app (EdTech) that transforms long, boring videos into highly interactive, bite-sized "crash courses." Users paste a YouTube link, and the system instantly structures the content into clear modules and interactive flashcards. It employs a freemium monetization model to generate viral traffic while capturing micro-transactions for premium (long-form) content.

## Core Capabilities
- **Transcript Extraction:** A backend service capable of reliably fetching video transcripts and metadata (specifically video duration) from YouTube URLs.
- **AI Curriculum Engine:** An LLM engine strictly prompted to digest long transcripts and output highly structured JSON representing learning modules and Q&A flashcards.
- **Interactive UI:** A learning dashboard featuring engaging, gamified components like 3D CSS flip-cards to enhance knowledge retention.
- **Duration-Based Paywall:** A conditional logic gate that processes short videos (< 15 mins) for free but intercepts longer videos, requiring a micro-transaction via a payment gateway before LLM processing begins.

## Constraints & Environment
- The system must check video duration BEFORE sending the transcript to the LLM to prevent catastrophic API token costs from users exploiting the free tier with 10-hour videos.
- The system must gracefully handle edge cases where a YouTube video lacks closed captions/transcripts by returning a user-friendly error message.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., YouTube transcript extraction tools, structured LLM generation, CSS 3D transformations, conditional payment gateways) and file structure before writing any code.
