'use server'

import { auth } from '@/auth';
import { OnboardingRepository } from '@/lib/repositories/onboarding.repository';
import { revalidatePath } from 'next/cache';

export async function completeAppOnboarding(appId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  await OnboardingRepository.completeOnboarding(session.user.id, appId);
  
  revalidatePath('/', 'layout');
}
