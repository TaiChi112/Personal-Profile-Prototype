---
name: Standard UX/UI Guidelines
description: Enforces clean, minimalist, and standard UI/UX design principles. Prohibits over-the-top AI-generated aesthetics like excessive icons or flashy themes.
---

# Standard UX/UI Guidelines

When implementing or modifying User Interfaces in this project, you MUST strictly adhere to the following design principles:

## 1. Clean and Minimalist
- Do **not** generate "AI-style" UIs that are overly flashy, extremely colorful, or excessively animated.
- Keep layouts clean, breathable (good use of whitespace), and professional.
- Use the existing Tailwind CSS configuration and predefined theme styles (`ThemeConfig.ts`).

## 2. Standardized Components
- Use standard web application patterns. Do not invent obscure UI elements.
- Ensure all components are accessible (a11y) with proper semantic HTML tags (`<nav>`, `<main>`, `<section>`, `<button>`).
- If a component already exists in `components/system/` or `components/layout/`, reuse it rather than building a new one from scratch.

## 3. Avoid Excessive Iconography
- Do not add icons (`lucide-react`) to every single button or list item unless it adds clear semantic value.
- Prefer text labels over ambiguous icons.

## 4. Consistent Theming
- Respect the active Theme State (Dark mode, Fonts, and Colors). Do not hardcode arbitrary hex colors; use Tailwind utility classes (e.g., `text-primary`, `bg-background`).
