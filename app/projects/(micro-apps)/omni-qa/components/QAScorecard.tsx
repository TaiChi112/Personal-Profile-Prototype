import { useState } from 'react';
import { Users, Award, TrendingUp, DownloadCloud, CheckCircle2 } from 'lucide-react';

export function QAScorecard() {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSynced(true);
      setTimeout(() => setSynced(false), 3000);
    }, 2000);
  };

  const qaData = [
    { name: 'Sarah Connor', coverage: 98, edgeCases: 24, collab: 95, total: 96, rank: 1 },
    { name: 'John Smith', coverage: 85, edgeCases: 12, collab: 88, total: 85, rank: 2 },
    { name: 'Alex Wong', coverage: 92, edgeCases: 18, collab: 80, total: 87, rank: 3 },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-950/80 backdrop-blur-md z-10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="text-blue-400" /> QA Performance & PMS Sync
          </h2>
          <p className="text-slate-400 text-sm mt-1">Data-driven performance evaluation scorecard</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={syncing || synced}
          className={`px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
            synced ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {syncing ? <span className="animate-pulse">Syncing to HRM...</span> : 
           synced ? <><CheckCircle2 className="w-4 h-4" /> Synced to Payroll</> : 
           <><DownloadCloud className="w-4 h-4" /> Sync to HRM / PMS</>}
        </button>
      </div>
      
      <div className="p-8 max-w-6xl mx-auto w-full">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">State Coverage</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Edge Cases Found</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Diagram Collab</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Final Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {qaData.sort((a, b) => b.total - a.total).map((qa, idx) => (
                <tr key={qa.name} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-bold border border-indigo-800/50">
                      {qa.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        {qa.name} {idx === 0 && <Award className="w-4 h-4 text-amber-400" />}
                      </div>
                      <div className="text-xs text-slate-500">QA Automation Engineer</div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${qa.coverage > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${qa.coverage}%` }} />
                      </div>
                      <span className="text-sm font-medium text-slate-300 w-8">{qa.coverage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-900/30 text-blue-400 font-bold text-sm border border-blue-800/50">
                      <TrendingUp className="w-3 h-3" /> {qa.edgeCases}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-slate-300">{qa.collab}/100</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className={`text-2xl font-black ${idx === 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {qa.total}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
