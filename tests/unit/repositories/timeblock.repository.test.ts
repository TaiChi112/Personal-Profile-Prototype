import { describe, it, expect, mock, beforeEach } from "bun:test";

const mockTimeBlock = {
  findMany: mock(),
  create: mock(),
  delete: mock(),
};

const mockPrisma = {
  timeBlock: mockTimeBlock,
};

mock.module('@/lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

mock.module('../../../lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

import {
  getTimeBlocks,
  addTimeBlock,
  deleteTimeBlock,
} from "@/lib/repositories/timeblock.repository";

describe("TimeBlockRepository", () => {
  beforeEach(() => {
    mockTimeBlock.findMany.mockReset();
    mockTimeBlock.create.mockReset();
    mockTimeBlock.delete.mockReset();
  });

  describe("getTimeBlocks", () => {
    it("should fetch timeblocks for a user ordered by start asc", async () => {
      const mockBlocks = [
        { id: "tb-1", userId: "user-1", title: "Focus Time", start: "09:00", end: "10:00", color: "#blue" },
        { id: "tb-2", userId: "user-1", title: "Lunch", start: "12:00", end: "13:00", color: "#green" },
      ];
      mockTimeBlock.findMany.mockResolvedValueOnce(mockBlocks);

      const result = await getTimeBlocks("user-1");

      expect(mockTimeBlock.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { start: "asc" },
      });
      expect(result).toEqual(mockBlocks as any);
    });
  });

  describe("addTimeBlock", () => {
    it("should create a new timeblock", async () => {
      const input = {
        userId: "user-1",
        title: "Team Standup",
        start: "10:00",
        end: "10:30",
        color: "#orange",
      };
      const createdBlock = { id: "tb-3", ...input };
      mockTimeBlock.create.mockResolvedValueOnce(createdBlock);

      const result = await addTimeBlock(input);

      expect(mockTimeBlock.create).toHaveBeenCalledWith({
        data: input,
      });
      expect(result).toEqual(createdBlock as any);
    });
  });

  describe("deleteTimeBlock", () => {
    it("should delete timeblock matching id and userId", async () => {
      const deletedBlock = {
        id: "tb-1",
        userId: "user-1",
        title: "Focus Time",
        start: "09:00",
        end: "10:00",
        color: "#blue",
      };
      mockTimeBlock.delete.mockResolvedValueOnce(deletedBlock);

      const result = await deleteTimeBlock("tb-1", "user-1");

      expect(mockTimeBlock.delete).toHaveBeenCalledWith({
        where: { id: "tb-1", userId: "user-1" },
      });
      expect(result).toEqual(deletedBlock as any);
    });
  });
});
