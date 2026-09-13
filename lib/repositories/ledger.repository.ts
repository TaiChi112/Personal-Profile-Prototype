import { prisma } from '@/lib/prisma';

export class LedgerRepository {
  static async getRecords(userId: string) {
    return await prisma.lendRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async addRecord(userId: string, name: string, item: string, date: string) {
    return await prisma.lendRecord.create({
      data: { userId, name, item, date }
    });
  }

  static async toggleReturn(userId: string, id: string) {
    const record = await prisma.lendRecord.findUnique({
      where: { id }
    });
    // Check if the record belongs to user
    if (!record || record.userId !== userId) {
        throw new Error("Record not found or unauthorized");
    }
    return await prisma.lendRecord.update({
      where: { id },
      data: { returned: !record.returned }
    });
  }

  static async deleteRecord(userId: string, id: string) {
    const record = await prisma.lendRecord.findUnique({
      where: { id }
    });
    if (!record || record.userId !== userId) {
        throw new Error("Record not found or unauthorized");
    }
    return await prisma.lendRecord.delete({
      where: { id }
    });
  }
}
