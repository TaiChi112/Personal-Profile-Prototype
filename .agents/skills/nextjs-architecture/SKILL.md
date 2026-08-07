---
name: Next.js Architecture Guidelines
description: Enforces Next.js App Router best practices, specifically designed to prevent Single Page Application (SPA) anti-patterns, manage Server vs Client Components, and optimize data fetching.
---

# Next.js App Router Architecture Guidelines

When generating, modifying, or refactoring code in this Next.js 14+ project, you MUST adhere to the following architectural guidelines:

## 1. Avoid SPA Anti-Patterns
- **Do not** use client-side state (e.g., `useState`, `activeTab`) to manage top-level page routing. 
- Always use native Next.js file-based routing (`app/page.tsx`, `app/blogs/page.tsx`, etc.).
- Avoid wrapping the entire application in a massive `"use client"` boundary.

## 2. Default to Server Components (RSC)
- Components should be **Server Components by default**. Do not add `"use client"` unless absolutely necessary.
- **When to use `"use client"`:**
  - Need interactivity (onClick, onChange).
  - Need React hooks (useState, useEffect, useMemo, context).
  - Need browser APIs (window, document).

## 3. Component Hierarchy
- Push `"use client"` down the component tree as far as possible. 
- Leave layout, data fetching, and static UI at the Server Component level.
- If a Server Component needs interactive children, pass the interactive components as props or import them dynamically.

## 4. Data Fetching
- Fetch data on the server using async/await directly in Server Components whenever possible.
- Avoid using `useEffect` for data fetching on the client side unless it is highly dynamic user-specific data that cannot be SSR'd.

## 5. Performance Optimization
- For heavy client components that are not immediately visible, use `next/dynamic` to code-split the bundle.
- Ensure large libraries (e.g., icons, charting) are either dynamically imported or optimized via `optimizePackageImports` in `next.config.ts`.
