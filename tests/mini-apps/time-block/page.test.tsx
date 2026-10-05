import { describe, it, expect, mock, beforeEach } from "bun:test";
import React from "react";
import { render } from "@testing-library/react";

// Mock next/navigation redirect
const mockRedirect = mock((path: string) => {
  throw new Error(`REDIRECT:${path}`);
});
mock.module("next/navigation", () => ({
  redirect: mockRedirect,
}));

// Mock auth
let mockAuthSession: any = null;
mock.module("@/auth", () => ({
  auth: () => Promise.resolve(mockAuthSession),
}));
mock.module("../../../auth", () => ({
  auth: () => Promise.resolve(mockAuthSession),
}));

// Mock prisma
const mockTimeBlockPrisma = {
  findMany: mock().mockResolvedValue([]),
  create: mock(),
  delete: mock(),
};
const mockPrisma = {
  timeBlock: mockTimeBlockPrisma,
};
mock.module("@/lib/prisma", () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));
mock.module("../../../lib/prisma", () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

import Page from "@/app/projects/(micro-apps)/time-block/page";

describe("Time Block Page Component", () => {
  beforeEach(() => {
    mockRedirect.mockClear();
    mockTimeBlockPrisma.findMany.mockClear();
  });

  it("should redirect to /api/auth/signin if user is not authenticated", async () => {
    mockAuthSession = null;
    expect(Page()).rejects.toThrow("REDIRECT:/api/auth/signin");
    expect(mockRedirect).toHaveBeenCalledWith("/api/auth/signin");
  });

  it("should redirect if session exists but user has no id", async () => {
    mockAuthSession = { user: {} };
    expect(Page()).rejects.toThrow("REDIRECT:/api/auth/signin");
    expect(mockRedirect).toHaveBeenCalledWith("/api/auth/signin");
  });

  it("should fetch timeblocks and render page when user is authenticated", async () => {
    mockAuthSession = { user: { id: "user-123", name: "Test User" } };
    mockTimeBlockPrisma.findMany.mockResolvedValue([
      {
        id: "tb-1",
        userId: "user-123",
        title: "Coding Session",
        start: "10:00",
        end: "12:00",
        color: "#6366F1",
      },
    ]);

    const pageElement = await Page();
    const { getByText } = render(pageElement);

    expect(mockTimeBlockPrisma.findMany).toHaveBeenCalledWith({
      where: { userId: "user-123" },
      orderBy: { start: "asc" },
    });
    expect(getByText("← Back")).toBeDefined();
    expect(getByText("Coding Session")).toBeDefined();
  });
});
