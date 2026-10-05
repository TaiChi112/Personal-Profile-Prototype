# Epic: Omnichannel LINE Bot

## The Problem
Relying solely on website visitors limits the reach and proactiveness of the AI resume service. Candidates miss out on capturing leads directly from popular messaging platforms used by recruiters.

## Desired Outcome
A multi-tenant LINE bot that serves as a frontline screening and lead generation assistant, collecting HR contact info naturally via chat.

## Core Capabilities
- **Webhook Integration:** Seamless connection with LINE Messaging API.
- **Message Queueing:** Reliable message processing during high traffic.
- **Tenant Resolution:** Identify the correct resume profile from the chat context.
- **Conversational Lead Capture:** Persuade and collect HR contact info.

## Constraints & Environment
- Must not timeout during high traffic spikes.
- Strict isolation of lead data per tenant in the database.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal webhook queueing system (e.g., BullMQ) and tenant resolution logic before writing any code.
