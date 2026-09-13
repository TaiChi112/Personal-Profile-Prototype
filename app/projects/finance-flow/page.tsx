import Link from 'next/link';
import FinanceCalc from './components/FinanceCalc';
import { getTransactions } from './actions';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const transactions = await getTransactions();
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/projects" className="inline-block mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm">← Back</Link>
        <h1 className="text-3xl font-black mb-8 text-center text-emerald-600">FinanceFlow 💸</h1>
        <FinanceCalc initialTransactions={transactions} />
      </div>
    </div>
  );
}
