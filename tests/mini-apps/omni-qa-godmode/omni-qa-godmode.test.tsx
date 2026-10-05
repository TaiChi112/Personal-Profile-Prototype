import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";
import React from "react";

// Mock framer-motion to execute renders immediately without waiting for CSS/rAF transition steps
mock.module("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_, tag: string) => {
        const Comp = React.forwardRef<any, any>(({ children, initial, animate, exit, transition, ...props }, ref) => {
          return React.createElement(tag, { ...props, ref }, children);
        });
        Comp.displayName = `motion.${tag}`;
        return Comp;
      },
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { render, fireEvent, act } from "@testing-library/react";
import OmniQAGodMode from "../../../app/projects/(micro-apps)/omni-qa-godmode/page";

describe("OmniQA God Mode Micro-App", () => {
  let timeoutCallbacks: Array<{ callback: () => void; delay: number }> = [];
  let intervalCallbacks: Array<{ callback: () => void; interval: number; id: number }> = [];
  let nextIntervalId = 1;
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const originalSetInterval = globalThis.setInterval;
  const originalClearInterval = globalThis.clearInterval;

  const flushTimeouts = () => {
    // Sort by delay and execute all pending timeouts
    const cbs = [...timeoutCallbacks];
    timeoutCallbacks = [];
    cbs.sort((a, b) => a.delay - b.delay);
    cbs.forEach(t => t.callback());
  };

  const flushIntervals = (ticks: number) => {
    for (let i = 0; i < ticks; i++) {
      const active = [...intervalCallbacks];
      active.forEach(item => item.callback());
    }
  };

  beforeEach(() => {
    timeoutCallbacks = [];
    intervalCallbacks = [];
    nextIntervalId = 1;

    globalThis.setTimeout = ((cb: () => void, delay: number = 0) => {
      timeoutCallbacks.push({ callback: cb, delay });
      return timeoutCallbacks.length as any;
    }) as any;

    globalThis.clearTimeout = ((id: any) => {
      // Clear timeout
    }) as any;

    globalThis.setInterval = ((cb: () => void, interval: number = 0) => {
      const id = nextIntervalId++;
      intervalCallbacks.push({ callback: cb, interval, id });
      return id as any;
    }) as any;

    globalThis.clearInterval = ((id: any) => {
      intervalCallbacks = intervalCallbacks.filter(i => i.id !== id);
    }) as any;
  });

  afterEach(() => {
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
    globalThis.setInterval = originalSetInterval;
    globalThis.clearInterval = originalClearInterval;
  });

  describe("Navigation & Header", () => {
    it("should render godmode header and default to Compliance Auditor tab", () => {
      const { getByText } = render(<OmniQAGodMode />);
      expect(getByText("OmniQA")).toBeInTheDocument();
      expect(getByText("Phase 4")).toBeInTheDocument();
      expect(getByText("Enterprise Authority Level")).toBeInTheDocument();

      // Compliance Auditor tab is active by default
      expect(getByText("Generate SOC2 Audit Report")).toBeInTheDocument();
    });

    it("should switch tabs between Auditor, Reverse Engineer, and Autonomous Coder", () => {
      const { getByText, queryByText } = render(<OmniQAGodMode />);

      // Switch to Reverse Engineer tab
      const reverseTabBtn = getByText("Reverse Engineer");
      act(() => {
        fireEvent.click(reverseTabBtn);
      });
      expect(getByText("Architecture Reconstruction")).toBeInTheDocument();
      expect(queryByText("Generate SOC2 Audit Report")).toBeNull();

      // Switch to Autonomous Coder tab
      const coderTabBtn = getByText("Autonomous Coder");
      act(() => {
        fireEvent.click(coderTabBtn);
      });
      expect(getByText("Business Intent Map")).toBeInTheDocument();
      expect(getByText("promoService.ts")).toBeInTheDocument();

      // Switch back to Compliance Auditor tab
      const auditorTabBtn = getByText("Compliance Auditor");
      act(() => {
        fireEvent.click(auditorTabBtn);
      });
      expect(getByText("Generate SOC2 Audit Report")).toBeInTheDocument();
    });
  });

  describe("Module 10: Compliance & Security Auditor", () => {
    it("should start audit when clicking button and show report after completion", () => {
      const { getByText, queryByText } = render(<OmniQAGodMode />);
      const auditBtn = getByText("Generate SOC2 Audit Report");
      expect(auditBtn).toBeInTheDocument();

      // Click Generate SOC2 Audit Report
      act(() => {
        fireEvent.click(auditBtn);
      });

      // While auditing, button should be disabled
      const currentAuditBtn = getByText("Generate SOC2 Audit Report");
      expect(currentAuditBtn.hasAttribute("disabled")).toBe(true);

      // Advance timeouts
      act(() => {
        flushTimeouts();
      });

      // Report should be visible
      expect(getByText("PII / PCI Data Secured")).toBeInTheDocument();
      expect(getByText("Nodes successfully encrypted via TLS 1.3")).toBeInTheDocument();
      expect(getByText("100% Compliant")).toBeInTheDocument();
      expect(getByText("3 missing encryption states detected.")).toBeInTheDocument();
      expect(getByText("Export Audit Log (PDF/JSON)")).toBeInTheDocument();
    });
  });

  describe("Module 11: Reverse Engineer", () => {
    it("should run reverse engineering scan and reconstruct architecture", () => {
      const { getByText } = render(<OmniQAGodMode />);

      act(() => {
        fireEvent.click(getByText("Reverse Engineer"));
      });

      expect(getByText("Awaiting System Target")).toBeInTheDocument();
      expect(getByText("Corporate System V2.1 (1998)")).toBeInTheDocument();

      const initScanBtn = getByText("Init Reverse Engineering");
      act(() => {
        fireEvent.click(initScanBtn);
      });

      // Trigger all steps of the scan
      act(() => {
        flushTimeouts();
        flushTimeouts();
      });

      // Target metrics should appear
      expect(getByText("Discovered States")).toBeInTheDocument();
      expect(getByText("Hidden Workflows Found")).toBeInTheDocument();
      expect(getByText("Test Coverage Generated")).toBeInTheDocument();
    });

    it("should not re-trigger scan if already in progress", () => {
      const { getByText } = render(<OmniQAGodMode />);

      act(() => {
        fireEvent.click(getByText("Reverse Engineer"));
      });

      const initScanBtn = getByText("Init Reverse Engineering");
      act(() => {
        fireEvent.click(initScanBtn);
      });

      // Try triggering again while scanning
      act(() => {
        fireEvent.click(initScanBtn);
      });

      act(() => {
        flushTimeouts();
        flushTimeouts();
      });

      expect(getByText("Discovered States")).toBeInTheDocument();
    });
  });

  describe("Module 12: Autonomous Feature Coder", () => {
    it("should trigger autonomous feature coding and complete successfully", () => {
      const { getByText } = render(<OmniQAGodMode />);

      act(() => {
        fireEvent.click(getByText("Autonomous Coder"));
      });

      const addStateBtn = getByText("Add State: Promo Code");
      expect(getByText("Idle")).toBeInTheDocument();
      expect(getByText("Awaiting compilation")).toBeInTheDocument();

      // Trigger coding
      act(() => {
        fireEvent.click(addStateBtn);
      });

      // Simulate typewriter interval ticks
      act(() => {
        flushIntervals(200);
      });

      // Verification after completion
      expect(getByText("Compilation Successful")).toBeInTheDocument();
      expect(getByText("Code passed all auto-tests")).toBeInTheDocument();

      const mergeBtn = getByText("Merge Feature to Production");
      expect(mergeBtn.hasAttribute("disabled")).toBe(false);
    });

    it("should not re-trigger coding when already running or completed", () => {
      const { getByText } = render(<OmniQAGodMode />);

      act(() => {
        fireEvent.click(getByText("Autonomous Coder"));
      });

      const addStateBtn = getByText("Add State: Promo Code");
      act(() => {
        fireEvent.click(addStateBtn);
      });

      // Click again while running
      act(() => {
        fireEvent.click(addStateBtn);
      });

      act(() => {
        flushIntervals(200);
      });

      expect(getByText("Compilation Successful")).toBeInTheDocument();
    });
  });
});
