# Content & MDX Documentation Standard

This document defines the canonical global standards for all documentation content (`.md` and `.mdx` files) authored within this repository. 
AI agents and human contributors MUST adhere to these rules when creating, modifying, or refactoring documentation.

## 1. Content Structure (MDX/Markdown)

All documentation files must adhere to a strict structure to ensure cross-compatibility with our custom layout and exporting features.

### Frontmatter
Every file must contain standard YAML frontmatter with at least `title` and `description`.
```yaml
---
title: "Article Title"
description: "A concise, 1-2 sentence description of what the reader will learn."
---
```

### Content Hierarchy
- **NEVER** use `#` (H1) inside the markdown body. The `title` from the frontmatter is automatically injected as the H1 by `DocsPage`.
- Start your document sections with `##` (H2).
- Keep heading depths reasonable (`##` and `###` are preferred; avoid going deeper than `####`).

## 2. Warnings, Info, and Callouts

Do NOT build custom React components for standard admonitions (warnings, tips, notes). 
Instead, rely on the **Fumadocs `<Callout>`** component, which we style globally via CSS variables.

### Supported Callout Types
Use the standard types to ensure consistent semantic coloring:
- `info` (Default, blue)
- `warn` (Warning, yellow/orange)
- `error` (Danger, red)
- `tip` (Success/Idea, green)

### Example Usage
```mdx
import { Callout } from 'fumadocs-ui/components/callout';

<Callout type="warn" title="Breaking Change">
  This API will be deprecated in v2.0. Please migrate to the new endpoint.
</Callout>
```

## 3. Contribution and Export Features

Our documentation system is designed to be highly interactive and open. 

### Edit on GitHub
Every page automatically generates an "Edit on GitHub" link. Ensure that markdown files are placed correctly in the `content/docs` directory so the relative paths match the GitHub repository structure.

### Export Dropdown
We provide a `DocsActionsDropdown` on every page which allows users to:
- Copy the raw Markdown.
- Open the content in AI tools (ChatGPT/Claude).
- View Raw Markdown.
- Download as PDF (via Browser Print).

**Rule for Content Formatting**: Because users can copy the raw markdown or export it to AI, avoid heavily nesting complex React components inside MDX if they break standard Markdown readability. Use standard Markdown syntax (tables, lists, bold, italics) whenever possible, falling back to MDX only for interactive or highly specialized visualizations (e.g., `<Mermaid>`).

## 4. Tone and Style
- **Professional & Concise**: Avoid fluff. Get straight to the point.
- **Global Standard**: Write as if this is the documentation for a top-tier open-source library.
- **Language**: English is the primary language (`/en/docs`), with Thai (`/th/docs`) supported via explicit translation files. Do not mix languages within a single file unless explicitly quoting.
