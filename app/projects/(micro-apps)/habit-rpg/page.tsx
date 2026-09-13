import Link from 'next/link';
import RpgGame from './components/RpgGame';
import { auth } from '@/auth';
import { HabitRepository } from '@/lib/repositories/habit.repository';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-4">Habit RPG 🧙‍♂️</h1>
          <p className="text-gray-500 mb-6">Please login to save your hero's progress.</p>
          <Link href="/api/auth/signin?callbackUrl=/projects/habit-rpg" className="block w-full bg-blue-600 text-white font-bold py-3 rounded-xl">
            Login with Google
          </Link>
        </div>
      </div>
    );
  }

  const stats = await HabitRepository.getStats(session.user.id);
  const habits = await HabitRepository.getHabits(session.user.id);

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/projects" className="text-sm px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm hover:bg-gray-50">← Back</Link>
          <h1 className="text-3xl font-black text-indigo-600">Habit RPG</h1>
        </div>
        <RpgGame level={stats.level} exp={stats.exp} habits={habits} />
      </div>
    </div>
  );
}
