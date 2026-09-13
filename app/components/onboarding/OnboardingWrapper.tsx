import { ReactNode } from 'react';
import { auth } from '@/auth';
import { OnboardingRepository } from '@/lib/repositories/onboarding.repository';
import { OnboardingScreen } from './OnboardingScreen';

interface OnboardingWrapperProps {
  appId: string;
  appName: string;
  description?: string;
  children: ReactNode;
}

export async function OnboardingWrapper({ appId, appName, description, children }: OnboardingWrapperProps) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return <>{children}</>;
  }

  const hasOnboarded = await OnboardingRepository.hasOnboarded(session.user.id, appId);

  if (hasOnboarded) {
    return <>{children}</>;
  }

  return (
    <OnboardingScreen appId={appId} appName={appName} description={description} />
  );
}
