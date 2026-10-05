import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";

let lastNodesChangeHandler: any;
let lastEdgesChangeHandler: any;

// Mock @xyflow/react to capture node and edge handlers
mock.module("@xyflow/react", () => ({
  ReactFlow: ({ children, nodes, edges, onNodesChange, onEdgesChange }: any) => {
    lastNodesChangeHandler = onNodesChange;
    lastEdgesChangeHandler = onEdgesChange;
    return (
      <div data-testid="react-flow" data-nodes-count={nodes?.length} data-edges-count={edges?.length}>
        {children}
      </div>
    );
  },
  Background: () => <div data-testid="rf-background" />,
  Controls: () => <div data-testid="rf-controls" />,
  MarkerType: { ArrowClosed: "arrowclosed" },
  applyNodeChanges: (changes: any, nodes: any) => nodes,
  applyEdgeChanges: (changes: any, edges: any) => edges,
}));

// Mock framer-motion to avoid async animation delays in unit tests
mock.module("framer-motion", () => ({
  motion: {
    div: ({ children, className, style, ...props }: any) => (
      <div className={className} style={style} {...props}>{children}</div>
    ),
    circle: ({ children, className, style, ...props }: any) => (
      <circle className={className} style={style} {...props}>{children}</circle>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import OmniQAPremium from "@/app/projects/(micro-apps)/omni-qa-premium/page";

describe("OmniQA Premium Micro-App", () => {
  it("handles nodes and edges changes in ReactFlow", () => {
    render(<OmniQAPremium />);

    expect(lastNodesChangeHandler).toBeDefined();
    expect(lastEdgesChangeHandler).toBeDefined();

    act(() => {
      lastNodesChangeHandler([{ type: "select", id: "start", selected: true }]);
      lastEdgesChangeHandler([{ type: "select", id: "e-start-cart", selected: true }]);
    });
  });
  it("renders the navigation header with tabs and title", () => {
    render(<OmniQAPremium />);

    expect(screen.getByText("OmniQA")).toBeInTheDocument();
    expect(screen.getByText("Ecosystem")).toBeInTheDocument();
    expect(screen.getByText(/Workspace/i)).toBeInTheDocument();
    expect(screen.getByText(/HR \/ PMS Bridge/i)).toBeInTheDocument();
  });

  it("renders initial business impact metrics and initial state in canvas tab", () => {
    render(<OmniQAPremium />);

    // Business Impact Metrics initial values
    expect(screen.getByText("Business Impact")).toBeInTheDocument();
    expect(screen.getByText("New Steps")).toBeInTheDocument();
    expect(screen.getByText("Test Paths")).toBeInTheDocument();
    expect(screen.getByText("Est. Time")).toBeInTheDocument();
    expect(screen.getByText("Est. Cost")).toBeInTheDocument();

    // Initial metric values
    expect(screen.getByText("4")).toBeInTheDocument(); // test paths
    expect(screen.getAllByText("0").length).toBeGreaterThanOrEqual(2); // new steps & hours
    expect(screen.getByText("$0")).toBeInTheDocument(); // cost

    // Live Feed idle state
    expect(screen.getByText("Waiting for workflow updates...")).toBeInTheDocument();
  });

  it("switches to HR / PMS Bridge tab and back to Workspace tab", () => {
    render(<OmniQAPremium />);

    // Switch to HR tab
    const hrTabBtn = screen.getByText(/HR \/ PMS Bridge/i);
    fireEvent.click(hrTabBtn);

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Senior QA Strategist")).toBeInTheDocument();
    expect(screen.getByText("Top 5% Performer this quarter")).toBeInTheDocument();
    expect(screen.getByText("$12,450")).toBeInTheDocument();
    expect(screen.getByText("Map Coverage")).toBeInTheDocument();
    expect(screen.getByText("92%")).toBeInTheDocument();
    expect(screen.getByText("Discovery Bonus")).toBeInTheDocument();
    expect(screen.getByText("+450")).toBeInTheDocument();
    expect(screen.getByText("High-Risk Resolution")).toBeInTheDocument();

    // Verify SyncButton initial state
    const syncButton = screen.getByText(/Sync Performance to HR\/Payroll System/i);
    expect(syncButton).toBeInTheDocument();

    // Switch back to Workspace tab
    const workspaceTabBtn = screen.getByText(/Workspace/i);
    fireEvent.click(workspaceTabBtn);
    expect(screen.getByText("Business Impact")).toBeInTheDocument();
  });

  it("SyncButton transitions through syncing and done states", () => {
    const queue: { fn: Function; ms: number }[] = [];
    const originalSetTimeout = globalThis.setTimeout;
    globalThis.setTimeout = ((fn: any, ms?: number) => {
      queue.push({ fn, ms: ms || 0 });
      return queue.length as any;
    }) as any;

    try {
      render(<OmniQAPremium />);
      const hrTabBtn = screen.getByText(/HR \/ PMS Bridge/i);
      fireEvent.click(hrTabBtn);

      const syncBtn = screen.getByRole("button", { name: /Sync Performance/i });
      fireEvent.click(syncBtn);

      // Should now be syncing
      expect(screen.getByText(/Syncing Data securely/i)).toBeInTheDocument();

      // Trigger 2000ms timeout for 'done'
      const syncTimeout = queue.shift();
      expect(syncTimeout?.ms).toBe(2000);
      act(() => {
        syncTimeout?.fn();
      });

      // Should now be done
      expect(screen.getByText(/Data Synced Successfully!/i)).toBeInTheDocument();

      // Trigger 4000ms timeout for 'idle'
      const doneTimeout = queue.shift();
      expect(doneTimeout?.ms).toBe(4000);
      act(() => {
        doneTimeout?.fn();
      });

      // Back to idle
      expect(screen.getByText(/Sync Performance to HR\/Payroll System/i)).toBeInTheDocument();
    } finally {
      globalThis.setTimeout = originalSetTimeout;
    }
  });

  it("handles input change and validates empty submission", () => {
    render(<OmniQAPremium />);

    const input = screen.getByPlaceholderText(/Type a business requirement in plain English/i) as HTMLInputElement;
    const submitBtn = screen.getByRole("button", { name: /Apply Magic/i });

    // Initial state: submit button should be disabled when input is empty
    expect(submitBtn).toBeDisabled();

    // Type whitespace only: should remain disabled
    fireEvent.change(input, { target: { value: "   " } });
    expect(submitBtn).toBeDisabled();

    // Submit with empty string should be prevented
    fireEvent.submit(submitBtn.closest("form")!);
    expect(screen.getByText("Waiting for workflow updates...")).toBeInTheDocument();

    // Valid typing
    fireEvent.change(input, { target: { value: "Add VIP check before checkout" } });
    expect(input.value).toBe("Add VIP check before checkout");
    expect(submitBtn).not.toBeDisabled();
  });

  it("executes the full AI story workflow from thinking to canvas update and simulation completion", () => {
    const queue: { fn: Function; ms: number }[] = [];
    const originalSetTimeout = globalThis.setTimeout;

    globalThis.setTimeout = ((fn: any, ms?: number) => {
      queue.push({ fn, ms: ms || 0 });
      return queue.length as any;
    }) as any;

    try {
      render(<OmniQAPremium />);

      const input = screen.getByPlaceholderText(/Type a business requirement in plain English/i);
      fireEvent.change(input, { target: { value: "Verify VIP Membership before checkout" } });

      const form = input.closest("form")!;
      fireEvent.submit(form);

      // Stage: thinking
      expect(screen.getByText(/AI is mapping your request/i)).toBeInTheDocument();
      expect(screen.getByText(/Processing.../i)).toBeInTheDocument();

      // Trigger 2000ms timeout -> updating_canvas
      const thinkingTimeout = queue.shift();
      expect(thinkingTimeout?.ms).toBe(2000);
      act(() => {
        thinkingTimeout?.fn();
      });

      // Updated metrics should be rendered: paths: 19, hours: 4, cost: 200, added: 1
      expect(screen.getByText("19")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("$200")).toBeInTheDocument();

      // Trigger 1500ms timeout -> running_agent & runAiWorkerSimulation
      const agentTimeout = queue.shift();
      expect(agentTimeout?.ms).toBe(1500);
      act(() => {
        agentTimeout?.fn();
      });

      // Now queue contains the 7 simulation steps: [500, 1500, 2500, 4000, 5500, 6500, 8000]
      expect(queue.length).toBe(7);
      while (queue.length > 0) {
        const step = queue.shift();
        act(() => {
          step?.fn();
        });
      }

      // Verify all AI logs appear in feed
      expect(screen.getByText(/Initializing testing protocol/i)).toBeInTheDocument();
      expect(screen.getByText(/Navigating to Customer Dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/Testing new path: "Verify VIP Membership"/i)).toBeInTheDocument();
      expect(screen.getByText(/Attempting to skip VIP check... Blocked!/i)).toBeInTheDocument();
      expect(screen.getByText(/Found a changed checkout button layout/i)).toBeInTheDocument();
      expect(screen.getByText(/Automatically adjusting and clicking via visual fallback/i)).toBeInTheDocument();
      expect(screen.getByText(/Order Complete. All 15 new edge cases passed successfully/i)).toBeInTheDocument();
    } finally {
      globalThis.setTimeout = originalSetTimeout;
    }
  });
});
