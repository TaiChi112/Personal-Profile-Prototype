import { describe, it, expect, mock } from "bun:test";
import { render, fireEvent, waitFor } from "@testing-library/react";

// Mock next/cache
const mockRevalidatePath = mock();
mock.module("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}));

// Mock auth
const mockAuth = mock().mockResolvedValue({
  user: { id: "user-1", email: "test@test.com" },
});
mock.module("@/auth", () => ({
  auth: mockAuth,
}));
mock.module("../../../auth", () => ({
  auth: mockAuth,
}));

// Mock prisma
const mockTimeBlockPrisma = {
  findMany: mock(),
  create: mock().mockResolvedValue({ id: "tb-new", userId: "user-1", title: "New Task", start: "08:00", end: "09:00", color: "#6366F1" }),
  delete: mock().mockResolvedValue({ id: "tb-1" }),
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

import TimePie from "@/app/projects/(micro-apps)/time-block/components/TimePie";

describe("TimePie Component", () => {
  const dummyBlocks = [
    {
      id: "tb-1",
      userId: "user-1",
      title: "Work Session",
      start: "09:00",
      end: "17:00",
      color: "#6366F1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "tb-2",
      userId: "user-1",
      title: "Evening Gym",
      start: "18:00",
      end: "19:30",
      color: "#10B981",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "tb-3",
      userId: "user-1",
      title: "Night Shift",
      start: "23:00",
      end: "02:00", // Overnight wrap-around (+3 hours)
      color: "#8B5CF6",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it("should render empty state message when no time blocks exist", () => {
    const { getByText } = render(<TimePie timeBlocks={[]} />);
    expect(getByText("No time blocks added yet.")).toBeDefined();
    expect(getByText("24h")).toBeDefined(); // 24h free time
    expect(getByText("FREE TIME")).toBeDefined();
  });

  it("should calculate duration correctly including overnight wrap-around and free time", () => {
    // 9:00-17:00 = 8h, 18:00-19:30 = 1.5h, 23:00-02:00 = 3h. Total = 12.5h. Free = 11.5h.
    const { getByText } = render(<TimePie timeBlocks={dummyBlocks as any} />);
    expect(getByText("Work Session")).toBeDefined();
    expect(getByText("8 hrs")).toBeDefined();
    expect(getByText("Evening Gym")).toBeDefined();
    expect(getByText("1.5 hrs")).toBeDefined();
    expect(getByText("Night Shift")).toBeDefined();
    expect(getByText("3 hrs")).toBeDefined();
    expect(getByText("11.5h")).toBeDefined(); // (24 - 12.5)h free time
  });

  it("should handle plain numeric string start and end without colons", () => {
    const plainBlocks = [
      {
        id: "tb-plain",
        userId: "user-1",
        title: "Study",
        start: "10",
        end: "14",
        color: "#F59E0B",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    // 14 - 10 = 4 hrs. Free = 20h.
    const { getByText } = render(<TimePie timeBlocks={plainBlocks as any} />);
    expect(getByText("Study")).toBeDefined();
    expect(getByText("4 hrs")).toBeDefined();
    expect(getByText("20h")).toBeDefined();
  });

  it("should render delete buttons for each activity and trigger delete on click", async () => {
    const { getAllByText } = render(<TimePie timeBlocks={dummyBlocks as any} />);
    const deleteButtons = getAllByText("×");
    expect(deleteButtons.length).toBe(3);
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(mockTimeBlockPrisma.delete).toHaveBeenCalled();
    });
  });

  it("should render add block form fields and trigger submit action", async () => {
    const { getByPlaceholderText, getByText, container } = render(<TimePie timeBlocks={[]} />);
    expect(getByPlaceholderText("Activity Name")).toBeDefined();
    expect(getByText("Add Block")).toBeDefined();
    expect(getByText("Start")).toBeDefined();
    expect(getByText("End")).toBeDefined();

    const titleInput = container.querySelector('input[name="title"]') as HTMLInputElement;
    const startInput = container.querySelector('input[name="start"]') as HTMLInputElement;
    const endInput = container.querySelector('input[name="end"]') as HTMLInputElement;
    const submitBtn = getByText("Add Activity");

    fireEvent.change(titleInput, { target: { value: "Coding" } });
    fireEvent.change(startInput, { target: { value: "08:00" } });
    fireEvent.change(endInput, { target: { value: "10:00" } });

    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(mockTimeBlockPrisma.create).toHaveBeenCalled();
    });
  });

  it("should display warning message when total allocated time exceeds 24 hours", () => {
    const overflowBlocks = [
      {
        id: "tb-1",
        userId: "user-1",
        title: "Day Block",
        start: "00:00",
        end: "15:00", // 15 hrs
        color: "#6366F1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "tb-2",
        userId: "user-1",
        title: "Night Block",
        start: "10:00",
        end: "22:00", // 12 hrs -> total 27 hrs
        color: "#10B981",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const { getByText } = render(<TimePie timeBlocks={overflowBlocks as any} />);
    expect(getByText("Warning: You exceeded 24 hours!")).toBeDefined();
  });
});
