import React from 'react';

const COMMITS = [
  {
    id: "dde551bc815b3c2fe6337de5106bebaca7b88f02",
    message: "chore: Wave 7 The Grand DDIA Audit (30 Subagents Parallel Execution)",
    author: "AI Agent",
    date: "2026-09-10T14:00:33Z"
  },
  {
    id: "1b2d2d18fb6a9a8b76b01ccb06e8932f1e2aaaca",
    message: "feat: Wave 6 Ultra-Scale Over-Engineering (Multi-Tenant, Vector RAG, CRDT, Wasm, Event Sourcing)",
    author: "AI Agent",
    date: "2026-09-10T13:43:43Z"
  },
  {
    id: "25b87aabd29a2906bfd68cbfac805c058ef7ee6f",
    message: "feat: Google-Scale Over-Engineering (BullMQ, GraphQL, PWA, OpenTelemetry, SSE WebSockets)",
    author: "AI Agent",
    date: "2026-09-10T08:29:48Z"
  }
];

export function LiveGitActivity() {
  return (
    <div className="mt-16 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-8 text-center">Live Git Activity</h2>
      <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 md:ml-0">
        {COMMITS.map((commit, index) => (
          <div key={commit.id} className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
              </svg>
            </span>
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {commit.message}
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  {new Date(commit.date).toLocaleString()}
                </time>
              </div>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Authored by <span className="font-medium text-gray-900 dark:text-white">{commit.author}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
