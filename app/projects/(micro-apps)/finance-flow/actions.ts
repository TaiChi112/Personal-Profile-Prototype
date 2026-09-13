"use server";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function getTransactions() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  return await prisma.financeTransaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });
}

export async function addTransaction(amount: number, label: string, type: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.financeTransaction.create({
    data: { amount, label, type, userId: session.user.id }
  });
  revalidatePath('/projects/finance-flow');
}

export async function deleteTransaction(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.financeTransaction.delete({
    where: { id, userId: session.user.id }
  });
  revalidatePath('/projects/finance-flow');
}

export async function getExpenseSummary() {
  const session = await auth();
  if (!session?.user?.id) return [];
  const result = await prisma.financeTransaction.groupBy({
    by: ['label'],
    where: { userId: session.user.id, type: 'expense' },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } }
  });
  return result.map((r: any) => ({ label: r.label, total: r._sum.amount || 0 }));
}
