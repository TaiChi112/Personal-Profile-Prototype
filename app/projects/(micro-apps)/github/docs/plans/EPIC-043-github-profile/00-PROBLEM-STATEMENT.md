# Epic: GitHub Profile Visualizer (Micro-App)

## The Problem
Recruiters and developers often find the default GitHub profile page dense and difficult to parse quickly. Furthermore, developers building integrations often need a rapid, visual way to test GitHub REST API endpoints and see exactly what data payload is returned for a given user, without dropping into Postman or terminal `curl` commands.

## Desired Outcome
A "GitHub Profile Visualizer" micro-app that acts as both a beautiful portfolio viewer and an API testing hub. Users can search for any GitHub username to instantly generate a customizable, high-level dashboard (e.g., Bento Grid) of their repos and activity. It also includes an integrated cheat sheet of common GitHub API endpoints for developer reference.

## Core Capabilities
- **API Integration State Engine:** A client-side store that manages the user's search query, securely persists an optional Personal Access Token (PAT) for rate-limit bypassing, and caches the raw JSON responses from external API calls.
- **Multi-Layout Data Visualization:** A presentation layer that maps the ingested API data (Profile, Repositories, Events) into distinct, user-selectable UI paradigms, such as a high-density "Bento" grid or a chronological "Timeline."
- **Endpoint Reference Dashboard:** A structured, static UI section that documents key REST API URLs (e.g., user search, repo deep-dives), providing developers with copy-pasteable snippets.

## Constraints & Environment
- The application MUST perform all data fetching directly from the client-side browser to the GitHub REST API.
- Since unauthenticated GitHub API requests are heavily rate-limited, the app must gracefully handle HTTP 403 errors and prompt the user to input a PAT. The PAT must be stored locally (`localStorage`) and never transmitted to any server other than GitHub.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight persistent state management for the PAT, native `fetch` API handling with error boundaries, modular UI layouts) and file structure before writing any code.
