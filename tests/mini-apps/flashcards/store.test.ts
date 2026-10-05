import { describe, it, expect, beforeEach } from "bun:test";
import { useCardStore } from "@/app/projects/(micro-apps)/flashcards/store/useCardStore";

describe("useCardStore Zustand Store", () => {
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

  it("should initialize with default cards, currentIndex 0 and score 0", () => {
    const state = useCardStore.getState() as any;
    expect(state.cards.length).toBe(3);
    expect(state.currentIndex).toBe(0);
    expect(state.score).toBe(0);
  });

  it("should increment both score and currentIndex when answer is correct", () => {
    const store = useCardStore.getState() as any;
    store.nextCard(true);

    const state = useCardStore.getState() as any;
    expect(state.score).toBe(1);
    expect(state.currentIndex).toBe(1);
  });

  it("should increment currentIndex but not score when answer is incorrect", () => {
    const store = useCardStore.getState() as any;
    store.nextCard(false);

    const state = useCardStore.getState() as any;
    expect(state.score).toBe(0);
    expect(state.currentIndex).toBe(1);
  });

  it("should correctly handle sequence of multiple answers", () => {
    const store = useCardStore.getState() as any;
    store.nextCard(true);
    store.nextCard(false);
    store.nextCard(true);

    const state = useCardStore.getState() as any;
    expect(state.score).toBe(2);
    expect(state.currentIndex).toBe(3);
  });
});
