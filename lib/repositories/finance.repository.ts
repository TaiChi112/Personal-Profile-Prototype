import { prisma } from '@/lib/prisma';

export class FinanceRepository {
  static async getTransactions(userId: string) {
    return await prisma.financeTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async addTransaction(userId: string, amount: number, label: string, type: string) {
    return await prisma.financeTransaction.create({
      data: { amount, label, type, userId }
    });
  }

  static async deleteTransaction(userId: string, id: string) {
    return await prisma.financeTransaction.delete({
      where: { id, userId }
    });
  }

  static async getExpenseSummaryByLabel(userId: string) {
    const summary = await prisma.financeTransaction.groupBy({
      by: ['label'],
      where: { userId, type: 'expense' },
      _sum: { amount: true }
    });
    return summary.map(item => ({
      label: item.label,
      total: item._sum.amount || 0
    }));
  }
}
