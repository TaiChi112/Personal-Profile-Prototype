import Link from 'next/link';
import MarkdownEditor from './components/MarkdownEditor';
import { auth } from '@/auth';
import { NoteFlowRepository } from '@/lib/repositories/noteflow.repository';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-4">NoteFlow 📝</h1>
          <p className="text-gray-500 mb-6">Please login to save your notes.</p>
          <Link href="/api/auth/signin?callbackUrl=/projects/noteflow" className="block w-full bg-blue-600 text-white font-bold py-3 rounded-xl">
            Login with Google
          </Link>
        </div>
      </div>
    );
  }

  const notes = await NoteFlowRepository.getNotes(session.user.id);

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/projects" className="text-sm px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm hover:bg-gray-50">← Back</Link>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">NoteFlow Editor</h1>
        </div>
        <MarkdownEditor initialNotes={notes} />
      </div>
    </div>
  );
}
