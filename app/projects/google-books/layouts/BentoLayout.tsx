import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function BentoLayout({ books }: { books: any[] }) {
  const stats = useMemo(() => {
    if (!books || books.length === 0) return null;

    let totalPages = 0;
    const authorCounts: Record<string, number> = {};
    const yearCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    books.forEach(book => {
      const info = book.volumeInfo;
      if (info.pageCount) totalPages += info.pageCount;
      
      if (info.authors) {
        info.authors.forEach((a: string) => {
          authorCounts[a] = (authorCounts[a] || 0) + 1;
        });
      }

      if (info.publishedDate) {
        const year = info.publishedDate.substring(0, 4);
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      }

      if (info.categories) {
        info.categories.forEach((c: string) => {
          categoryCounts[c] = (categoryCounts[c] || 0) + 1;
        });
      }
    });

    const topAuthors = Object.entries(authorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    return { totalPages, topAuthors, topCategories };
  }, [books]);

  if (!stats) {
    return <div className="text-center p-12 text-gray-500">No data to analyze.</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Total Books Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
        <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Total Books Found</h3>
        <p className="text-6xl font-black text-blue-600 dark:text-blue-400">{books.length}</p>
        <p className="text-sm text-gray-400 mt-2">in current search results</p>
      </div>

      {/* Total Pages Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
        <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Estimated Total Pages</h3>
        <p className="text-5xl font-black text-green-600 dark:text-green-400">
          {stats.totalPages.toLocaleString()}
        </p>
        <p className="text-sm text-gray-400 mt-2">combined page count</p>
      </div>

      {/* Top Authors */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 md:row-span-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-2">Frequent Authors</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.topAuthors} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} width={80} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Categories Pie Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 border-b border-gray-100 dark:border-gray-700 pb-2">Top Genres / Categories</h3>
        {stats.topCategories.length > 0 ? (
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie data={stats.topCategories} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {stats.topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-50% pl-4 space-y-3">
              {stats.topCategories.map((cat, index) => (
                <div key={cat.name} className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-gray-700 dark:text-gray-300 truncate font-medium flex-1">{cat.name}</span>
                  <span className="text-gray-400 font-bold ml-2">{cat.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-4">No category data available for these books.</p>
        )}
      </div>

    </div>
  );
}
