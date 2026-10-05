import { describe, it, expect, beforeEach } from "bun:test";
import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CardGame from "@/app/projects/(micro-apps)/flashcards/components/CardGame";
import Page from "@/app/projects/(micro-apps)/flashcards/page";
import { useCardStore } from "@/app/projects/(micro-apps)/flashcards/store/useCardStore";

describe("CardGame Component & Page", () => {
  beforeEach(() => {
    useCardStore.setState({
      cards: [
        { q: "Next.js rendering method for static content?", a: "SSG (Static Site Generation)" },
        { q: "React hook for side-effects?", a: "useEffect" },
        { q: "CSS framework based on utility classes?", a: "Tailwind CSS" },
      ],
      currentIndex: 0,
      score: 0,
    });
  });

  it("should render initial card question and progress indicator", () => {
    render(<CardGame />);

    expect(screen.getByText(/Card 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByText("Next.js rendering method for static content?")).toBeInTheDocument();
    expect(screen.getByText("(Click to flip)")).toBeInTheDocument();
    expect(screen.queryByText(/Correct/i)).not.toBeInTheDocument();
  });

  it("should flip card when clicked and reveal answer and feedback buttons", () => {
    render(<CardGame />);

    const card = screen.getByText("Next.js rendering method for static content?").closest("div[class*='cursor-pointer']");
    expect(card).toBeDefined();

    fireEvent.click(card!);

    expect(screen.getByText("SSG (Static Site Generation)")).toBeInTheDocument();
    expect(screen.getByText(/Correct/i)).toBeInTheDocument();
    expect(screen.getByText(/Wrong/i)).toBeInTheDocument();
  });

  it("should advance to next card and increment score when clicking 'Correct'", async () => {
    render(<CardGame />);

    const card = screen.getByText("Next.js rendering method for static content?").closest("div[class*='cursor-pointer']");
    fireEvent.click(card!);

    const correctBtn = screen.getByText(/Correct/i);
    await act(async () => {
      fireEvent.click(correctBtn);
      await new Promise((r) => setTimeout(r, 400));
    });

    expect(screen.getByText(/Card 2 of 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Score: 1/i)).toBeInTheDocument();
    expect(screen.getByText("React hook for side-effects?")).toBeInTheDocument();
  });

  it("should advance to next card without incrementing score when clicking 'Wrong'", async () => {
    render(<CardGame />);

    const card = screen.getByText("Next.js rendering method for static content?").closest("div[class*='cursor-pointer']");
    fireEvent.click(card!);

    const wrongBtn = screen.getByText(/Wrong/i);
    await act(async () => {
      fireEvent.click(wrongBtn);
      await new Promise((r) => setTimeout(r, 400));
    });

    expect(screen.getByText(/Card 2 of 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Score: 0/i)).toBeInTheDocument();
    expect(screen.getByText("React hook for side-effects?")).toBeInTheDocument();
  });

  it("should display Finished screen when all cards are completed", () => {
    useCardStore.setState({
      currentIndex: 3,
      score: 2,
    });

    render(<CardGame />);

    expect(screen.getByText("Finished!")).toBeInTheDocument();
    expect(screen.getByText(/Score: 2 \/ 3/i)).toBeInTheDocument();
  });

  it("should render Page component with back link and title", () => {
    render(<Page />);

    expect(screen.getByText("Dev Flashcards")).toBeInTheDocument();
    expect(screen.getByText("← Back")).toBeInTheDocument();
  });
});
