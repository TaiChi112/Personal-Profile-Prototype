import React from 'react';

export default function TimelineLayout({ userData, eventsData }: { userData: any, eventsData: any[] }) {
  if (!userData) return null;

  const parseEvent = (event: any) => {
    switch (event.type) {
      case 'PushEvent':
        return { text: `Pushed ${event.payload.commits?.length || 0} commits to`, icon: 'M16 17v-1.5a1.5 1.5 0 00-1.5-1.5H5.5a1.5 1.5 0 00-1.5 1.5V17m12-9l-3-3m0 0l-3 3m3-3v8', color: 'text-green-500' };
      case 'WatchEvent':
        return { text: 'Starred repository', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: 'text-yellow-500' };
      case 'CreateEvent':
        return { text: `Created ${event.payload.ref_type} at`, icon: 'M12 4v16m8-8H4', color: 'text-blue-500' };
      case 'IssuesEvent':
        return { text: `${event.payload.action} an issue in`, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'text-red-500' };
      case 'PullRequestEvent':
        return { text: `${event.payload.action} a pull request in`, icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2', color: 'text-purple-500' };
      case 'IssueCommentEvent':
        return { text: `Commented on an issue in`, icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: 'text-gray-500' };
      case 'ForkEvent':
        return { text: `Forked`, icon: 'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3', color: 'text-blue-400' };
      default:
        return { text: `Did ${event.type} at`, icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-gray-400' };
    }
  };

  const getRelativeTime = (dateString: string) => {
    const diff = new Date().getTime() - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <div className="w-full">
      <div className="flex items-center space-x-6 mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white shadow-md overflow-hidden flex-shrink-0">
          <img src={userData.avatar_url || 'https://github.com/identicons/jasonlong.png'} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{userData.name || userData.login}</h1>
          <p className="text-gray-500 font-medium text-lg">Activity Feed (Last 90 Days)</p>
        </div>
      </div>

      <div className="relative pl-10 space-y-8 before:absolute before:inset-y-0 before:left-5 before:w-0.5 before:bg-gray-200">
        {eventsData && eventsData.length > 0 ? (
          eventsData.slice(0, 20).map((event: any) => {
            const { text, icon, color } = parseEvent(event);
            return (
              <div key={event.id} className="relative group">
                <span className={`absolute -left-10 top-1 flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-gray-200 ${color} z-10 group-hover:border-blue-400 group-hover:scale-110 transition-transform shadow-sm`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}></path>
                  </svg>
                </span>
                <div className="ml-6 p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 text-base">{text}</h3>
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">{getRelativeTime(event.created_at)}</span>
                  </div>
                  <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
                    {event.repo.name}
                  </a>
                  {event.payload.commits && (
                    <div className="mt-4 space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {event.payload.commits.slice(0, 3).map((commit: any) => (
                        <div key={commit.sha} className="flex text-sm">
                          <span className="text-gray-400 font-mono w-16 flex-shrink-0">{commit.sha.substring(0, 7)}</span>
                          <span className="text-gray-700 truncate">{commit.message}</span>
                        </div>
                      ))}
                      {event.payload.commits.length > 3 && (
                        <div className="text-xs text-gray-500 pt-1 font-medium italic">
                          ...and {event.payload.commits.length - 3} more commits
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="ml-6 p-6 bg-white border border-gray-100 rounded-xl shadow-sm text-center text-gray-500">
            No public activity found for this user recently.
          </div>
        )}
      </div>
    </div>
  );
}
