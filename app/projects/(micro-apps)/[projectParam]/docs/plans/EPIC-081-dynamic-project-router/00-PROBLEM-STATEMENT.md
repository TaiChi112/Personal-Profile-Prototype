# Epic: Dynamic Project Router (Micro-App)

## The Problem
Not every project in a portfolio is a standalone React application; many are simple Markdown or CMS-driven case studies. However, the routing architecture needs a way to seamlessly catch URLs for these content-based projects without throwing 404 errors, and it needs to inject that CMS data into the global portfolio application state.

## Desired Outcome
A "Dynamic Project Router" micro-app (Server Component). It acts as a fallback dynamic route (`[projectParam]`) within the apps directory. When a user navigates to a project URL that lacks a dedicated custom page, this route intercepts the request, securely fetches the corresponding markdown/CMS data from the backend server, and passes it into the global portfolio application layout for rendering.

## Core Capabilities
- **Dynamic Route Interception:** A Next.js server-side capability that captures arbitrary URL parameters, parsing them securely to determine which specific content the user is attempting to access.
- **Server-Side Content Orchestration:** A backend fetching layer that queries the local CMS/Markdown repository (e.g., Keystatic) to retrieve comprehensive arrays of projects, blogs, and articles before sending any HTML to the client.
- **Global Layout Injection:** A component presentation hand-off mechanism that initializes the main `PersonalWebsiteApp` client component with the fetched server data and sets the active view state to match the intercepted URL parameter.

## Constraints & Environment
- The application MUST operate strictly as an asynchronous Server Component to ensure SEO indexing and zero client-side fetching latency for standard content.
- The route MUST elegantly handle array-based parameters (e.g., catch-all routes) by sanitizing them down to a single string identifier.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., Next.js Dynamic Routes, Server-Side Data Fetching) and file structure before writing any code.
