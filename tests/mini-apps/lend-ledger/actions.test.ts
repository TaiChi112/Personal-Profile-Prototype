import { describe, it, expect, mock, beforeEach } from "bun:test";

// Mock next/cache
const mockRevalidatePath = mock();
mock.module("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}));

// Mock auth
const mockAuth = mock();
mock.module("@/auth", () => ({
  auth: mockAuth,
}));
mock.module("../../../auth", () => ({
  auth: mockAuth,
}));

// Mock LedgerRepository
const mockLedgerRepository = {
  getRecords: mock(),
  addRecord: mock(),
  toggleReturn: mock(),
  deleteRecord: mock(),
};

mock.module("@/lib/repositories/ledger.repository", () => ({
  LedgerRepository: mockLedgerRepository,
}));
mock.module("../../../lib/repositories/ledger.repository", () => ({
  LedgerRepository: mockLedgerRepository,
}));

import {
  getRecords,
  addRecord,
  toggleReturn,
  deleteRecord,
} from "@/app/projects/(micro-apps)/lend-ledger/actions";

describe("Lend Ledger Server Actions", () => {
  const dummyUserId = "user-lend-456";
  const dummySession = {
    user: {
      id: dummyUserId,
      email: "lend@test.com",
    },
  };

  beforeEach(() => {
    mockRevalidatePath.mockReset();
    mockAuth.mockReset();
    mockLedgerRepository.getRecords.mockReset();
    mockLedgerRepository.addRecord.mockReset();
    mockLedgerRepository.toggleReturn.mockReset();
    mockLedgerRepository.deleteRecord.mockReset();
  });

  describe("getRecords", () => {
    it("should throw 'Unauthorized' if session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);
      await expect(getRecords()).rejects.toThrow("Unauthorized");
      expect(mockLedgerRepository.getRecords).not.toHaveBeenCalled();
    });

    it("should throw 'Unauthorized' if session has no user id", async () => {
      mockAuth.mockResolvedValueOnce({ user: {} });
      await expect(getRecords()).rejects.toThrow("Unauthorized");
      expect(mockLedgerRepository.getRecords).not.toHaveBeenCalled();
    });

    it("should return records for authorized user", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      const records = [
        { id: "1", userId: dummyUserId, name: "Alice", item: "500 Baht", date: "2026-10-01", returned: false },
      ];
      mockLedgerRepository.getRecords.mockResolvedValueOnce(records);

      const result = await getRecords();
      expect(result).toEqual(records);
      expect(mockLedgerRepository.getRecords).toHaveBeenCalledWith(dummyUserId);
    });
  });

  describe("addRecord", () => {
    it("should throw 'Unauthorized' if session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);
      await expect(addRecord("Bob", "Book", "2026-10-02")).rejects.toThrow("Unauthorized");
      expect(mockLedgerRepository.addRecord).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should add a record and revalidate path when authorized", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      const createdRecord = { id: "2", userId: dummyUserId, name: "Bob", item: "Book", date: "2026-10-02", returned: false };
      mockLedgerRepository.addRecord.mockResolvedValueOnce(createdRecord);

      const result = await addRecord("Bob", "Book", "2026-10-02");
      expect(result).toEqual(createdRecord);
      expect(mockLedgerRepository.addRecord).toHaveBeenCalledWith(dummyUserId, "Bob", "Book", "2026-10-02");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/lend-ledger");
    });
  });

  describe("toggleReturn", () => {
    it("should throw 'Unauthorized' if session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);
      await expect(toggleReturn("rec-1")).rejects.toThrow("Unauthorized");
      expect(mockLedgerRepository.toggleReturn).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should toggle record return status and revalidate path", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      const updatedRecord = { id: "rec-1", returned: true };
      mockLedgerRepository.toggleReturn.mockResolvedValueOnce(updatedRecord);

      const result = await toggleReturn("rec-1");
      expect(result).toEqual(updatedRecord);
      expect(mockLedgerRepository.toggleReturn).toHaveBeenCalledWith(dummyUserId, "rec-1");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/lend-ledger");
    });
  });

  describe("deleteRecord", () => {
    it("should throw 'Unauthorized' if session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);
      await expect(deleteRecord("rec-1")).rejects.toThrow("Unauthorized");
      expect(mockLedgerRepository.deleteRecord).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should delete record and revalidate path", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      const deletedRecord = { id: "rec-1" };
      mockLedgerRepository.deleteRecord.mockResolvedValueOnce(deletedRecord);

      const result = await deleteRecord("rec-1");
      expect(result).toEqual(deletedRecord);
      expect(mockLedgerRepository.deleteRecord).toHaveBeenCalledWith(dummyUserId, "rec-1");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/lend-ledger");
    });
  });
});
