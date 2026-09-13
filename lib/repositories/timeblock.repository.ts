import { prisma } from '@/lib/prisma';
import { TimeBlock } from '@prisma/client';

export async function getTimeBlocks(userId: string): Promise<TimeBlock[]> {
  return prisma.timeBlock.findMany({
    where: { userId },
    orderBy: { start: 'asc' },
  });
}

export async function addTimeBlock(data: { userId: string; title: string; start: string; end: string; color: string }): Promise<TimeBlock> {
  return prisma.timeBlock.create({
    data,
  });
}

export async function deleteTimeBlock(id: string, userId: string): Promise<TimeBlock> {
  return prisma.timeBlock.delete({
    where: { id, userId },
  });
}
