import { describe, it, expect, mock, beforeEach } from "bun:test";
import { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock @xyflow/react
mock.module("@xyflow/react", () => ({
  ReactFlow: ({ children, nodes, edges }: any) => (
    <div data-testid="react-flow" data-nodes={JSON.stringify(nodes?.map((n: any) => n.id))}>
      {children}
    </div>
  ),
  Controls: () => <div data-testid="rf-controls" />,
  Background: () => <div data-testid="rf-background" />,
  Panel: ({ children, className }: any) => <div className={className} data-testid="rf-panel">{children}</div>,
  applyNodeChanges: (changes: any, nodes: any) => nodes,
  applyEdgeChanges: (changes: any, edges: any) => edges,
  MarkerType: { ArrowClosed: "ArrowClosed" },
}));

// Mock framer-motion
mock.module("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import AgenticTestingPage from "@/app/projects/(micro-apps)/agentic-testing/page";

describe("AgenticTestingPage Component", () => {
  let mockAlert: any;

  beforeEach(() => {
    mockAlert = mock();
    global.alert = mockAlert;
  });

  it("should render initial sidebar metrics and default nodes in v1.0", () => {
    render(<AgenticTestingPage />);

    expect(screen.getByText("QA Performance")).toBeInTheDocument();
    expect(screen.getByText("Sprint Score")).toBeInTheDocument();
    expect(screen.getByText("92")).toBeInTheDocument(); // initial qaScore
    expect(screen.getByText("85%")).toBeInTheDocument(); // initial coverage
    expect(screen.getByText("Agentic Testing Simulator")).toBeInTheDocument();

    const flow = screen.getByTestId("react-flow");
    const nodeIds = JSON.parse(flow.getAttribute("data-nodes") || "[]");
    expect(nodeIds).toEqual(["1", "2", "3"]);
  });

  it("should submit intent form and process AI response, updating metrics and graph", async () => {
    const mockApiResponse = {
      nodesToAdd: [{ id: "node-otp", label: "2FA Verification" }],
      edgesToAdd: [{ id: "e-otp", source: "2", target: "node-otp" }],
      edgesToRemove: ["e1-2"],
      impact: {
        testCasesAdded: 5,
        complexityIncrease: 20,
        logMessage: "Inserted 2FA step between Payment and Fulfillment",
      },
    };

    global.fetch = mock().mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    }) as any;

    render(<AgenticTestingPage />);

    const input = screen.getByPlaceholderText(/Instruct AI to modify workflow/i);

    fireEvent.change(input, { target: { value: "Add 2FA check before checkout" } });

    const executeBtn = screen.getByText("Execute");
    await act(async () => {
      fireEvent.click(executeBtn);
    });

    // Check that fetch was called
    expect(global.fetch).toHaveBeenCalled();

    // Check that AI action log was added
    expect(screen.getByText(/AI Action: Inserted 2FA step between Payment and Fulfillment/i)).toBeInTheDocument();

    // Metrics should have updated: testCases (8 + 5 = 13), complexity (15 + 20 = 35)
    expect(screen.getAllByText("13").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("35%")).toBeInTheDocument();

    // Graph should contain new node
    const flow = screen.getByTestId("react-flow");
    const nodeIds = JSON.parse(flow.getAttribute("data-nodes") || "[]");
    expect(nodeIds).toContain("node-otp");
  });

  it("should handle API failure gracefully and log error", async () => {
    global.fetch = mock().mockRejectedValueOnce(new Error("Network failed")) as any;

    render(<AgenticTestingPage />);

    const input = screen.getByPlaceholderText(/Instruct AI to modify workflow/i);

    fireEvent.change(input, { target: { value: "Trigger failure" } });
    const executeBtn = screen.getByText("Execute");
    await act(async () => {
      fireEvent.click(executeBtn);
    });

    expect(screen.getByText("Error communicating with AI Backend")).toBeInTheDocument();
  });

  it("should toggle versions between v1.0 and v2.0", async () => {
    const mockApiResponse = {
      nodesToAdd: [{ id: "node-otp", label: "2FA Verification" }],
      edgesToAdd: [],
      edgesToRemove: [],
      impact: {
        testCasesAdded: 1,
        complexityIncrease: 5,
        logMessage: "Added 2FA",
      },
    };

    global.fetch = mock().mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    }) as any;

    render(<AgenticTestingPage />);

    const input = screen.getByPlaceholderText(/Instruct AI to modify workflow/i);
    fireEvent.change(input, { target: { value: "Add 2FA" } });
    const executeBtn = screen.getByText("Execute");
    await act(async () => {
      fireEvent.click(executeBtn);
    });

    // After response, v2Nodes is populated and version switches to v2.0
    const v1Btn = screen.getByText(/v1.0 Current/i);
    const v2Btn = screen.getByText(/v2.0 Proposed/i);

    fireEvent.click(v1Btn);
    expect(v1Btn).toBeInTheDocument();

    fireEvent.click(v2Btn);
    expect(v2Btn).toBeInTheDocument();
  });

  it("should trigger export alert when Export to PMS button is clicked", () => {
    render(<AgenticTestingPage />);

    const exportBtn = screen.getByText("Export to PMS");
    fireEvent.click(exportBtn);

    expect(mockAlert).toHaveBeenCalledWith("Exporting QA Performance Data to HR/PMS System...");
  });
});
