import { useState, } from 'react';
import { Terminal, } from 'lucide-react';
import { motion } from 'framer-motion';

export function MCPSimulator() {
  const [logs, setLogs] = useState<{ id: number, text: string, type: 'info'|'warn'|'success'|'error' }[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = () => {
    setIsRunning(true);
    setLogs([]);
    
    const steps = [
      { t: 'Initializing OmniQA Autonomous Agent...', type: 'info', delay: 500 },
      { t: 'Connecting to MCP Server: [UI_Inspector_v2]', type: 'info', delay: 1200 },
      { t: 'Executing Path: Start -> Process Payment -> Verify Cashback', type: 'info', delay: 2000 },
      { t: '⚠️ ALERT: Target button #btn-cashback not found in DOM.', type: 'warn', delay: 3500 },
      { t: 'Self-Healing Initiated: Invoking Vision LLM to locate button by semantic meaning.', type: 'info', delay: 4500 },
      { t: 'Vision LLM: Button text changed to "Redeem CB". Auto-updating selector...', type: 'success', delay: 6000 },
      { t: 'Test step passed using self-healed selector.', type: 'success', delay: 6500 },
      { t: 'Transitioned to State: Generate Receipt', type: 'info', delay: 7200 },
      { t: 'All E2E flows executed successfully.', type: 'success', delay: 8000 }
    ];

    let accumulatedTime = 0;
    steps.forEach((step, index) => {
      accumulatedTime = step.delay;
      setTimeout(() => {
        setLogs(prev => [...prev, { id: index, text: step.t, type: step.type as any }]);
        if (index === steps.length - 1) { setIsRunning(false); }
      }, accumulatedTime);
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="text-emerald-400" /> MCP Self-Healing Simulator
          </h2>
          <p className="text-slate-400 text-sm mt-1">Watch the AI agent autonomously fix broken tests</p>
        </div>
        <button 
          onClick={runSimulation} 
          disabled={isRunning}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {isRunning ? 'Agent is running...' : 'Run Autonomous Test'}
        </button>
      </div>
      
      <div className="flex-1 p-6 bg-[#0d1117] overflow-y-auto font-mono text-sm">
        {logs.length === 0 && !isRunning && (
          <div className="text-slate-600 text-center mt-20 italic">Click 'Run Autonomous Test' to begin MCP simulation.</div>
        )}
        
        {logs.map(log => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            key={log.id} 
            className={`mb-3 flex items-start gap-3 ${
              log.type === 'warn' ? 'text-amber-400' : 
              log.type === 'success' ? 'text-emerald-400' : 
              log.type === 'error' ? 'text-rose-400' : 'text-slate-300'
            }`}
          >
            <span className="opacity-50 text-slate-500">{'>'}</span>
            <span>{log.text}</span>
          </motion.div>
        ))}
        {isRunning && (
          <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }} className="text-slate-500 mt-2">
            _
          </motion.div>
        )}
      </div>
    </div>
  );
}
