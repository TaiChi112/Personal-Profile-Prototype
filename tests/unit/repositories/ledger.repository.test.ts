import { describe, it, expect, mock, beforeEach } from "bun:test";

const mockLendRecord = {
  findMany: mock(),
  findUnique: mock(),
  create: mock(),
  update: mock(),
  delete: mock(),
};

const mockPrisma = {
  lendRecord: mockLendRecord,
};

mock.module('@/lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

mock.module('../../../lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

import { LedgerRepository } from "@/lib/repositories/ledger.repository";

describe("LedgerRepository", () => {
  beforeEach(() => {
    mockLendRecord.findMany.mockReset();
    mockLendRecord.findUnique.mockReset();
    mockLendRecord.create.mockReset();
    mockLendRecord.update.mockReset();
    mockLendRecord.delete.mockReset();
  });

  it("should instantiate class correctly", () => {
    const repo = new LedgerRepository();
    expect(repo).toBeInstanceOf(LedgerRepository);
  });

  describe("getRecords", () => {
    it("should fetch lend records for user ordered by createdAt desc", async () => {
      const records = [
        { id: "rec-1", userId: "user-1", name: "Alice", item: "Book", date: "2026-01-01", returned: false },
        { id: "rec-2", userId: "user-1", name: "Bob", item: "Camera", date: "2026-01-02", returned: true },
      ];
      mockLendRecord.findMany.mockResolvedValueOnce(records);

      const result = await LedgerRepository.getRecords("user-1");

      expect(mockLendRecord.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(records);
    });
  });

  describe("addRecord", () => {
    it("should create a new lend record", async () => {
      const newRecord = {
        id: "rec-3",
        userId: "user-1",
        name: "Charlie",
        item: "Keyboard",
        date: "2026-03-01",
      };
      mockLendRecord.create.mockResolvedValueOnce(newRecord);

      const result = await LedgerRepository.addRecord("user-1", "Charlie", "Keyboard", "2026-03-01");

      expect(mockLendRecord.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          name: "Charlie",
          item: "Keyboard",
          date: "2026-03-01",
        },
      });
      expect(result).toEqual(newRecord);
    });
  });

  describe("toggleReturn", () => {
    it("should throw error if record does not exist", async () => {
      mockLendRecord.findUnique.mockResolvedValueOnce(null);

      await expect(LedgerRepository.toggleReturn("user-1", "non-existent")).rejects.toThrow(
        "Record not found or unauthorized"
      );
      expect(mockLendRecord.update).not.toHaveBeenCalled();
    });

    it("should throw error if record belongs to a different user", async () => {
      mockLendRecord.findUnique.mockResolvedValueOnce({
        id: "rec-1",
        userId: "other-user",
        returned: false,
      });

      await expect(LedgerRepository.toggleReturn("user-1", "rec-1")).rejects.toThrow(
        "Record not found or unauthorized"
      );
      expect(mockLendRecord.update).not.toHaveBeenCalled();
    });

    it("should toggle returned from false to true when authorized", async () => {
      mockLendRecord.findUnique.mockResolvedValueOnce({
        id: "rec-1",
        userId: "user-1",
        returned: false,
      });
      const updatedRecord = {
        id: "rec-1",
        userId: "user-1",
        returned: true,
      };
      mockLendRecord.update.mockResolvedValueOnce(updatedRecord);

      const result = await LedgerRepository.toggleReturn("user-1", "rec-1");

      expect(mockLendRecord.findUnique).toHaveBeenCalledWith({
        where: { id: "rec-1" },
      });
      expect(mockLendRecord.update).toHaveBeenCalledWith({
        where: { id: "rec-1" },
        data: { returned: true },
      });
      expect(result).toEqual(updatedRecord);
    });

    it("should toggle returned from true to false when authorized", async () => {
      mockLendRecord.findUnique.mockResolvedValueOnce({
        id: "rec-2",
        userId: "user-1",
        returned: true,
      });
      const updatedRecord = {
        id: "rec-2",
        userId: "user-1",
        returned: false,
      };
      mockLendRecord.update.mockResolvedValueOnce(updatedRecord);

      const result = await LedgerRepository.toggleReturn("user-1", "rec-2");

      expect(mockLendRecord.update).toHaveBeenCalledWith({
        where: { id: "rec-2" },
        data: { returned: false },
      });
      expect(result).toEqual(updatedRecord);
    });
  });

  describe("deleteRecord", () => {
    it("should throw error if record does not exist", async () => {
      mockLendRecord.findUnique.mockResolvedValueOnce(null);

      await expect(LedgerRepository.deleteRecord("user-1", "non-existent")).rejects.toThrow(
        "Record not found or unauthorized"
      );
      expect(mockLendRecord.delete).not.toHaveBeenCalled();
    });

    it("should throw error if record belongs to another user", async () => {
      mockLendRecord.findUnique.mockResolvedValueOnce({
        id: "rec-1",
        userId: "intruder",
      });

      await expect(LedgerRepository.deleteRecord("user-1", "rec-1")).rejects.toThrow(
        "Record not found or unauthorized"
      );
      expect(mockLendRecord.delete).not.toHaveBeenCalled();
    });

    it("should delete record if authorized", async () => {
      mockLendRecord.findUnique.mockResolvedValueOnce({
        id: "rec-1",
        userId: "user-1",
      });
      const deletedRecord = { id: "rec-1", userId: "user-1" };
      mockLendRecord.delete.mockResolvedValueOnce(deletedRecord);

      const result = await LedgerRepository.deleteRecord("user-1", "rec-1");

      expect(mockLendRecord.findUnique).toHaveBeenCalledWith({
        where: { id: "rec-1" },
      });
      expect(mockLendRecord.delete).toHaveBeenCalledWith({
        where: { id: "rec-1" },
      });
      expect(result).toEqual(deletedRecord);
    });
  });
});
