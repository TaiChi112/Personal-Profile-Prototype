import { describe, it, expect, mock, beforeEach } from "bun:test";

const mockQuizScore = {
  findMany: mock(),
};

const mockPrisma = {
  quizScore: mockQuizScore,
};

mock.module('@/lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

mock.module('../../../lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

import { AnalyticsRepository } from "@/lib/repositories/analytics.repository";

describe("AnalyticsRepository", () => {
  beforeEach(() => {
    mockQuizScore.findMany.mockReset();
  });

  it("should instantiate class correctly", () => {
    const repo = new AnalyticsRepository();
    expect(repo).toBeInstanceOf(AnalyticsRepository);
  });

  it("should return correct metrics when there are quiz scores", async () => {
    const fakeScores = [
      { id: "score-1", isCorrect: true, createdAt: new Date("2026-01-01") },
      { id: "score-2", isCorrect: true, createdAt: new Date("2026-01-02") },
      { id: "score-3", isCorrect: false, createdAt: new Date("2026-01-03") },
    ];
    mockQuizScore.findMany.mockResolvedValueOnce(fakeScores);

    const result = await AnalyticsRepository.getDashboardMetrics();

    expect(mockQuizScore.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
    });
    expect(result.scores).toEqual(fakeScores);
    expect(result.totalAttempts).toBe(3);
    expect(result.correctAttempts).toBe(2);
    expect(result.overallAccuracy).toBe(67); // Math.round((2 / 3) * 100)
  });

  it("should handle empty quiz scores without divide-by-zero", async () => {
    mockQuizScore.findMany.mockResolvedValueOnce([]);

    const result = await AnalyticsRepository.getDashboardMetrics();

    expect(mockQuizScore.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
    });
    expect(result.scores).toEqual([]);
    expect(result.totalAttempts).toBe(0);
    expect(result.correctAttempts).toBe(0);
    expect(result.overallAccuracy).toBe(0);
  });
});
