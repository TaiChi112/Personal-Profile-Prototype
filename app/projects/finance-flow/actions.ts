"use server";
import { prisma } from '../../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getTransactions() {
  return await prisma.financeTransaction.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function addTransaction(amount: number, label: string, type: string) {
  await prisma.financeTransaction.create({
    data: { amount, label, type }
  });
  revalidatePath('/projects/finance-flow');
}

export async function deleteTransaction(id: string) {
  await prisma.financeTransaction.delete({
    where: { id }
  });
  revalidatePath('/projects/finance-flow');
}
