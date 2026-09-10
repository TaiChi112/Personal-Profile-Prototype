import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session) {
    redirect('/api/auth/signin');
  }

  const scores = await prisma.quizScore.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const totalAttempts = scores.length;
  const correctAttempts = scores.filter(score => score.isCorrect).length;
  const overallAccuracy = totalAttempts > 0 
    ? Math.round((correctAttempts / totalAttempts) * 100) 
    : 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Quiz Attempts</h2>
          <p className="mt-2 text-4xl font-semibold text-gray-900">{totalAttempts}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Overall Accuracy</h2>
          <p className="mt-2 text-4xl font-semibold text-gray-900">{overallAccuracy}%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Recent Quiz Scores</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scores.map((score) => (
                <tr key={score.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {score.question}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {score.isCorrect ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Incorrect
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(score.createdAt).toLocaleDateString()} {new Date(score.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
              {scores.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No quiz scores found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
