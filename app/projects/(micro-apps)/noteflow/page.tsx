"use client";
import Link from 'next/link';
import MarkdownEditor from './components/MarkdownEditor';
export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/projects" className="text-gray-500 hover:text-gray-900 bg-white dark:bg-gray-800 p-2 rounded-full border">Back</Link>
          <h1 className="text-3xl font-bold">NoteFlow Editor</h1>
        </div>
        <MarkdownEditor />
      </div>
    </div>
  );
}
