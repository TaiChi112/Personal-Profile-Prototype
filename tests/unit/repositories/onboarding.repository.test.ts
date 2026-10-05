import { describe, it, expect, mock, beforeEach } from "bun:test";

const mockAppOnboarding = {
  findUnique: mock(),
  create: mock(),
};

const mockPrisma = {
  appOnboarding: mockAppOnboarding,
};

mock.module('@/lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

mock.module('../../../lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

import { OnboardingRepository } from "@/lib/repositories/onboarding.repository";

describe("OnboardingRepository", () => {
  beforeEach(() => {
    mockAppOnboarding.findUnique.mockReset();
    mockAppOnboarding.create.mockReset();
  });

  it("should instantiate class correctly", () => {
    const repo = new OnboardingRepository();
    expect(repo).toBeInstanceOf(OnboardingRepository);
  });

  describe("hasOnboarded", () => {
    it("should return true when onboarding record exists", async () => {
      mockAppOnboarding.findUnique.mockResolvedValueOnce({
        id: "onboard-1",
        userId: "user-1",
        appId: "finance-flow",
      });

      const result = await OnboardingRepository.hasOnboarded("user-1", "finance-flow");

      expect(mockAppOnboarding.findUnique).toHaveBeenCalledWith({
        where: {
          userId_appId: {
            userId: "user-1",
            appId: "finance-flow",
          },
        },
      });
      expect(result).toBe(true);
    });

    it("should return false when onboarding record does not exist", async () => {
      mockAppOnboarding.findUnique.mockResolvedValueOnce(null);

      const result = await OnboardingRepository.hasOnboarded("user-1", "kanban");

      expect(mockAppOnboarding.findUnique).toHaveBeenCalledWith({
        where: {
          userId_appId: {
            userId: "user-1",
            appId: "kanban",
          },
        },
      });
      expect(result).toBe(false);
    });
  });

  describe("completeOnboarding", () => {
    it("should create an onboarding record", async () => {
      const createdRecord = {
        id: "onboard-2",
        userId: "user-1",
        appId: "noteflow",
      };
      mockAppOnboarding.create.mockResolvedValueOnce(createdRecord);

      const result = await OnboardingRepository.completeOnboarding("user-1", "noteflow");

      expect(mockAppOnboarding.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          appId: "noteflow",
        },
      });
      expect(result).toEqual(createdRecord);
    });
  });
});
