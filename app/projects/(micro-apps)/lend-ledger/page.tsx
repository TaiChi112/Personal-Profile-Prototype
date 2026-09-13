import Link from 'next/link';
import Ledger from './components/Ledger';
import { getRecords } from './actions';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-emerald-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-4">Lend Ledger 🤝</h1>
          <p className="text-gray-500 mb-6">Please login to manage your lendings.</p>
          <Link href="/api/auth/signin?callbackUrl=/projects/lend-ledger" className="block w-full bg-emerald-600 text-white font-bold py-3 rounded-xl">
            Login with Google
          </Link>
        </div>
      </div>
    );
  }

  const records = await getRecords();
  
  return (
    <div className="min-h-screen p-8 bg-emerald-50 dark:bg-gray-900">
      <Link href="/projects" className="inline-block mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm hover:bg-gray-50">← Back</Link>
      <Ledger records={records} />
    </div>
  );
}
