import { describe, it, expect } from "bun:test";
import React from "react";
import { mock } from "bun:test";

// Mock framer-motion for instant tab renders
mock.module("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_, tag: string) => {
        const Comp = React.forwardRef<any, any>(({ children, initial, animate, exit, transition, ...props }, ref) => React.createElement(tag, { ...props, ref }, children));
        Comp.displayName = `motion.${tag}`;
        return Comp;
      },
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { render, fireEvent, act } from "@testing-library/react";
import OmniQASentient from "../../../app/projects/(micro-apps)/omni-qa-sentient/page";

describe("OmniQA Sentient Micro-App", () => {
  describe("Navigation & Header", () => {
    it("should render sentient header and default to The Live Sentinel tab", () => {
      const { getByText } = render(<OmniQASentient />);
      expect(getByText("OmniQA")).toBeInTheDocument();
      expect(getByText("Evolution")).toBeInTheDocument();
      expect(getByText("Sentient Architecture")).toBeInTheDocument();

      // The Live Sentinel tab is active by default
      expect(getByText("ENABLE LIVE TRAFFIC")).toBeInTheDocument();
    });

    it("should switch between Sentinel, Optimizer, and Hub tabs", () => {
      const { getByText, queryByText } = render(<OmniQASentient />);

      // Switch to Self-Optimizer tab
      const optimizerTabBtn = getByText("Self-Optimizer");
      act(() => {
        fireEvent.click(optimizerTabBtn);
      });
      expect(getByText("Autonomous Maintenance")).toBeInTheDocument();
      expect(queryByText("ENABLE LIVE TRAFFIC")).toBeNull();

      // Switch to Agentic Hub tab
      const hubTabBtn = getByText("Agentic Hub");
      act(() => {
        fireEvent.click(hubTabBtn);
      });
      expect(getByText("Cross-Team Marketplace for Reusable State Machines")).toBeInTheDocument();
      expect(queryByText("Autonomous Maintenance")).toBeNull();

      // Switch back to The Live Sentinel tab
      const sentinelTabBtn = getByText("The Live Sentinel");
      act(() => {
        fireEvent.click(sentinelTabBtn);
      });
      expect(getByText("ENABLE LIVE TRAFFIC")).toBeInTheDocument();
    });
  });

  describe("Module 7: The Live Sentinel (Telemetry & Ghost Nodes)", () => {
    it("should toggle live telemetry and render ghost node anomaly drawer", () => {
      const { getByText, queryByText } = render(<OmniQASentient />);
      const toggleBtn = getByText("ENABLE LIVE TRAFFIC");

      // Before telemetry connection, analytics panel is hidden
      expect(queryByText("Production Insights")).toBeNull();

      // Connect telemetry
      act(() => {
        fireEvent.click(toggleBtn);
      });

      // Button updates to LIVE TELEMETRY ACTIVE
      expect(getByText("LIVE TELEMETRY ACTIVE")).toBeInTheDocument();

      // Analytics panel should now be visible
      expect(getByText("Production Insights")).toBeInTheDocument();
      expect(getByText("Live Drop-off Detection")).toBeInTheDocument();
      expect(getByText("45%")).toBeInTheDocument();
      expect(getByText("Unmapped Behavior Alert")).toBeInTheDocument();
      expect(getByText("New edge case auto-generated")).toBeInTheDocument();

      // Disconnect telemetry
      act(() => {
        fireEvent.click(getByText("LIVE TELEMETRY ACTIVE"));
      });

      expect(getByText("ENABLE LIVE TRAFFIC")).toBeInTheDocument();
      expect(queryByText("Production Insights")).toBeNull();
    });
  });

  describe("Module 8: The Self-Optimizer (Architecture Refactoring)", () => {
    it("should handle refactoring approval flow", () => {
      const { getByText } = render(<OmniQASentient />);

      // Switch to Self-Optimizer tab
      act(() => {
        fireEvent.click(getByText("Self-Optimizer"));
      });

      expect(getByText("Current Architecture (50 Steps)")).toBeInTheDocument();
      expect(getByText("AI Optimized Architecture (35 Steps)")).toBeInTheDocument();

      const approveBtn = getByText("Approve Architecture Refactoring");
      expect(approveBtn).toBeInTheDocument();
      expect(approveBtn.hasAttribute("disabled")).toBe(false);

      // Approve refactoring
      act(() => {
        fireEvent.click(approveBtn);
      });

      // Success overlay is visible and button text updates to disabled state
      expect(getByText("Refactoring Applied Successfully")).toBeInTheDocument();
      expect(getByText("Test suite pruned. Codebase optimized.")).toBeInTheDocument();
      const disabledBtn = getByText("Optimization Complete");
      expect(disabledBtn.hasAttribute("disabled")).toBe(true);
    });
  });

  describe("Module 9: The Agentic Hub (State Machine Marketplace)", () => {
    it("should render catalog of autonomous components with reliability metrics", () => {
      const { getByText, getAllByText } = render(<OmniQASentient />);

      // Switch to Agentic Hub tab
      act(() => {
        fireEvent.click(getByText("Agentic Hub"));
      });

      // PMS Hub Score
      expect(getByText("Your PMS Hub Score:")).toBeInTheDocument();
      expect(getByText("4,250")).toBeInTheDocument();

      // Verify all 4 pre-validated modules are rendered
      expect(getByText("Enterprise OAuth Login")).toBeInTheDocument();
      expect(getByText("Stripe Secure Checkout")).toBeInTheDocument();
      expect(getByText("GDPR Data Deletion Flow")).toBeInTheDocument();
      expect(getByText("Multi-step Onboarding")).toBeInTheDocument();

      // Check Reliability Scores
      expect(getByText("99.8%")).toBeInTheDocument();
      expect(getByText("99.9%")).toBeInTheDocument();
      expect(getByText("100%")).toBeInTheDocument();
      expect(getByText("98.5%")).toBeInTheDocument();

      // Install buttons
      const installButtons = getAllByText("Install Block");
      expect(installButtons.length).toBe(4);
    });
  });
});
