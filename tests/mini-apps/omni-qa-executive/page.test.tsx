import { describe, it, expect, mock, beforeEach, } from "bun:test";
import { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock @xyflow/react
mock.module("@xyflow/react", () => ({
  ReactFlow: ({ children, nodes, edges }: any) => (
    <div data-testid="react-flow" data-nodes={JSON.stringify(nodes?.map((n: any) => n.id))}>
      {children}
    </div>
  ),
  Background: () => <div data-testid="rf-background" />,
  Controls: () => <div data-testid="rf-controls" />,
  MarkerType: { ArrowClosed: "arrowclosed" },
}));

// Mock recharts
mock.module("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children, data }: any) => <div data-testid="area-chart" data-chart={JSON.stringify(data)}>{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="xaxis" />,
  YAxis: () => <div data-testid="yaxis" />,
  CartesianGrid: () => <div data-testid="cartesiangrid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
}));

// Mock framer-motion
mock.module("framer-motion", () => ({
  motion: {
    div: ({ children, className, onClick, ...props }: any) => (
      <div className={className} onClick={onClick} {...props}>{children}</div>
    ),
    circle: ({ children, ...props }: any) => <circle {...props}>{children}</circle>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import OmniQAExecutive from "@/app/projects/(micro-apps)/omni-qa-executive/page";

describe("OmniQAExecutive Component", () => {
  beforeEach(() => {
    // Setup fake timers or standard hooks
  });

  it("should render initial navbar and default to The Time Machine tab", () => {
    render(<OmniQAExecutive />);

    expect(screen.getByText("OmniQA")).toBeInTheDocument();
    expect(screen.getByText("Phase 2")).toBeInTheDocument();
    expect(screen.getByText("Strategic Command")).toBeInTheDocument();

    expect(screen.getByText("The Time Machine")).toBeInTheDocument();
    expect(screen.getByText("The War Room")).toBeInTheDocument();
    expect(screen.getByText("Command Center")).toBeInTheDocument();

    // In Time Machine tab by default
    expect(screen.getByText("Feature Wishlist")).toBeInTheDocument();
    expect(screen.getByText("Add Apple Pay Integration")).toBeInTheDocument();
    expect(screen.getByText("Loyalty Points System")).toBeInTheDocument();
  });

  it("should simulate drag-and-drop forecasting when Add Apple Pay is clicked", async () => {
    const originalSetTimeout = global.setTimeout;
    let timerCallback: any = null;
    global.setTimeout = ((fn: any, ms: any) => {
      timerCallback = fn;
      return 123 as any;
    }) as any;

    try {
      render(<OmniQAExecutive />);

      const applePayCard = screen.getByText("Add Apple Pay Integration");
      fireEvent.click(applePayCard);

      // Should enter forecasting state
      expect(screen.getByText("Simulating Quantum Scenario...")).toBeInTheDocument();

      // Trigger the timeout callback
      expect(timerCallback).toBeDefined();
      await act(async () => {
        timerCallback();
      });

      // After timeout, projection panel should be visible
      expect(screen.getByText("AI Forecast Projection")).toBeInTheDocument();
      expect(screen.getByText("Predicted QA Workload")).toBeInTheDocument();
      expect(screen.getByText("+12")).toBeInTheDocument();
      expect(screen.getByText("36 new synthetic test cases generated")).toBeInTheDocument();
      expect(screen.getByText("Requires 1 Senior Financial Tester")).toBeInTheDocument();
      expect(screen.getByText("Strategic Recommendation")).toBeInTheDocument();
      expect(screen.getByText("Generate Executive Report")).toBeInTheDocument();

      // Verify node was added to ReactFlow
      const flow = screen.getByTestId("react-flow");
      const nodes = JSON.parse(flow.getAttribute("data-nodes") || "[]");
      expect(nodes).toContain("apple-pay");

      // Clicking again when not idle should not re-trigger
      fireEvent.click(applePayCard);
    } finally {
      global.setTimeout = originalSetTimeout;
    }
  });

  it("should switch to The War Room tab and display collaborative map and activity feed", () => {
    render(<OmniQAExecutive />);

    const warRoomTab = screen.getByText("The War Room");
    fireEvent.click(warRoomTab);

    // War room buttons
    expect(screen.getByText("Add Comment")).toBeInTheDocument();
    expect(screen.getByText("Voice Note")).toBeInTheDocument();
    expect(screen.getByText("AI Summarize Map")).toBeInTheDocument();

    // HR Activity Feed
    expect(screen.getByText("HR Activity Feed")).toBeInTheDocument();
    expect(screen.getByText("Jane (Senior QA)")).toBeInTheDocument();
    expect(screen.getByText("Successfully deployed 1-click checkout automated test suite. Bottleneck resolved.")).toBeInTheDocument();
    expect(screen.getByText("Performance Sync +50 pts")).toBeInTheDocument();
    expect(screen.getByText("AI Agent")).toBeInTheDocument();
    expect(screen.getByText("Converted Sarah's voice note into 3 actionable test specifications.")).toBeInTheDocument();

    // Check node list includes comment-1
    const flow = screen.getByTestId("react-flow");
    const nodes = JSON.parse(flow.getAttribute("data-nodes") || "[]");
    expect(nodes).toContain("comment-1");
  });

  it("should switch to Command Center tab and display KPIs and charts", () => {
    render(<OmniQAExecutive />);

    const cmdTab = screen.getByText("Command Center");
    fireEvent.click(cmdTab);

    expect(screen.getByText("Executive Summary")).toBeInTheDocument();
    expect(screen.getByText("Real-time ROI and Ecosystem Health")).toBeInTheDocument();

    // KPIs
    expect(screen.getByText("Time-to-Market")).toBeInTheDocument();
    expect(screen.getByText("2.4")).toBeInTheDocument();
    expect(screen.getByText("-82% from Q1 (14 days)")).toBeInTheDocument();

    expect(screen.getByText("Testing ROI")).toBeInTheDocument();
    expect(screen.getByText("$142k")).toBeInTheDocument();
    expect(screen.getByText("Saved via AI automation")).toBeInTheDocument();

    expect(screen.getByText("QA Team Health")).toBeInTheDocument();
    expect(screen.getByText("96")).toBeInTheDocument();
    expect(screen.getByText("/ 100")).toBeInTheDocument();

    // Charts
    expect(screen.getByText("Release Cycle Acceleration")).toBeInTheDocument();
    expect(screen.getByText("AI vs Human Workload")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("Automated")).toBeInTheDocument();
    expect(screen.getByText("AI Agent")).toBeInTheDocument();
    expect(screen.getByText("Human QA")).toBeInTheDocument();
  });
});
