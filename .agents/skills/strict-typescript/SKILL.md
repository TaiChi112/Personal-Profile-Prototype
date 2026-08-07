---
name: Strict TypeScript Guidelines
description: Enforces strict typing rules for the project, strictly prohibiting the use of 'any' or 'unknown' types and enforcing standard TypeScript interfaces.
---

# Strict TypeScript Guidelines

This project strictly adheres to strongly typed TypeScript. You MUST follow these rules when writing or modifying TypeScript code:

## 1. No `any` or `unknown`
- You are **strictly prohibited** from using the `any` or `unknown` types.
- If you encounter a situation where you don't know the exact type, you must define an interface or type alias that accurately describes the expected shape of the data.
- Do not bypass TypeScript compiler checks using `@ts-ignore` unless absolutely necessary and approved by the user.

## 2. Strong Interfaces and Types
- Always define explicit `interface` or `type` declarations for component props, API responses, and state objects.
- Use generics appropriately to maintain type safety across reusable components.

## 3. Strict Null Checks
- Handle `null` and `undefined` explicitly. Do not use the non-null assertion operator (`!`) blindly. 
- Use optional chaining (`?.`) and nullish coalescing (`??`) to handle potential null values safely.
