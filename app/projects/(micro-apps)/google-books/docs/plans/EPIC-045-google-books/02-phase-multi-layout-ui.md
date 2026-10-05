# Phase 2: Multi-Layout Views & UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Different users want to consume data differently. Some want visual covers (Bookshelf), some want data density (Bento), and some want historical context (Timeline).
- **The Solution:** Build a modular UI where the parent component handles the search bar and layout toggles, passing the raw book data down to specialized child layout components that map the data into their respective visual styles.

## 2. Acceptance Criteria
- [ ] Create a master layout wrapper featuring a search input and a toggle control for `layoutMode` (Bookshelf, Bento, Timeline, Favorites).
- [ ] Build a `BookshelfLayout` component that renders books as standard vertical cards with large cover images.
- [ ] Build a `BentoLayout` component that renders books in a dense, masonry-style or grid layout focusing on metadata.
- [ ] Build a `TimelineLayout` component that sorts the books chronologically by `publishedDate` and renders them on a vertical timeline axis.
- [ ] Ensure all layouts gracefully handle missing API data (fallback images, "Unknown Author").
- [ ] Include a prominent "Favorite" toggle button (heart icon) on every book card across all layouts.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate UI patterns, image optimization components, and dynamic CSS layouts based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
