# Epic: Sorting Visualizer (Micro-App)

## The Problem
Learning sorting algorithms (like Bubble Sort, Merge Sort) by reading raw code or text output is notoriously difficult. Computer science students need to actually *see* the numbers swapping in real-time to internalize the logic, but building a custom visualizer from scratch is time-consuming.

## Desired Outcome
A "Sorting Visualizer" micro-app designed for educational purposes. Users can generate a random array of numbers represented as a bar chart. With a single click, they can watch an algorithm (like Bubble Sort) step through the array, visually animating the swaps in real-time, making abstract algorithmic concepts immediately understandable.

## Core Capabilities
- **Generative Data State:** A client-side store that manages a randomized array of integers and provides a mutation function to instantly generate a new randomized data set on demand.
- **Asynchronous Algorithmic Engine:** A local function that executes the sorting algorithm (e.g., Bubble Sort) while utilizing asynchronous Promises (`setTimeout`) to intentionally pause execution at every swap, forcing the UI to render intermediate states.
- **Dynamic Bar Chart UI:** A presentation layer that maps the integer array into a flexbox container, binding each integer directly to the inline CSS `height` of a bar element, creating a native DOM-based bar chart.

## Constraints & Environment
- The application MUST operate entirely on the client-side to render the high-frequency animation frames during the sorting loop.
- The sorting algorithm must NOT block the main thread. It must use asynchronous delays to allow React to paint the UI between algorithmic swaps.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, Promise-based async loops for React rendering) and file structure before writing any code.
