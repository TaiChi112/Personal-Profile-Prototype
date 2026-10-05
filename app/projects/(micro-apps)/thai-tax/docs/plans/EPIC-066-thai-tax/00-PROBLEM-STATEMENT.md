# Epic: Thai Tax Planner (Micro-App)

## The Problem
Calculating personal income tax in Thailand is complex due to progressive tax brackets and various deduction caps (e.g., standard deductions capped at 100k, life insurance allowances). Professionals struggle to estimate their end-of-year tax liability, making it difficult to decide how much to invest in tax-saving funds (SSF/RMF) before the year ends.

## Desired Outcome
A "Thai Tax Planner" micro-app that demystifies the tax calculation process. Users input their monthly salary, bonuses, and planned deductions. The app instantly applies Thai standard deduction rules and progressive tax brackets, presenting a clear summary of their Net Taxable Income and their final estimated tax bill in real-time.

## Core Capabilities
- **Financial State Engine:** A client-side data store holding the user's raw financial inputs (Salary, Bonus, Insurance, SSF/RMF) and a unified mutation function to update them.
- **Progressive Bracket Derivation Logic:** A mathematical layer that calculates gross income, securely bounds standard deductions (using `Math.min/max`), calculates the net taxable income, and processes it through a tiered `if/else` algorithm representing the national progressive tax brackets.
- **Split-Pane Financial UI:** A presentation layout separating the input form from the output summary. The summary pane utilizes high-contrast styling and localized number formatting to clearly display the breakdown of deductions and the final tax liability.

## Constraints & Environment
- The application MUST operate entirely on the client-side to ensure zero-latency recalculations as the user experiments with different deduction amounts.
- The mathematical derivation MUST enforce statutory caps (e.g., standard deduction = 50% of income, max 100,000) to ensure the estimate remains reasonably accurate.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, secure tiered math logic) and file structure before writing any code.
