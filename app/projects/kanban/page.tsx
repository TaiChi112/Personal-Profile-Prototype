import Link from 'next/link';
import { OnboardingWrapper } from '@/app/components/onboarding/OnboardingWrapper';
import KanbanBoard from './components/KanbanBoard';
import { getKanbanTasks } from './actions';
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  
  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-4">Kanban Board 📋</h1>
          <p className="text-gray-500 mb-6">Please login to manage your tasks.</p>
          <Link href="/api/auth/signin?callbackUrl=/projects/kanban" className="block w-full bg-blue-600 text-white font-bold py-3 rounded-xl">
            Login with Google
          </Link>
        </div>
      </div>
    )
  }

  const tasks = await getKanbanTasks();

  return (
    <OnboardingWrapper appId="kanban" appName="Kanban Board" description="Organize your tasks efficiently.">
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Link href="/projects" className="text-sm px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm hover:bg-gray-50">← Back</Link>
            <h1 className="text-3xl font-black">Kanban Board</h1>
          </div>
          <KanbanBoard initialTasks={tasks} />
        </div>
      </div>
    </OnboardingWrapper>
  );
}
