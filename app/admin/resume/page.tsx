import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';
import { Download } from 'lucide-react';

export default async function AdminResumePage() {
  const session = await auth();

  // Basic admin check - fallback to hardcoded email if role is not properly set
  const isOwner = session?.user?.email === 'anothai.0978452316@gmail.com';
  const isAdmin = session?.user?.role === 'admin';

  if (!session?.user || (!isAdmin && !isOwner)) {
    redirect('/');
  }

  const leads = await prisma.resumeDownloadLead.findMany({
    orderBy: { downloadedAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Download className="text-white/70" />
            Resume Download Analytics
          </h1>
          <p className="text-white/50">Track who is viewing and downloading your professional portfolio.</p>
        </header>

        <div className="bg-[#111317] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Downloaded At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-white/40">
                    No leads collected yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white/90">{lead.name}</td>
                    <td className="px-6 py-4 text-white/70">{lead.company}</td>
                    <td className="px-6 py-4 text-white/70">{lead.email || '-'}</td>
                    <td className="px-6 py-4 text-white/50">
                      {new Date(lead.downloadedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
