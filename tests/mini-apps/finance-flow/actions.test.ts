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

import { prisma } from "@/lib/prisma";

const mockFinanceTransaction = {
  findMany: mock(),
  create: mock(),
  delete: mock(),
  groupBy: mock(),
};

(prisma as any).financeTransaction = mockFinanceTransaction;

import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getExpenseSummary,
} from "@/app/projects/(micro-apps)/finance-flow/actions";

describe("Finance Flow Server Actions", () => {
  const dummyUserId = "user-finance-123";
  const dummySession = {
    user: {
      id: dummyUserId,
      email: "finance@test.com",
      name: "Finance User",
    },
  };

  beforeEach(() => {
    mockRevalidatePath.mockReset();
    mockAuth.mockReset();
    mockFinanceTransaction.findMany.mockReset();
    mockFinanceTransaction.create.mockReset();
    mockFinanceTransaction.delete.mockReset();
    mockFinanceTransaction.groupBy.mockReset();
  });

  describe("getTransactions", () => {
    it("should throw Unauthorized if session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);

      await expect(getTransactions()).rejects.toThrow("Unauthorized");
      expect(mockFinanceTransaction.findMany).not.toHaveBeenCalled();
    });

    it("should throw Unauthorized if session has no user", async () => {
      mockAuth.mockResolvedValueOnce({ expires: "2099-01-01" });

      await expect(getTransactions()).rejects.toThrow("Unauthorized");
      expect(mockFinanceTransaction.findMany).not.toHaveBeenCalled();
    });

    it("should throw Unauthorized if session.user has no id", async () => {
      mockAuth.mockResolvedValueOnce({ user: { email: "no-id@test.com" } });

      await expect(getTransactions()).rejects.toThrow("Unauthorized");
      expect(mockFinanceTransaction.findMany).not.toHaveBeenCalled();
    });

    it("should return transactions for the authenticated user ordered by createdAt desc", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      const mockTxList = [
        {
          id: "tx-1",
          amount: 5000,
          label: "Salary",
          type: "income",
          userId: dummyUserId,
          createdAt: new Date("2026-10-01"),
        },
        {
          id: "tx-2",
          amount: 120,
          label: "Groceries",
          type: "expense",
          userId: dummyUserId,
          createdAt: new Date("2026-09-30"),
        },
      ];
      mockFinanceTransaction.findMany.mockResolvedValueOnce(mockTxList);

      const result = await getTransactions();

      expect(mockAuth).toHaveBeenCalled();
      expect(mockFinanceTransaction.findMany).toHaveBeenCalledWith({
        where: { userId: dummyUserId },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockTxList);
    });
  });

  describe("addTransaction", () => {
    it("should throw Unauthorized if session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);

      await expect(addTransaction(100, "Dinner", "expense")).rejects.toThrow("Unauthorized");
      expect(mockFinanceTransaction.create).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw Unauthorized if session has no user or user.id", async () => {
      mockAuth.mockResolvedValueOnce({ user: {} });

      await expect(addTransaction(50, "Coffee", "expense")).rejects.toThrow("Unauthorized");
      expect(mockFinanceTransaction.create).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should create a new transaction and revalidate path when authorized", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      mockFinanceTransaction.create.mockResolvedValueOnce({
        id: "tx-new",
        amount: 300,
        label: "Freelance",
        type: "income",
        userId: dummyUserId,
      });

      await addTransaction(300, "Freelance", "income");

      expect(mockFinanceTransaction.create).toHaveBeenCalledWith({
        data: {
          amount: 300,
          label: "Freelance",
          type: "income",
          userId: dummyUserId,
        },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/finance-flow");
    });
  });

  describe("deleteTransaction", () => {
    it("should throw Unauthorized if session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);

      await expect(deleteTransaction("tx-1")).rejects.toThrow("Unauthorized");
      expect(mockFinanceTransaction.delete).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw Unauthorized if session.user has no id", async () => {
      mockAuth.mockResolvedValueOnce({ user: { name: "Anon" } });

      await expect(deleteTransaction("tx-1")).rejects.toThrow("Unauthorized");
      expect(mockFinanceTransaction.delete).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should delete transaction scoped to userId and revalidate path when authorized", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      mockFinanceTransaction.delete.mockResolvedValueOnce({
        id: "tx-1",
        userId: dummyUserId,
      });

      await deleteTransaction("tx-1");

      expect(mockFinanceTransaction.delete).toHaveBeenCalledWith({
        where: {
          id: "tx-1",
          userId: dummyUserId,
        },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/finance-flow");
    });
  });

  describe("getExpenseSummary", () => {
    it("should return empty array if session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);

      const result = await getExpenseSummary();

      expect(result).toEqual([]);
      expect(mockFinanceTransaction.groupBy).not.toHaveBeenCalled();
    });

    it("should return empty array if session user has no id", async () => {
      mockAuth.mockResolvedValueOnce({ user: {} });

      const result = await getExpenseSummary();

      expect(result).toEqual([]);
      expect(mockFinanceTransaction.groupBy).not.toHaveBeenCalled();
    });

    it("should aggregate expenses by label correctly", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      const mockGroupByResult = [
        { label: "Rent", _sum: { amount: 1500 } },
        { label: "Food", _sum: { amount: 450 } },
      ];
      mockFinanceTransaction.groupBy.mockResolvedValueOnce(mockGroupByResult);

      const result = await getExpenseSummary();

      expect(mockFinanceTransaction.groupBy).toHaveBeenCalledWith({
        by: ["label"],
        where: { userId: dummyUserId, type: "expense" },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
      });
      expect(result).toEqual([
        { label: "Rent", total: 1500 },
        { label: "Food", total: 450 },
      ]);
    });

    it("should handle _sum.amount being null or 0 with fallback to 0", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      const mockGroupByResult = [
        { label: "ZeroExpense", _sum: { amount: 0 } },
        { label: "NullExpense", _sum: { amount: null } },
        { label: "UndefinedExpense", _sum: {} },
      ];
      mockFinanceTransaction.groupBy.mockResolvedValueOnce(mockGroupByResult);

      const result = await getExpenseSummary();

      expect(result).toEqual([
        { label: "ZeroExpense", total: 0 },
        { label: "NullExpense", total: 0 },
        { label: "UndefinedExpense", total: 0 },
      ]);
    });
  });
});
