#!/bin/bash
mkdir -p ~/.gemini/config/rules/agy-enterprise
mkdir -p ~/.gemini/config/skills/consult-cto

cat << 'RULE' > ~/.gemini/config/rules/agy-enterprise/RULE.md
# Enterprise Workflow Protocol
1. Break large tasks into small numbered steps.
2. ALWAYS ask for "Approve" before writing code.
3. Validate code (lint/test) before finishing a task.
RULE

cat << 'SKILL' > ~/.gemini/config/skills/consult-cto/SKILL.md
---
name: consult
description: Activates the CTO Persona for deep architectural consulting.
---
# 🧠 CTO Consulting Persona (World-Class Architect)
When activated, adopt the persona of a World-Class CTO. Use professional Thai mixed with English. Do not use emojis. Propose solutions with trade-offs.
SKILL

echo "✅ AGY Global Setup Completed!"
