import React from 'react';

export default function ApiCapabilitiesFooter() {
  return (
    <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800 pb-10">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Explore the GitHub Public API Menu
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          The GitHub Explorer above is just a glimpse of what's possible. Below is a comprehensive list of all data points and features available through the GitHub REST v3 API. You can copy the endpoints and test them in your browser!
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
          <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex flex-col gap-1">
              <span><strong>Profile Foundation</strong> (Avatar, Bio, Company)</span>
              <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-blue-600 w-fit select-all cursor-pointer hover:bg-blue-50 transition-colors">https://api.github.com/users/&#123;user&#125;</code>
            </li>
            <li className="flex flex-col gap-1">
              <span><strong>Top Languages & Repos</strong></span>
              <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-blue-600 w-fit select-all cursor-pointer hover:bg-blue-50 transition-colors">https://api.github.com/users/&#123;user&#125;/repos</code>
            </li>
            <li className="flex flex-col gap-1">
              <span><strong>Starred Repositories</strong></span>
              <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-blue-600 w-fit select-all cursor-pointer hover:bg-blue-50 transition-colors">https://api.github.com/users/&#123;user&#125;/starred</code>
            </li>
            <li className="flex flex-col gap-1">
              <span><strong>Organizations</strong></span>
              <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-blue-600 w-fit select-all cursor-pointer hover:bg-blue-50 transition-colors">https://api.github.com/users/&#123;user&#125;/orgs</code>
            </li>
            <li className="flex flex-col gap-1">
              <span><strong>Activity Feed</strong> (90-day timeline)</span>
              <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-blue-600 w-fit select-all cursor-pointer hover:bg-blue-50 transition-colors">https://api.github.com/users/&#123;user&#125;/events</code>
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
          <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex flex-col gap-1">
              <span><strong>Core Info</strong> (Stars, Forks, License)</span>
              <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-green-600 w-fit select-all cursor-pointer hover:bg-green-50 transition-colors">https://api.github.com/repos/&#123;owner&#125;/&#123;repo&#125;</code>
            </li>
            <li className="flex flex-col gap-1">
              <span><strong>Languages Breakdown</strong> (Byte count)</span>
              <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-green-600 w-fit select-all cursor-pointer hover:bg-green-50 transition-colors">https://api.github.com/repos/&#123;owner&#125;/&#123;repo&#125;/languages</code>
            </li>
            <li className="flex flex-col gap-1">
              <span><strong>Contributors</strong> (Sorted by commits)</span>
              <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-green-600 w-fit select-all cursor-pointer hover:bg-green-50 transition-colors">https://api.github.com/repos/&#123;owner&#125;/&#123;repo&#125;/contributors</code>
            </li>
            <li className="flex flex-col gap-1">
              <span><strong>Commits History</strong> (Git log)</span>
              <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-green-600 w-fit select-all cursor-pointer hover:bg-green-50 transition-colors">https://api.github.com/repos/&#123;owner&#125;/&#123;repo&#125;/commits</code>
            </li>
            <li className="flex flex-col gap-1">
              <span><strong>Issues & PRs</strong></span>
              <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-green-600 w-fit select-all cursor-pointer hover:bg-green-50 transition-colors">https://api.github.com/repos/&#123;owner&#125;/&#123;repo&#125;/issues</code>
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
          <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex flex-col gap-1">
              <span><strong>Contribution Graph</strong> (External SVG Generator)</span>
              <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-purple-600 w-fit select-all cursor-pointer hover:bg-purple-50 transition-colors">https://ghchart.rshah.org/&#123;user&#125;</code>
            </li>
            <li className="flex flex-col gap-1">
              <span><strong>Releases & Tags</strong></span>
              <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-purple-600 w-fit select-all cursor-pointer hover:bg-purple-50 transition-colors">https://api.github.com/repos/&#123;owner&#125;/&#123;repo&#125;/releases</code>
            </li>
            <li className="flex flex-col gap-1">
              <span><strong>Forks</strong></span>
              <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-purple-600 w-fit select-all cursor-pointer hover:bg-purple-50 transition-colors">https://api.github.com/repos/&#123;owner&#125;/&#123;repo&#125;/forks</code>
            </li>
            <li className="flex flex-col gap-1">
              <span><strong>GitHub Actions Workflows</strong></span>
              <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-purple-600 w-fit select-all cursor-pointer hover:bg-purple-50 transition-colors">https://api.github.com/repos/&#123;owner&#125;/&#123;repo&#125;/actions/runs</code>
            </li>
            <li className="flex flex-col gap-1">
              <span><strong>Directory Contents</strong> (Source Code)</span>
              <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded text-purple-600 w-fit select-all cursor-pointer hover:bg-purple-50 transition-colors">https://api.github.com/repos/&#123;owner&#125;/&#123;repo&#125;/contents/&#123;path&#125;</code>
            </li>
          </ul>
        </div>
        
      </div>
    </div>
  );
}
