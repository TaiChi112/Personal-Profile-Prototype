# Design System & UI/UX Guidelines

**Project Name:** Personal Profile Prototype (taichi112.works)  
**Last Updated:** 2026-08-30  

---

## 1. Design Philosophy

The overarching philosophy for this project is **Minimalist, Clean, and Professional**. 

- **No "Over-the-Top" Aesthetics:** Strictly avoid overly complex "AI-generated" aesthetics (e.g., excessive glowing animations, oversaturated themes, or over-usage of neon icons).
- **Professional Web App Standards:** The interface should feel like a robust SaaS platform rather than a flashy static site.
- **Completeness & SSOT (Single Source of Truth):** Any modification to a component must reflect correctly across all states (e.g., editing a Desktop UI must be matched with its Mobile equivalent; Dark Mode changes must have Light Mode counterparts).

## 2. Core Foundations

### 2.1 Styling Framework
- **Tailwind CSS 4:** All styling must be done using standard Tailwind utility classes.
- Avoid writing custom CSS in global stylesheets unless absolutely necessary (e.g., for Fumadocs overrides or complex animations).

### 2.2 Color Palette & Theming
- **Dark & Light Mode:** The application fully supports theme switching. Every UI element MUST utilize dark mode variants (e.g., `bg-white dark:bg-gray-900`, `text-gray-900 dark:text-gray-100`).
- **Contrast Ratios:** Text colors must pass **WCAG 2.1 AA** contrast standards. Do not use extremely light grays (`text-gray-400` or `text-gray-500`) on white backgrounds, or excessively dark colors on dark backgrounds. Use `text-gray-600` or `700` for light mode muted text, and `dark:text-gray-300` for dark mode.

### 2.3 Typography
- **Font Family:** Utilizes standard sans-serif system fonts or specific Next.js Google Fonts configurations (e.g., Inter).
- **Readability:** Maintain high readability for technical documentation (Fumadocs) and portfolio content. 

## 3. Standard Components

### 3.1 Bento Box Layout
- The primary method for displaying portfolio summaries, projects, and skills on the Homepage.
- **Implementation:** Uses CSS Grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) with consistent gaps (`gap-4` or `gap-6`).
- **Cards:** Components inside the Bento grid should have soft rounded corners (`rounded-xl` or `rounded-2xl`), subtle borders (`border border-gray-200 dark:border-gray-800`), and minimal hover effects (`hover:shadow-md transition-shadow`).

### 3.2 Navigation
- **Top/Side Navigation:** Must be responsive, collapsing into a hamburger menu or bottom bar on mobile devices.
- **Active States:** Clear visual indicators for active tabs/routes.

## 4. Accessibility (a11y)

- All interactive elements (`<button>`, `<a>`) must have explicit `aria-labels` if they do not contain text (e.g., Icon-only buttons).
- Semantic HTML tags (`<nav>`, `<header>`, `<main>`, `<article>`) must be used appropriately.
- Ensure focus rings are visible for keyboard navigation users.

---

*Note for AI Agents: Any generation of new UI components must strictly adhere to this document. Do not invent new design languages.*
