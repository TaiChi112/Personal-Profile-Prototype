import React, { useState } from 'react';

export default function TabLayout({ userData }: { userData: any }) {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'repos' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('repos')}
        >
          Repos
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm focus:outline-none ${
            activeTab === 'activity' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
      </div>

      <div className="p-4 bg-white rounded shadow">
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-xl font-bold mb-2">Profile Info</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        )}
        {activeTab === 'repos' && (
          <div>
            <h2 className="text-xl font-bold mb-2">Repositories</h2>
            <p className="text-gray-600">List of repositories goes here...</p>
          </div>
        )}
        {activeTab === 'activity' && (
          <div>
            <h2 className="text-xl font-bold mb-2">Recent Activity</h2>
            <p className="text-gray-600">Activity stream goes here...</p>
          </div>
        )}
      </div>
    </div>
  );
}
