import { describe, it, expect, mock, beforeEach } from "bun:test";

const mockGenerateObject = mock();
mock.module("ai", () => ({
  generateObject: mockGenerateObject,
}));

mock.module("@ai-sdk/google", () => ({
  google: mock().mockReturnValue("mock-model"),
}));

import { POST } from "@/app/api/agentic-testing/intent/route";

describe("Agentic Testing Intent API Route", () => {
  beforeEach(() => {
    mockGenerateObject.mockReset();
  });

  it("should process intent and return updated graph schema", async () => {
    const mockOutput = {
      nodesToAdd: [{ id: "node-101", label: "Verify Email" }],
      edgesToAdd: [{ id: "e-new", source: "1", target: "node-101" }],
      edgesToRemove: ["e1-2"],
      impact: {
        testCasesAdded: 4,
        complexityIncrease: 12,
        logMessage: "Added email verification step",
      },
    };

    mockGenerateObject.mockResolvedValueOnce({
      object: mockOutput,
    });

    const req = new Request("http://localhost:3000/api/agentic-testing/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Add email verification before checkout",
        currentNodes: [{ id: "1", data: { label: "Order Placed" } }],
        currentEdges: [{ id: "e1-2", source: "1", target: "2" }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toEqual(mockOutput);
    expect(mockGenerateObject).toHaveBeenCalled();
  });

  it("should return 500 when AI generation fails", async () => {
    mockGenerateObject.mockRejectedValueOnce(new Error("AI generation failure"));

    const req = new Request("http://localhost:3000/api/agentic-testing/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Invalid intent",
        currentNodes: [],
        currentEdges: [],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data).toEqual({ error: "Failed to process intent" });
  });
});
