import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";
import React from "react";
import { render, screen, act } from "@testing-library/react";

// Mock recharts to avoid canvas/layout dimension warnings
mock.module("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="xaxis" />,
  YAxis: () => <div data-testid="yaxis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

import CryptoCard, { Coin } from "@/app/projects/(micro-apps)/crypto/components/CryptoCard";
import PriceFlashValue from "@/app/projects/(micro-apps)/crypto/components/PriceFlashValue";
import CryptoMarketChart from "@/app/projects/(micro-apps)/crypto/components/CryptoMarketChart";
import CryptoDashboard from "@/app/projects/(micro-apps)/crypto/page";

class MockEventSource {
  static instances: MockEventSource[] = [];
  url: string;
  onmessage: ((event: any) => void) | null = null;
  onerror: ((error: any) => void) | null = null;
  closed = false;

  constructor(url: string) {
    this.url = url;
    MockEventSource.instances.push(this);
  }

  close() {
    this.closed = true;
  }
}

describe("Crypto Micro-App", () => {
  const originalEventSource = globalThis.EventSource;

  beforeEach(() => {
    MockEventSource.instances = [];
    (globalThis as any).EventSource = MockEventSource;
  });

  afterEach(() => {
    (globalThis as any).EventSource = originalEventSource;
  });

  describe("CryptoCard Component", () => {
    const btcCoin: Coin = {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 64123.45,
      change24h: 3.52,
    };

    const pepeCoin: Coin = {
      id: "pepe",
      name: "Pepe",
      symbol: "PEPE",
      price: 0.000085,
      change24h: -4.18,
    };

    it("formats high-value coin price with 2 decimals USD and positive change with green class", () => {
      render(<CryptoCard coin={btcCoin} />);

      expect(screen.getByText("Bitcoin")).toBeInTheDocument();
      expect(screen.getByText("BTC")).toBeInTheDocument();
      expect(screen.getByText("$64,123.45")).toBeInTheDocument();

      const changeEl = screen.getByText("+3.52%");
      expect(changeEl).toBeInTheDocument();
      expect(changeEl.className).toContain("text-green-500");
    });

    it("formats low-value sub-dollar coin price with up to 5 decimals and negative change with red class", () => {
      render(<CryptoCard coin={pepeCoin} />);

      expect(screen.getByText("Pepe")).toBeInTheDocument();
      expect(screen.getByText("PEPE")).toBeInTheDocument();
      expect(screen.getByText("$0.00009")).toBeInTheDocument();

      const changeEl = screen.getByText("-4.18%");
      expect(changeEl).toBeInTheDocument();
      expect(changeEl.className).toContain("text-red-500");
    });

    it("handles zero price change with 0.00% and positive color class", () => {
      const stableCoin: Coin = {
        id: "usdc",
        name: "USD Coin",
        symbol: "USDC",
        price: 1.0,
        change24h: 0,
      };

      render(<CryptoCard coin={stableCoin} />);

      const changeEl = screen.getByText("0.00%");
      expect(changeEl).toBeInTheDocument();
      expect(changeEl.className).toContain("text-green-500");
    });
  });

  describe("PriceFlashValue Component", () => {
    it("renders formatted text initially with neutral styling", () => {
      render(<PriceFlashValue value={100} formattedText="$100.00" />);
      const textEl = screen.getByText("$100.00");
      expect(textEl).toBeInTheDocument();
      expect(textEl.className).toContain("text-gray-900");
    });

    it("flashes green when price increases, and reverts back after timeout", () => {
      const capturedTimeouts: { fn: Function; ms: number }[] = [];
      const originalSetTimeout = globalThis.setTimeout;
      globalThis.setTimeout = ((fn: any, ms?: number) => {
        capturedTimeouts.push({ fn, ms: ms || 0 });
        return capturedTimeouts.length as any;
      }) as any;

      try {
        const { rerender } = render(<PriceFlashValue value={100} formattedText="$100.00" />);

        // Price increases to 110
        rerender(<PriceFlashValue value={110} formattedText="$110.00" />);
        const updatedEl = screen.getByText("$110.00");
        expect(updatedEl.className).toContain("text-green-500");

        // Advance 500ms timeout
        const timeout = capturedTimeouts.find(t => t.ms === 500);
        expect(timeout).toBeDefined();
        act(() => {
          timeout?.fn();
        });

        expect(updatedEl.className).toContain("text-gray-900");
      } finally {
        globalThis.setTimeout = originalSetTimeout;
      }
    });

    it("flashes red when price decreases", () => {
      const { rerender } = render(<PriceFlashValue value={100} formattedText="$100.00" />);

      // Price drops to 90
      rerender(<PriceFlashValue value={90} formattedText="$90.00" />);
      const updatedEl = screen.getByText("$90.00");
      expect(updatedEl.className).toContain("text-red-500");
    });
  });

  describe("CryptoDashboard Page Component", () => {
    it("renders initial loading state and opens EventSource connection", () => {
      render(<CryptoDashboard />);

      expect(screen.getByText("Crypto Dashboard")).toBeInTheDocument();
      expect(MockEventSource.instances.length).toBe(1);
      expect(MockEventSource.instances[0].url).toBe("/api/crypto/stream");
    });

    it("receives SSE data, closes loading spinner, and renders crypto cards", () => {
      render(<CryptoDashboard />);

      const es = MockEventSource.instances[0];
      expect(es).toBeDefined();

      const sampleData: Coin[] = [
        { id: "btc", name: "Bitcoin", symbol: "BTC", price: 65000, change24h: 2.1 },
        { id: "eth", name: "Ethereum", symbol: "ETH", price: 3500, change24h: -1.4 },
      ];

      act(() => {
        es.onmessage?.({ data: JSON.stringify(sampleData) });
      });

      expect(screen.getByText("Bitcoin")).toBeInTheDocument();
      expect(screen.getByText("Ethereum")).toBeInTheDocument();
      expect(screen.getByText("$65,000.00")).toBeInTheDocument();
      expect(screen.getByText("$3,500.00")).toBeInTheDocument();
    });

    it("handles SSE parse error by displaying error message", () => {
      render(<CryptoDashboard />);

      const es = MockEventSource.instances[0];
      act(() => {
        es.onmessage?.({ data: "invalid-json{" });
      });

      expect(screen.getByText("Failed to parse data")).toBeInTheDocument();
    });

    it("handles SSE network error by displaying error message", () => {
      render(<CryptoDashboard />);

      const es = MockEventSource.instances[0];
      act(() => {
        es.onerror?.(new Error("Connection lost"));
      });

      expect(screen.getByText("Failed to fetch real-time data")).toBeInTheDocument();
    });

    it("closes EventSource stream when unmounted", () => {
      const { unmount } = render(<CryptoDashboard />);

      const es = MockEventSource.instances[0];
      expect(es.closed).toBe(false);

      unmount();
      expect(es.closed).toBe(true);
    });
  });

  describe("CryptoMarketChart Component", () => {
    it("renders market trends header and chart area container", () => {
      render(<CryptoMarketChart />);
      expect(screen.getByText("Market Trends (30 Days)")).toBeInTheDocument();
      expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
      expect(screen.getByTestId("area-chart")).toBeInTheDocument();
    });
  });
});
