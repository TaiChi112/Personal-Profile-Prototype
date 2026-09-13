import Link from 'next/link';
import { OnboardingWrapper } from '@/app/components/onboarding/OnboardingWrapper';
import KanbanBoard from './components/KanbanBoard';
import { getKanbanTasks } from './actions';

export default async function Page() {
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
