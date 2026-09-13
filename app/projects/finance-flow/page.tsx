import Link from 'next/link';
import { OnboardingWrapper } from '@/app/components/onboarding/OnboardingWrapper';
import FinanceCalc from './components/FinanceCalc';
import { getTransactions, getExpenseSummary } from './actions';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const session = await auth();
  
  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-4">FinanceFlow 💸</h1>
          <p className="text-gray-500 mb-6">Please login to manage your finances.</p>
          <Link href="/api/auth/signin?callbackUrl=/projects/finance-flow" className="block w-full bg-blue-600 text-white font-bold py-3 rounded-xl">
            Login with Google
          </Link>
        </div>
      </div>
    )
  }

  const transactions = await getTransactions();
  const analytics = await getExpenseSummary();
  return (
    <OnboardingWrapper appId="finance-flow" appName="FinanceFlow" description="Track your expenses and income across your AI OS.">
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto space-y-8">
          <Link href="/projects" className="inline-block mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm">← Back</Link>
          <h1 className="text-3xl font-black mb-8 text-center text-emerald-600">FinanceFlow 💸</h1>
          <FinanceCalc initialTransactions={transactions} user={session.user} analytics={analytics} />
        </div>
      </div>
    </OnboardingWrapper>
  );
}
