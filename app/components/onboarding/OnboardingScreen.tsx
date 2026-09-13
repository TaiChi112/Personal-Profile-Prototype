'use client'

import { useTransition } from 'react';
import { completeAppOnboarding } from './actions';

interface OnboardingScreenProps {
  appId: string;
  appName: string;
  description?: string;
}

export function OnboardingScreen({ appId, appName, description }: OnboardingScreenProps) {
  const [isPending, startTransition] = useTransition();

  const handleInitialize = () => {
    startTransition(() => {
      completeAppOnboarding(appId);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="w-full max-w-md p-8 bg-white/10 dark:bg-black/20 border border-white/20 shadow-2xl rounded-2xl backdrop-blur-lg flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Welcome to {appName}</h1>
        {description && <p className="text-gray-200 mb-8">{description}</p>}
        
        <button
          onClick={handleInitialize}
          disabled={isPending}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-50 flex items-center gap-2"
        >
          {isPending ? 'Initializing...' : 'Initialize App'}
        </button>
      </div>
    </div>
  );
}
