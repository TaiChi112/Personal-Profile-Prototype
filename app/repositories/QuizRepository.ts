import prisma from '../../lib/prisma';
import { redis } from '../lib/redis';
import { QuizScore } from '@prisma/client';

export class QuizRepository {
  private static CACHE_KEY = 'quiz_scores';
  private static CACHE_TTL = 60; // 60 seconds

  async getMetrics() {
    const totalAttempts = await prisma.quizScore.count();
    const correctAttempts = await prisma.quizScore.count({
      where: {
        isCorrect: true,
      },
    });

    return {
      totalAttempts,
      correctAttempts,
    };
  }

  public async getScores(): Promise<QuizScore[]> {
    try {
      const cachedData = await redis.get(QuizRepository.CACHE_KEY);

      if (cachedData) {
        return JSON.parse(cachedData) as QuizScore[];
      }

      const scores = await prisma.quizScore.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      await redis.set(QuizRepository.CACHE_KEY, JSON.stringify(scores), 'EX', QuizRepository.CACHE_TTL);

      return scores;
    } catch (error) {
      console.error('Error in getScores:', error);
      // Return empty array to prevent crashes
      return [];
    }
  }

  public async saveScore(data: {
    question: string;
    isCorrect: boolean;
    userId?: string | null;
    sessionId?: string | null;
  }): Promise<QuizScore | null> {
    try {
      const newScore = await prisma.quizScore.create({
        data,
      });

      // Invalidate cache when a new score is saved
      await redis.del(QuizRepository.CACHE_KEY);

      return newScore;
    } catch (error) {
      console.error('Error in saveScore:', error);
      return null;
    }
  }
}
