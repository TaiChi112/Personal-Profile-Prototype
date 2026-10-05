# Epic: Bill Splitter & PromptPay QR (Micro-App)

## The Problem
When groups dine out or share expenses, the process of dividing the bill and collecting money is fraught with friction. Calculating exact fractional amounts is tedious, and manually typing bank account or phone numbers for peer-to-peer transfers frequently leads to human error or delayed payments.

## Desired Outcome
A frictionless, single-page "Bill Splitter" micro-app that instantly divides expenses equally and automatically generates a regional peer-to-peer payment QR code (e.g., Thai PromptPay). This allows the organizer to simply hold up their phone, enabling friends to scan and pay the exact fractional amount in seconds without exchanging contact details.

## Core Capabilities
- **Expense Division Engine:** A reactive calculator that takes the total bill amount and headcount to compute precise individual shares instantly.
- **Regional Payment Payload Generator:** A string generation module that accurately constructs standardized payment payloads (e.g., EMVCo standard for Thai PromptPay) based on the recipient's identifier and the calculated exact split amount.
- **Quick-Scan Visualizer:** A client-side renderer that transforms the payment payload into a scannable visual code (QR Code) for immediate peer-to-peer transactions.

## Constraints & Environment
- The application MUST be entirely stateless and operate strictly on the client-side. No server roundtrips or database persistence should be used, ensuring zero friction and maximum speed.
- The payment payload string formatting must strictly adhere to regional banking standards to guarantee compatibility with banking apps.
- No user authentication is required.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight state management, client-side QR code rendering libraries, EMVCo payload formatting logic) and file structure before writing any code.
