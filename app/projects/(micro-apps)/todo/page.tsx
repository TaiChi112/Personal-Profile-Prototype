import Link from 'next/link';
import { getTodos } from '@/app/features/todo/actions';
import TodoList from './TodoList';

export default async function TodoMiniApp() {
  const todos = await getTodos();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link 
            href="/projects" 
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-2"
          >
            &larr; Back to Projects
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Todo Mini-App
          </h1>

          <TodoList initialTodos={todos} />
        </div>
      </div>
    </div>
  );
}
