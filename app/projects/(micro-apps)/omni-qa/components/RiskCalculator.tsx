
import { AlertTriangle, Clock, DollarSign, Activity } from 'lucide-react';

export function RiskCalculator() {
  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="text-amber-500" /> Risk-Based Testing & Tech Debt
        </h2>
        <p className="text-slate-400 text-sm mt-1">Predictive cost and effort analysis before deploying states</p>
      </div>
      
      <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
        
        {/* Top KPI Cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 text-slate-400 mb-2 font-medium">
              <Activity className="w-5 h-5 text-indigo-400" /> New Test Cases Required
            </div>
            <div className="text-4xl font-black text-white">42</div>
            <p className="text-sm text-slate-500 mt-2">+12 generated from 'Verify Cashback' node</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 text-slate-400 mb-2 font-medium">
              <Clock className="w-5 h-5 text-amber-400" /> Est. Testing Time
            </div>
            <div className="text-4xl font-black text-white">18<span className="text-xl text-slate-500 ml-1">hrs</span></div>
            <p className="text-sm text-slate-500 mt-2">Manual + Automated scripting</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 text-slate-400 mb-2 font-medium">
              <DollarSign className="w-5 h-5 text-rose-400" /> Cost of Change
            </div>
            <div className="text-4xl font-black text-white">$1,250</div>
            <p className="text-sm text-rose-500/80 mt-2">Warning: Budget threshold approaching</p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">Risk Weighting Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-rose-900/30">
              <div>
                <h4 className="text-rose-400 font-bold flex items-center gap-2">High Risk (Financial/Auth)</h4>
                <p className="text-slate-400 text-sm">Nodes: Process Payment, Verify Cashback</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-white">28 Cases</div>
                <div className="text-xs text-rose-500 font-medium">Exhaustive matrix required</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-amber-900/30">
              <div>
                <h4 className="text-amber-400 font-bold flex items-center gap-2">Medium Risk (Business Logic)</h4>
                <p className="text-slate-400 text-sm">Nodes: Generate Receipt</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-white">10 Cases</div>
                <div className="text-xs text-amber-500 font-medium">Positive/Negative paths</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-emerald-900/30">
              <div>
                <h4 className="text-emerald-400 font-bold flex items-center gap-2">Low Risk (UI/View)</h4>
                <p className="text-slate-400 text-sm">Nodes: Start: Order Placed</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-white">4 Cases</div>
                <div className="text-xs text-emerald-500 font-medium">Happy paths only</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
