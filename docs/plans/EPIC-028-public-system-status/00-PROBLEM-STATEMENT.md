# Epic: Public System Status & Uptime Page

## The Problem
Potential employers and clients want evidence of operational reliability and incident management maturity (SRE/DevOps skills). A portfolio without a transparent view into system stability fails to demonstrate these critical engineering competencies.

## Desired Outcome
An enterprise-grade Public System Status & Uptime page that displays real-time 90-day uptime graphs for all micro-apps, paired with a transparent, MDX-driven Incident Reporting system for post-mortems and live outage updates.

## Core Capabilities
- **Reliability Monitoring:** Integration with external uptime monitoring APIs to track system health continuously.
- **Secure Data Fetching:** A secure, server-side proxy endpoint to safely fetch and cache uptime data without exposing API keys.
- **Enterprise Status UI:** A visual dashboard featuring 90-day historical uptime bar charts and an aggregate system health indicator.
- **Incident Management CMS:** An MDX-driven system for publishing live outage updates and detailed post-mortems, including a global alert banner triggered by active incidents.

## Constraints & Environment
- Must safely proxy API requests to completely isolate and hide sensitive monitoring API keys.
- Must aggressively cache external API responses (e.g., using ISR or SWR) to respect third-party rate limits.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., uptime monitoring providers, UI charting libraries, MDX content structure) and file structure before writing any code.
