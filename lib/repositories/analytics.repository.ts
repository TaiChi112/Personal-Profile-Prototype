import prisma from '@/lib/prisma';

export class AnalyticsRepository {
  static async getDashboardMetrics() {
    const scores = await prisma.quizScore.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const totalAttempts = scores.length;
    const correctAttempts = scores.filter((score) => score.isCorrect).length;
    const overallAccuracy =
      totalAttempts > 0
        ? Math.round((correctAttempts / totalAttempts) * 100)
        : 0;

    return {
      scores,
      totalAttempts,
      correctAttempts,
      overallAccuracy,
    };
  }
}
