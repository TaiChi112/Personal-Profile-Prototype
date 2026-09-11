import React, { useState } from 'react';

export default function TabLayout({ userData, reposData, eventsData }: { userData: any, reposData: any[], eventsData: any[] }) {
  const [activeTab, setActiveTab] = useState('profile');

  if (!userData) return null;

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl px-4 pt-4">
        <button
          className={`px-6 py-3 font-semibold text-sm focus:outline-none transition-colors rounded-t-lg ${
            activeTab === 'profile' ? 'bg-gray-50 border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Details
        </button>
        <button
          className={`px-6 py-3 font-semibold text-sm focus:outline-none transition-colors rounded-t-lg ${
            activeTab === 'repos' ? 'bg-gray-50 border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('repos')}
        >
          Repositories ({reposData?.length || 0})
        </button>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">About</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Company</span>
                  <span className="text-gray-900">{userData.company || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Location</span>
                  <span className="text-gray-900">{userData.location || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Website</span>
                  <span className="text-blue-600 hover:underline">
                    {userData.blog ? <a href={userData.blog.startsWith('http') ? userData.blog : `https://${userData.blog}`} target="_blank" rel="noreferrer">{userData.blog}</a> : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Twitter</span>
                  <span className="text-gray-900">{userData.twitter_username ? `@${userData.twitter_username}` : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Joined</span>
                  <span className="text-gray-900">{new Date(userData.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Raw API Payload</h2>
              <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-64 border border-gray-100 text-gray-700">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          </div>
        )}
        {activeTab === 'repos' && (
          <div>
            <h2 className="text-xl font-bold mb-6 text-gray-800">Recent Repositories</h2>
            {reposData && reposData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reposData.slice(0, 10).map((repo: any) => (
                  <div key={repo.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline text-lg truncate pr-2">
                        {repo.name}
                      </a>
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full border border-gray-300 whitespace-nowrap">
                        {repo.visibility}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 h-10 overflow-hidden line-clamp-2">
                      {repo.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                      {repo.language && (
                        <div className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                          {repo.language}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        ⭐ {repo.stargazers_count}
                      </div>
                      <div className="flex items-center gap-1">
                        🔱 {repo.forks_count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No repositories found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
