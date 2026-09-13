import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { OnboardingRepository } from "../../../lib/repositories/onboarding.repository";
import { prisma } from "../../../lib/prisma";

describe("Onboarding Repository Tests", () => {
  const testUserId = "test-onboarding-user-id";
  const testUserEmail = "onboarding@test.com";
  const testAppId = "test-app-id";

  beforeAll(async () => {
    await prisma.appOnboarding.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId }});
    await prisma.user.create({
      data: { id: testUserId, email: testUserEmail },
    });
  });

  afterAll(async () => {
    await prisma.appOnboarding.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId }});
  });

  it("hasOnboarded returns false initially", async () => {
    const hasOnboarded = await OnboardingRepository.hasOnboarded(testUserId, testAppId);
    expect(hasOnboarded).toBe(false);
  });

  it("completeOnboarding succeeds", async () => {
    const record = await OnboardingRepository.completeOnboarding(testUserId, testAppId);
    expect(record.userId).toBe(testUserId);
    expect(record.appId).toBe(testAppId);
  });

  it("hasOnboarded returns true afterwards", async () => {
    const hasOnboarded = await OnboardingRepository.hasOnboarded(testUserId, testAppId);
    expect(hasOnboarded).toBe(true);
  });
});
