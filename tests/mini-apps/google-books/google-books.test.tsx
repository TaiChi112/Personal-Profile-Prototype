import { describe, it, expect, beforeEach, mock, afterEach } from "bun:test";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock next/image
mock.module("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Mock recharts
mock.module("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: any) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="xaxis" />,
  YAxis: () => <div data-testid="yaxis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Legend: () => <div data-testid="legend" />,
}));

import { useBooksStore } from "@/app/projects/(micro-apps)/google-books/store/useBooksStore";
import GoogleBooksExplorer from "@/app/projects/(micro-apps)/google-books/page";
import BentoLayout from "@/app/projects/(micro-apps)/google-books/layouts/BentoLayout";
import BookshelfLayout from "@/app/projects/(micro-apps)/google-books/layouts/BookshelfLayout";
import TimelineLayout from "@/app/projects/(micro-apps)/google-books/layouts/TimelineLayout";

const mockSampleBook = {
  id: "book-1",
  volumeInfo: {
    title: "Designing Data-Intensive Applications",
    authors: ["Martin Kleppmann"],
    publishedDate: "2017-03-16",
    pageCount: 616,
    previewLink: "https://books.google.com/sample",
    imageLinks: {
      thumbnail: "http://books.google.com/thumb.jpg",
    },
  },
};

const mockSampleBook2 = {
  id: "book-2",
  volumeInfo: {
    title: "Clean Code",
    authors: ["Robert C. Martin"],
    publishedDate: "2008-08-01",
    pageCount: 464,
  },
};

describe("Google Books Micro-App", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    // Reset store state
    useBooksStore.setState({
      searchQuery: "",
      layoutMode: "BOOKSHELF",
      booksData: [],
      favorites: [],
      isLoading: false,
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("useBooksStore Zustand Store", () => {
    it("has initial store state", () => {
      const state = useBooksStore.getState();
      expect(state.searchQuery).toBe("");
      expect(state.layoutMode).toBe("BOOKSHELF");
      expect(state.booksData).toEqual([]);
      expect(state.favorites).toEqual([]);
      expect(state.isLoading).toBe(false);
    });

    it("updates searchQuery with setSearchQuery", () => {
      useBooksStore.getState().setSearchQuery("TypeScript");
      expect(useBooksStore.getState().searchQuery).toBe("TypeScript");
    });

    it("updates layoutMode with setLayoutMode", () => {
      useBooksStore.getState().setLayoutMode("BENTO");
      expect(useBooksStore.getState().layoutMode).toBe("BENTO");
      useBooksStore.getState().setLayoutMode("TIMELINE");
      expect(useBooksStore.getState().layoutMode).toBe("TIMELINE");
    });

    it("updates booksData and isLoading", () => {
      useBooksStore.getState().setIsLoading(true);
      expect(useBooksStore.getState().isLoading).toBe(true);

      useBooksStore.getState().setBooksData([mockSampleBook]);
      expect(useBooksStore.getState().booksData.length).toBe(1);

      useBooksStore.getState().setIsLoading(false);
      expect(useBooksStore.getState().isLoading).toBe(false);
    });

    it("toggles favorite: adds if absent, removes if already present", () => {
      const store = useBooksStore.getState();

      // First toggle: adds book
      store.toggleFavorite(mockSampleBook);
      expect(useBooksStore.getState().favorites.length).toBe(1);
      expect(useBooksStore.getState().favorites[0].id).toBe("book-1");

      // Add second book
      store.toggleFavorite(mockSampleBook2);
      expect(useBooksStore.getState().favorites.length).toBe(2);

      // Second toggle on book-1: removes book-1
      store.toggleFavorite(mockSampleBook);
      expect(useBooksStore.getState().favorites.length).toBe(1);
      expect(useBooksStore.getState().favorites[0].id).toBe("book-2");
    });
  });

  describe("GoogleBooksExplorer Page Component", () => {
    it("fetches random subject on initial mount if booksData is empty", async () => {
      const mockFetch = mock().mockResolvedValue({
        json: async () => ({ items: [mockSampleBook] }),
      });
      globalThis.fetch = mockFetch as any;

      render(<GoogleBooksExplorer />);

      expect(screen.getByText("Google")).toBeInTheDocument();
      expect(screen.getByText("Books Explorer")).toBeInTheDocument();

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
        expect(screen.getByText("Designing Data-Intensive Applications")).toBeInTheDocument();
      });
    });

    it("handles book search submission and updates results", async () => {
      const mockFetch = mock().mockResolvedValue({
        json: async () => ({ items: [mockSampleBook2] }),
      });
      globalThis.fetch = mockFetch as any;

      useBooksStore.setState({ booksData: [mockSampleBook] });

      render(<GoogleBooksExplorer />);

      const searchInput = screen.getByPlaceholderText(/Search books by title, author, or ISBN/i);
      fireEvent.change(searchInput, { target: { value: "Clean Code" } });

      const searchButton = screen.getByRole("button", { name: "Search" });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/google-books/proxy?q=Clean%20Code");
        expect(screen.getByText("Clean Code")).toBeInTheDocument();
      });
    });

    it("resets layout from FAVORITES to BOOKSHELF when search is performed", async () => {
      const mockFetch = mock().mockResolvedValue({
        json: async () => ({ items: [mockSampleBook] }),
      });
      globalThis.fetch = mockFetch as any;

      useBooksStore.setState({
        booksData: [mockSampleBook],
        layoutMode: "FAVORITES",
        searchQuery: "Martin",
      });

      render(<GoogleBooksExplorer />);

      const searchButton = screen.getByRole("button", { name: "Search" });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(useBooksStore.getState().layoutMode).toBe("BOOKSHELF");
      });
    });

    it("switches between layout modes: Bento, Timeline, Bookshelf, and Favorites", async () => {
      useBooksStore.setState({
        booksData: [mockSampleBook],
        favorites: [mockSampleBook2],
      });

      render(<GoogleBooksExplorer />);

      // Switch to Bento
      const bentoBtn = screen.getByRole("button", { name: "Bento" });
      fireEvent.click(bentoBtn);
      expect(useBooksStore.getState().layoutMode).toBe("BENTO");

      // Switch to Timeline
      const timelineBtn = screen.getByRole("button", { name: "Timeline" });
      fireEvent.click(timelineBtn);
      expect(useBooksStore.getState().layoutMode).toBe("TIMELINE");

      // Switch to My Library (Favorites)
      const favBtn = screen.getByRole("button", { name: /My Library/i });
      fireEvent.click(favBtn);
      expect(useBooksStore.getState().layoutMode).toBe("FAVORITES");
      expect(screen.getByText("My Saved Library (1)")).toBeInTheDocument();
    });

    it("handles fetch failure gracefully by clearing books data", async () => {
      const mockFetch = mock().mockRejectedValue(new Error("Network Error"));
      globalThis.fetch = mockFetch as any;

      useBooksStore.setState({ booksData: [mockSampleBook] });

      render(<GoogleBooksExplorer />);

      const searchInput = screen.getByPlaceholderText(/Search books by title, author, or ISBN/i);
      fireEvent.change(searchInput, { target: { value: "Failing query" } });

      const searchButton = screen.getByRole("button", { name: "Search" });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(useBooksStore.getState().booksData).toEqual([]);
        expect(screen.getByText(/No books found/i)).toBeInTheDocument();
      });
    });

    it("loads a random subject when Feeling Lucky button is clicked", async () => {
      const mockFetch = mock().mockResolvedValue({
        json: async () => ({ items: [mockSampleBook] }),
      });
      globalThis.fetch = mockFetch as any;

      useBooksStore.setState({ booksData: [mockSampleBook] });

      render(<GoogleBooksExplorer />);

      const luckyBtn = screen.getByTitle("Feeling Lucky");
      fireEvent.click(luckyBtn);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
        expect(useBooksStore.getState().searchQuery.length).toBeGreaterThan(0);
      });
    });
  });

  describe("BentoLayout Component", () => {
    const mockCategorizedBook = {
      id: "bento-1",
      volumeInfo: {
        title: "Database Internals",
        authors: ["Alex Petrov"],
        publishedDate: "2019-10-15",
        pageCount: 375,
        categories: ["Databases", "System Design"],
      },
    };

    const mockCategorizedBook2 = {
      id: "bento-2",
      volumeInfo: {
        title: "Designing Data-Intensive Applications",
        authors: ["Martin Kleppmann", "Alex Petrov"],
        publishedDate: "2017-03-16",
        pageCount: 616,
        categories: ["Databases"],
      },
    };

    it("renders fallback message when books is empty", () => {
      render(<BentoLayout books={[]} />);
      expect(screen.getByText("No data to analyze.")).toBeInTheDocument();
    });

    it("renders stats, top authors, and category breakdown when categories exist", () => {
      render(<BentoLayout books={[mockCategorizedBook, mockCategorizedBook2]} />);

      expect(screen.getByText("Total Books Found")).toBeInTheDocument();
      expect(screen.getAllByText("2").length).toBeGreaterThan(0);
      expect(screen.getByText("Estimated Total Pages")).toBeInTheDocument();
      // Total pages: 375 + 616 = 991
      expect(screen.getByText("991")).toBeInTheDocument();
      expect(screen.getByText("Frequent Authors")).toBeInTheDocument();
      expect(screen.getByText("Top Genres / Categories")).toBeInTheDocument();
      expect(screen.getByText("Databases")).toBeInTheDocument();
      expect(screen.getByText("System Design")).toBeInTheDocument();
    });

    it("renders no category message when books lack categories", () => {
      const bookWithoutCats = {
        id: "no-cat-1",
        volumeInfo: {
          title: "Uncategorized Book",
          publishedDate: "2020-01-01",
        },
      };

      render(<BentoLayout books={[bookWithoutCats]} />);
      expect(screen.getByText("No category data available for these books.")).toBeInTheDocument();
    });
  });

  describe("BookshelfLayout Component", () => {
    it("renders empty state when books array is empty", () => {
      render(<BookshelfLayout books={[]} />);
      expect(screen.getByText(/No books found/i)).toBeInTheDocument();
    });

    it("renders book cards with fallback fields and allows toggling favorites", () => {
      const minimalBook = {
        id: "book-shelf-1",
        volumeInfo: {
          title: "Shelved Book",
        },
      };

      render(<BookshelfLayout books={[mockSampleBook, minimalBook]} title="Custom Bookshelf" />);

      expect(screen.getByText("Custom Bookshelf (2)")).toBeInTheDocument();
      expect(screen.getByText("Designing Data-Intensive Applications")).toBeInTheDocument();
      expect(screen.getByText("Shelved Book")).toBeInTheDocument();
      expect(screen.getByText("Unknown Author")).toBeInTheDocument();
      expect(screen.getByText("N/A")).toBeInTheDocument();

      // Click favorite toggle button on first book
      const favButtons = screen.getAllByRole("button");
      fireEvent.click(favButtons[0]);

      expect(useBooksStore.getState().favorites.some((f) => f.id === "book-1")).toBe(true);
    });
  });

  describe("TimelineLayout Component", () => {
    it("renders fallback message when books array is empty or lacks publishedDate", () => {
      const { rerender } = render(<TimelineLayout books={[]} />);
      expect(screen.getByText("No timeline data available.")).toBeInTheDocument();

      const noDateBook = { id: "no-date", volumeInfo: { title: "Undated" } };
      rerender(<TimelineLayout books={[noDateBook]} />);
      expect(screen.getByText("No timeline data available.")).toBeInTheDocument();
    });

    it("sorts books descending by publication date and allows toggling favorites", () => {
      const olderBook = {
        id: "old-1",
        volumeInfo: {
          title: "Older Book",
          publishedDate: "2005-01-01",
          pageCount: 300,
          categories: ["History"],
          description: "History book description",
        },
      };

      const newerBook = {
        id: "new-1",
        volumeInfo: {
          title: "Newer Book",
          publishedDate: "2023-05-15",
          previewLink: "https://preview.google.com",
        },
      };

      render(<TimelineLayout books={[olderBook, newerBook]} />);

      expect(screen.getByText("Publication Timeline")).toBeInTheDocument();
      expect(screen.getByText("Newer Book")).toBeInTheDocument();
      expect(screen.getByText("Older Book")).toBeInTheDocument();
      expect(screen.getByText("History book description")).toBeInTheDocument();
      expect(screen.getByText("300 pages")).toBeInTheDocument();

      // Toggle favorite in timeline
      const favButtons = screen.getAllByTitle("Toggle Favorite");
      expect(favButtons.length).toBe(2);
      fireEvent.click(favButtons[0]);

      expect(useBooksStore.getState().favorites.some((f) => f.id === "new-1")).toBe(true);
    });
  });
});
