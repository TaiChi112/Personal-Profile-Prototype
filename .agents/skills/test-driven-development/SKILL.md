---
name: Test-Driven Development (TDD) Guidelines
description: Enforces Test-Driven Development practices, requiring tests to be written before implementation, specifically using Bun's native test runner.
---

# Test-Driven Development (TDD) Guidelines

This project embraces Test-Driven Development (TDD). When implementing new logic, utility functions, or API endpoints, you MUST follow these steps:

## 1. Red-Green-Refactor Cycle
1. **Red:** Write a failing test for the new feature or bug fix *before* writing the implementation.
2. **Green:** Write the minimum amount of code required to make the test pass.
3. **Refactor:** Clean up the code while ensuring the test continues to pass.

## 2. Testing Framework
- This project uses **Bun's native test runner** (`bun test`). 
- Do not introduce Jest, Vitest, or other testing libraries unless explicitly instructed.
- Place test files alongside the implementation files (e.g., `utils.ts` -> `utils.test.ts`) or in dedicated `__tests__` folders.

## 3. Test Coverage and Quality
- Tests must be deterministic. Avoid relying on external live services unless writing specific integration tests.
- Mock database calls when unit testing logic. Use Prisma's testing utilities or mock the Prisma client.
- Ensure edge cases and error states are tested, not just the "happy path".
