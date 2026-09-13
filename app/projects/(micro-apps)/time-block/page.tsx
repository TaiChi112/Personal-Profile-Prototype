import Link from 'next/link';
import TimePie from './components/TimePie';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getTimeBlocks } from '@/lib/repositories/timeblock.repository';

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const timeBlocks = await getTimeBlocks(session.user.id);

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-950">
      <Link href="/projects" className="inline-block mb-8 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm">← Back</Link>
      <TimePie timeBlocks={timeBlocks} />
    </div>
  );
}
