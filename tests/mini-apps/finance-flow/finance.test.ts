import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { FinanceRepository } from "../../../lib/repositories/finance.repository";
import { prisma } from "../../../lib/prisma";

describe("Finance Repository Tests", () => {
  const testUserId = "test-user-id";
  const testUserEmail = "test@test.com";

  beforeAll(async () => {
    await prisma.financeTransaction.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId }});
    await prisma.user.create({
      data: { id: testUserId, email: testUserEmail },
    });
  });

  afterAll(async () => {
    await prisma.financeTransaction.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId }});
  });

  it("addTransaction correctly adds income and expense", async () => {
    const income = await FinanceRepository.addTransaction(testUserId, 1000, "Salary", "income");
    const expense = await FinanceRepository.addTransaction(testUserId, 50, "Food", "expense");

    expect(income.amount).toBe(1000);
    expect(income.type).toBe("income");
    expect(income.label).toBe("Salary");
    
    expect(expense.amount).toBe(50);
    expect(expense.type).toBe("expense");
    expect(expense.label).toBe("Food");
  });

  it("getExpenseSummaryByLabel correctly groups and sums the expenses", async () => {
    await FinanceRepository.addTransaction(testUserId, 20, "Food", "expense");
    await FinanceRepository.addTransaction(testUserId, 30, "Food", "expense");
    await FinanceRepository.addTransaction(testUserId, 100, "Utilities", "expense");

    const summary = await FinanceRepository.getExpenseSummaryByLabel(testUserId);
    
    const foodSummary = summary.find(item => item.label === "Food");
    const utilitiesSummary = summary.find(item => item.label === "Utilities");

    expect(foodSummary).toBeDefined();
    expect(foodSummary?.total).toBe(100);

    expect(utilitiesSummary).toBeDefined();
    expect(utilitiesSummary?.total).toBe(100);
  });
});
