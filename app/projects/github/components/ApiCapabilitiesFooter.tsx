import React from 'react';

export default function ApiCapabilitiesFooter() {
  return (
    <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800 pb-10">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Explore the GitHub Public API Menu
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          The GitHub Explorer above is just a glimpse of what's possible. Below is a comprehensive list of all data points and features available through the GitHub REST v3 API that we could potentially implement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Category 1: User-Level Data */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </span>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">User Analytics</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span><strong>Profile Foundation:</strong> Avatar, Bio, Company, Location, Admin status.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span><strong>Top Languages:</strong> Extracted from analyzing all public repositories.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span><strong>Starred Repos:</strong> Tech interests and bookmarks.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span><strong>Organizations:</strong> Open-source orgs or companies they belong to.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span><strong>Activity Feed:</strong> 90-day real-time events (Push, Pull Request, Issue Comments).</span>
            </li>
          </ul>
        </div>

        {/* Category 2: Repository-Level Data */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
              </svg>
            </span>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Repository Deep Dive</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span><strong>Core Info:</strong> Description, License, Default branch, Watchers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span><strong>Languages Breakdown:</strong> Exact byte count of every language used.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span><strong>Contributors:</strong> List of developers sorted by commit count.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span><strong>Commits History:</strong> The entire git log (Author, Date, Message, SHA).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span><strong>Issues & PRs:</strong> Bug reports, labels, open/closed status, assignees.</span>
            </li>
          </ul>
        </div>

        {/* Category 3: Specialized Data */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
            </span>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Specialized Metadata</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">•</span>
              <span><strong>Contribution Graph:</strong> (Requires GraphQL or SVG generation).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">•</span>
              <span><strong>Releases & Tags:</strong> Version history and download links for assets.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">•</span>
              <span><strong>Forks & Clones:</strong> Who forked the project and when (Clones require push access).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">•</span>
              <span><strong>Workflows:</strong> GitHub Actions run history and status.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">•</span>
              <span><strong>Pinned Repos:</strong> Approximated by sorting repos by stars, or via GraphQL.</span>
            </li>
          </ul>
        </div>
        
      </div>
      
      <div className="mt-12 text-center text-sm text-gray-400">
        <p>This menu represents the architectural capabilities mapped out for future expansion.</p>
      </div>
    </div>
  );
}
