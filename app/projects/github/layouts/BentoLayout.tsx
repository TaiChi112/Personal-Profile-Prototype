import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'TypeScript', value: 50, color: '#3178c6' },
  { name: 'JavaScript', value: 30, color: '#f1e05a' },
  { name: 'Rust', value: 20, color: '#dea584' },
];

export default function BentoLayout({ userData }: { userData: any }) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Box 1: Profile Info */}
        <div className="md:col-span-2 row-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center transition-all hover:shadow-md">
          <img 
            src={userData?.avatar_url || 'https://github.com/identicons/jasonlong.png'} 
            alt={userData?.name || 'User'} 
            className="w-32 h-32 rounded-full mb-4 border-4 border-white shadow-sm"
          />
          <h2 className="text-3xl font-bold text-gray-800">{userData?.name || 'GitHub User'}</h2>
          <p className="text-gray-500 font-medium mb-4">@{userData?.login || 'username'}</p>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {userData?.bio || 'This is a sample bio. Passionate about building great software and open source.'}
          </p>
          <div className="flex gap-4">
            <div className="bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
              <span className="font-bold text-gray-800 text-lg">{userData?.followers || 0}</span>
              <span className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-0.5">Followers</span>
            </div>
            <div className="bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
              <span className="font-bold text-gray-800 text-lg">{userData?.following || 0}</span>
              <span className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-0.5">Following</span>
            </div>
          </div>
        </div>

        {/* Box 2: Top Languages (Recharts) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-md">
          <h3 className="font-bold text-gray-800 mb-2">Top Languages</h3>
          <div className="flex-grow min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#374151', fontWeight: 600, fontSize: '14px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {data.map(lang => (
              <div key={lang.name} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: lang.color }} />
                {lang.name}
              </div>
            ))}
          </div>
        </div>

        {/* Box 3: Stats */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center transition-all hover:shadow-md">
          <h3 className="font-bold text-gray-800 mb-4">Repositories & Gists</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-blue-100/50">
              <span className="text-3xl font-bold text-blue-600 mb-1">{userData?.public_repos || 0}</span>
              <span className="text-blue-600/70 text-xs font-bold uppercase tracking-wider">Repos</span>
            </div>
            <div className="bg-purple-50/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-purple-100/50">
              <span className="text-3xl font-bold text-purple-600 mb-1">{userData?.public_gists || 0}</span>
              <span className="text-purple-600/70 text-xs font-bold uppercase tracking-wider">Gists</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
