import { prisma as db } from "../prisma";

export class OnboardingRepository {
  static async hasOnboarded(userId: string, appId: string): Promise<boolean> {
    const record = await db.appOnboarding.findUnique({
      where: {
        userId_appId: {
          userId,
          appId,
        },
      },
    });
    return !!record;
  }

  static async completeOnboarding(userId: string, appId: string) {
    return await db.appOnboarding.create({
      data: {
        userId,
        appId,
      },
    });
  }
}
