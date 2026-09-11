import React from 'react';

export default function TimelineLayout({ userData }: { userData: any }) {
  const dummyEvents = [
    { id: 1, type: 'push', text: 'Pushed to main branch', repo: 'my-awesome-project', time: '2 hours ago', icon: 'M16 17v-1.5a1.5 1.5 0 00-1.5-1.5H5.5a1.5 1.5 0 00-1.5 1.5V17m12-9l-3-3m0 0l-3 3m3-3v8' },
    { id: 2, type: 'issue', text: 'Opened an issue', repo: 'another-repo', time: '1 day ago', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { id: 3, type: 'star', text: 'Starred a repository', repo: 'cool-lib', time: '3 days ago', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-gray-300 overflow-hidden flex-shrink-0">
          {userData?.avatar_url ? (
            <img src={userData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-xl">
              {(userData?.name || 'U')[0]}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{userData?.name || 'User Name'}</h1>
          <p className="text-gray-500">{userData?.bio || 'GitHub Developer'}</p>
        </div>
      </div>

      <div className="relative pl-8 space-y-8 before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-gray-200">
        {dummyEvents.map((event) => (
          <div key={event.id} className="relative">
            <span className="absolute -left-8 top-1 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-500 z-10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={event.icon}></path>
              </svg>
            </span>
            <div className="ml-4 p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-800">{event.text}</h3>
                <span className="text-xs text-gray-400">{event.time}</span>
              </div>
              <p className="text-sm text-blue-600 hover:underline cursor-pointer">{event.repo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
