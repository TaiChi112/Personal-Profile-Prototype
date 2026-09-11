'use client';

import React from 'react';
import { useGithubStore } from './store/useGithubStore';
import BentoLayout from './layouts/BentoLayout';
import TabLayout from './layouts/TabLayout';
import TimelineLayout from './layouts/TimelineLayout';
import ApiCapabilitiesFooter from './components/ApiCapabilitiesFooter';

export default function GithubExplorer() {
  const {
    searchQuery,
    layoutMode,
    userPat,
    userData,
    reposData,
    eventsData,
    setSearchQuery,
    setLayoutMode,
    setUserPat,
    setUserData,
    setReposData,
    setEventsData,
  } = useGithubStore();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const headers = userPat ? { Authorization: `Bearer ${userPat}` } : {};
      
      const [userRes, reposRes, eventsRes] = await Promise.all([
        fetch(`/api/github/proxy?url=/users/${searchQuery}`, { headers }),
        fetch(`/api/github/proxy?url=/users/${searchQuery}/repos?per_page=100&sort=updated`, { headers }),
        fetch(`/api/github/proxy?url=/users/${searchQuery}/events?per_page=30`, { headers })
      ]);

      const [userData, reposData, eventsData] = await Promise.all([
        userRes.json(),
        reposRes.json(),
        eventsRes.json()
      ]);

      setUserData(userData);
      setReposData(Array.isArray(reposData) ? reposData : []);
      setEventsData(Array.isArray(eventsData) ? eventsData : []);
    } catch (error) {
      console.error('Error fetching github data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header and Controls */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">GitHub Explorer</h1>
            
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              {(['BENTO', 'TABS', 'TIMELINE'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLayoutMode(mode)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    layoutMode === mode
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {mode.charAt(0) + mode.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Search GitHub username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
            
            <div className="w-full md:w-64">
              <input
                type="password"
                placeholder="Personal Access Token (optional)"
                value={userPat}
                onChange={(e) => setUserPat(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              />
            </div>
          </form>
        </div>

        {/* Layout Area */}
        <div className="layout-container">
          {layoutMode === 'BENTO' && <BentoLayout userData={userData} reposData={reposData} />}
          {layoutMode === 'TABS' && <TabLayout userData={userData} reposData={reposData} eventsData={eventsData} />}
          {layoutMode === 'TIMELINE' && <TimelineLayout userData={userData} eventsData={eventsData} />}
        </div>
        
        {/* API Capabilities Footer Menu */}
        <ApiCapabilitiesFooter />
      </div>
    </div>
  );
}
