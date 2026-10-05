import { describe, it, expect, mock, beforeEach } from "bun:test";

// Mock prisma
const mockTimeBlock = {
  findMany: mock(),
  create: mock(),
  delete: mock(),
};

const mockPrisma = {
  timeBlock: mockTimeBlock,
};

mock.module("@/lib/prisma", () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));
mock.module("../../../lib/prisma", () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

import {
  getTimeBlocks,
  addTimeBlock,
  deleteTimeBlock,
} from "@/lib/repositories/timeblock.repository";

describe("TimeBlock Repository", () => {
  const dummyUserId = "user-123";

  beforeEach(() => {
    mockTimeBlock.findMany.mockReset();
    mockTimeBlock.create.mockReset();
    mockTimeBlock.delete.mockReset();
  });

  it("getTimeBlocks should query database ordered by start time ascending", async () => {
    const dummyBlocks = [
      { id: "1", userId: dummyUserId, title: "Breakfast", start: "08:00", end: "08:30", color: "#F59E0B" },
      { id: "2", userId: dummyUserId, title: "Coding", start: "09:00", end: "12:00", color: "#6366F1" },
    ];
    mockTimeBlock.findMany.mockResolvedValueOnce(dummyBlocks);

    const result = await getTimeBlocks(dummyUserId);

    expect(mockTimeBlock.findMany).toHaveBeenCalledWith({
      where: { userId: dummyUserId },
      orderBy: { start: "asc" },
    });
    expect(result).toEqual(dummyBlocks as any);
  });

  it("addTimeBlock should insert new timeblock into database", async () => {
    const inputData = {
      userId: dummyUserId,
      title: "Team Standup",
      start: "10:00",
      end: "10:30",
      color: "#10B981",
    };
    const createdRecord = { id: "new-id", ...inputData };
    mockTimeBlock.create.mockResolvedValueOnce(createdRecord);

    const result = await addTimeBlock(inputData);

    expect(mockTimeBlock.create).toHaveBeenCalledWith({
      data: inputData,
    });
    expect(result).toEqual(createdRecord as any);
  });

  it("deleteTimeBlock should delete timeblock by id and userId", async () => {
    const deletedRecord = {
      id: "del-id",
      userId: dummyUserId,
      title: "Review",
      start: "16:00",
      end: "17:00",
      color: "#EF4444",
    };
    mockTimeBlock.delete.mockResolvedValueOnce(deletedRecord);

    const result = await deleteTimeBlock("del-id", dummyUserId);

    expect(mockTimeBlock.delete).toHaveBeenCalledWith({
      where: { id: "del-id", userId: dummyUserId },
    });
    expect(result).toEqual(deletedRecord as any);
  });
});
