# Epic: NoteFlow Markdown Editor (Micro-App)

## The Problem
Standard text editors are either too basic (lacking formatting) or too heavy (WYSIWYG editors that break formatting on copy-paste). Developers and writers prefer Markdown for fast, structured writing, but setting up local markdown environments is tedious, and many cloud-based solutions are slow or lack immediate visual feedback.

## Desired Outcome
A "NoteFlow" micro-app that serves as a secure, cloud-backed Markdown editor. It features a side-by-side editing interface where users type raw Markdown on the left and see a live HTML preview on the right. All notes are saved to a centralized database linked to the user's authenticated profile.

## Core Capabilities
- **Persistent Document Storage:** A robust backend integration layer that uses the core authentication service to verify the user and performs secure CRUD (Create, Read, Update, Delete) operations on note entities in the database.
- **Interactive Text Synchronization:** A dual-pane client component that holds local text state. It allows rapid input in a raw text area and simultaneously runs a lightweight parser to render a live visual preview without relying on server round-trips.
- **Asynchronous Transaction UI:** A sidebar navigation and command header that leverages React transition states to gracefully handle explicit "Save" and "Delete" database mutations, providing clear feedback without blocking the user's workflow.

## Constraints & Environment
- The application MUST enforce user authentication. Unauthenticated users cannot view or manipulate notes and must be intercepted at the route level.
- The live preview MUST occur instantly on the client side. Database saving should be explicit (via a Save button) or asynchronous, rather than triggering a network request on every single keystroke.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., secure server actions for document CRUD, lightweight client-side markdown parsers, React transition hooks) and file structure before writing any code.
