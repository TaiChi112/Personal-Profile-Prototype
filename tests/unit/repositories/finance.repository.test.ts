import { describe, it, expect, mock, beforeEach } from "bun:test";

const mockFinanceTransaction = {
  findMany: mock(),
  create: mock(),
  delete: mock(),
  groupBy: mock(),
};

const mockPrisma = {
  financeTransaction: mockFinanceTransaction,
};

mock.module('@/lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

mock.module('../../../lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

import { FinanceRepository } from "@/lib/repositories/finance.repository";

describe("FinanceRepository", () => {
  beforeEach(() => {
    mockFinanceTransaction.findMany.mockReset();
    mockFinanceTransaction.create.mockReset();
    mockFinanceTransaction.delete.mockReset();
    mockFinanceTransaction.groupBy.mockReset();
  });

  it("should instantiate class correctly", () => {
    const repo = new FinanceRepository();
    expect(repo).toBeInstanceOf(FinanceRepository);
  });

  describe("getTransactions", () => {
    it("should fetch user transactions ordered by createdAt desc", async () => {
      const mockResult = [
        { id: "tx-1", userId: "user-1", amount: 100, label: "Salary", type: "income" },
        { id: "tx-2", userId: "user-1", amount: 50, label: "Groceries", type: "expense" },
      ];
      mockFinanceTransaction.findMany.mockResolvedValueOnce(mockResult);

      const result = await FinanceRepository.getTransactions("user-1");

      expect(mockFinanceTransaction.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe("addTransaction", () => {
    it("should create a new transaction with supplied parameters", async () => {
      const mockCreated = {
        id: "tx-new",
        userId: "user-1",
        amount: 250,
        label: "Freelance",
        type: "income",
      };
      mockFinanceTransaction.create.mockResolvedValueOnce(mockCreated);

      const result = await FinanceRepository.addTransaction("user-1", 250, "Freelance", "income");

      expect(mockFinanceTransaction.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          amount: 250,
          label: "Freelance",
          type: "income",
        },
      });
      expect(result).toEqual(mockCreated);
    });
  });

  describe("deleteTransaction", () => {
    it("should delete a transaction by id and userId", async () => {
      const mockDeleted = { id: "tx-1", userId: "user-1" };
      mockFinanceTransaction.delete.mockResolvedValueOnce(mockDeleted);

      const result = await FinanceRepository.deleteTransaction("user-1", "tx-1");

      expect(mockFinanceTransaction.delete).toHaveBeenCalledWith({
        where: { id: "tx-1", userId: "user-1" },
      });
      expect(result).toEqual(mockDeleted);
    });
  });

  describe("getExpenseSummaryByLabel", () => {
    it("should aggregate expenses by label and sum amount", async () => {
      const mockSummary = [
        { label: "Food", _sum: { amount: 150 } },
        { label: "Transport", _sum: { amount: null } },
      ];
      mockFinanceTransaction.groupBy.mockResolvedValueOnce(mockSummary);

      const result = await FinanceRepository.getExpenseSummaryByLabel("user-1");

      expect(mockFinanceTransaction.groupBy).toHaveBeenCalledWith({
        by: ["label"],
        where: { userId: "user-1", type: "expense" },
        _sum: { amount: true },
      });
      expect(result).toEqual([
        { label: "Food", total: 150 },
        { label: "Transport", total: 0 },
      ]);
    });
  });
});
