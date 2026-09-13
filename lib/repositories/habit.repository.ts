import { prisma } from "../prisma";

export class HabitRepository {
  static async getStats(userId: string) {
    const stats = await prisma.habitUserStats.findUnique({
      where: { userId },
    });
    if (!stats) {
      return prisma.habitUserStats.create({
        data: { userId, level: 1, exp: 0 },
      });
    }
    return stats;
  }

  static async getHabits(userId: string) {
    return prisma.habitItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  static async addHabit(userId: string, title: string) {
    return prisma.habitItem.create({
      data: { userId, title },
    });
  }

  static async completeHabit(userId: string, habitId: string) {
    await prisma.habitItem.update({
      where: { id: habitId, userId },
      data: { done: true },
    });

    const stats = await this.getStats(userId);
    let newExp = stats.exp + 35;
    let newLevel = stats.level;
    
    if (newExp >= 100) {
      newExp -= 100;
      newLevel += 1;
    }

    return prisma.habitUserStats.update({
      where: { userId },
      data: { level: newLevel, exp: newExp },
    });
  }
}
