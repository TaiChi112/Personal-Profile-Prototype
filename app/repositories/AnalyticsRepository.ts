import { redis } from '../lib/redis';
import { QuizRepository } from './QuizRepository';

export class AnalyticsRepository {
  private quizRepository: QuizRepository;

  constructor() {
    this.quizRepository = new QuizRepository();
  }

  async getDashboardMetrics() {
    const cacheKey = 'dashboard_metrics';
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Aggregate total attempts and accuracy from the DB via QuizRepository
    const { totalAttempts, correctAttempts } = await this.quizRepository.getMetrics();

    const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

    const metrics = {
      totalAttempts,
      accuracy,
    };

    // Cache the aggregated result in Redis for 5 minutes (300 seconds)
    await redis.setex(cacheKey, 300, JSON.stringify(metrics));

    return metrics;
  }
}
