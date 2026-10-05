"use client";

import type React from 'react';
import { useState, } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  type Node, 
  type Edge, 
  MarkerType,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Sparkles, Activity, DollarSign, Clock, GitBranch, 
  Bot, ShieldCheck, TrendingUp, Award, 
  LayoutDashboard, Users, ChevronRight, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Initial Data ---
type Tab = 'canvas' | 'hr';

const initialNodes: Node[] = [
  { id: 'start', position: { x: 300, y: 50 }, data: { label: 'Start: Customer Browses' }, type: 'input', style: { background: '#ffffff', color: '#0f172a', borderColor: '#e2e8f0', borderRadius: '8px', padding: '12px', fontWeight: 'bold' } },
  { id: 'cart', position: { x: 300, y: 150 }, data: { label: 'Add to Cart' }, style: { background: '#ffffff', color: '#0f172a', borderColor: '#e2e8f0', borderRadius: '8px', padding: '12px', fontWeight: 'bold' } },
  { id: 'checkout', position: { x: 300, y: 250 }, data: { label: 'Checkout & Pay' }, style: { background: '#ffffff', color: '#0f172a', borderColor: '#e2e8f0', borderRadius: '8px', padding: '12px', fontWeight: 'bold' } },
  { id: 'end', position: { x: 300, y: 350 }, data: { label: 'Order Complete' }, type: 'output', style: { background: '#ffffff', color: '#0f172a', borderColor: '#e2e8f0', borderRadius: '8px', padding: '12px', fontWeight: 'bold' } },
];

const initialEdges: Edge[] = [
  { id: 'e-start-cart', source: 'start', target: 'cart', animated: true, style: { stroke: '#94a3b8', strokeWidth: 2 } },
  { id: 'e-cart-checkout', source: 'cart', target: 'checkout', animated: true, style: { stroke: '#94a3b8', strokeWidth: 2 } },
  { id: 'e-checkout-end', source: 'checkout', target: 'end', animated: true, style: { stroke: '#94a3b8', strokeWidth: 2 } },
];

// --- Main Component ---
export default function OmniQAPremium() {
  const [activeTab, setActiveTab] = useState<Tab>('canvas');
  
  // React Flow State
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  
  // Story State
  const [input, setInput] = useState('');
  const [storyStage, setStoryStage] = useState<'idle' | 'thinking' | 'updating_canvas' | 'running_agent' | 'complete'>('idle');
  const [aiLogs, setAiLogs] = useState<{id: number, text: string, type: 'info'|'success'|'warn'}[]>([]);
  
  // Dashboard Metrics State
  const [metrics, setMetrics] = useState({ paths: 4, hours: 0, cost: 0, added: 0 });

  // Handle Input Submission (Triggers Story)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || storyStage !== 'idle') { return; }
    
    setStoryStage('thinking');
    
    // 1. Simulate AI Thinking
    setTimeout(() => {
      setStoryStage('updating_canvas');
      
      // 2. Update Flowchart & Metrics
      const vipNode: Node = {
        id: 'vip',
        position: { x: 300, y: 250 }, // Insert exactly where checkout was
        data: { label: 'Verify VIP Membership' },
        style: { 
          background: '#ecfdf5', 
          color: '#047857', 
          borderColor: '#10b981', 
          borderWidth: '2px',
          borderStyle: 'dashed',
          borderRadius: '8px', 
          padding: '12px', 
          fontWeight: 'bold',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' // Glowing effect
        }
      };

      setNodes(nds => {
        // Push checkout and end down
        const moved = nds.map(n => {
          if (n.id === 'checkout' || n.id === 'end') {
            return { ...n, position: { x: n.position.x, y: n.position.y + 100 } };
          }
          return n;
        });
        return [...moved, vipNode];
      });

      setEdges(eds => {
        const filtered = eds.filter(e => e.id !== 'e-cart-checkout');
        return [
          ...filtered,
          { id: 'e-cart-vip', source: 'cart', target: 'vip', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, style: { stroke: '#10b981', strokeWidth: 2 } },
          { id: 'e-vip-checkout', source: 'vip', target: 'checkout', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, style: { stroke: '#10b981', strokeWidth: 2 } }
        ];
      });

      setMetrics({ paths: 19, hours: 4, cost: 200, added: 1 });
      
      // 3. Start AI Worker Simulation
      setTimeout(() => {
        setStoryStage('running_agent');
        runAiWorkerSimulation();
      }, 1500);

    }, 2000);
  };

  const runAiWorkerSimulation = () => {
    const sequence = [
      { t: 'Initializing testing protocol...', type: 'info', d: 500 },
      { t: 'Navigating to Customer Dashboard', type: 'info', d: 1500 },
      { t: 'Testing new path: "Verify VIP Membership"', type: 'info', d: 2500 },
      { t: 'Attempting to skip VIP check... Blocked! Rule is working correctly.', type: 'success', d: 4000 },
      { t: 'Found a changed checkout button layout...', type: 'warn', d: 5500 },
      { t: 'Automatically adjusting and clicking via visual fallback.', type: 'info', d: 6500 },
      { t: 'Order Complete. All 15 new edge cases passed successfully.', type: 'success', d: 8000 }
    ];

    let delay = 0;
    sequence.forEach((step, i) => {
      delay = step.d;
      setTimeout(() => {
        setAiLogs(prev => [...prev, { id: i, text: step.t, type: step.type as any }]);
        if (i === sequence.length - 1) { setStoryStage('complete'); }
      }, delay);
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden">
      
      {/* Top Navbar */}
      <header className="h-16 px-6 border-b border-slate-800 bg-[#0f172a] flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">OmniQA <span className="font-light text-slate-400">Ecosystem</span></h1>
        </div>
        <nav className="flex bg-[#1e293b] p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('canvas')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'canvas' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <LayoutDashboard className="w-4 h-4 inline-block mr-2 -mt-0.5" /> Workspace
          </button>
          <button 
            onClick={() => setActiveTab('hr')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'hr' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Users className="w-4 h-4 inline-block mr-2 -mt-0.5" /> HR / PMS Bridge
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'canvas' ? (
            <motion.div key="canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex">
              
              {/* Left Canvas Area */}
              <div className="flex-1 flex flex-col relative border-r border-slate-800 bg-[#0b1120]">
                
                {/* Visual Map */}
                <div className="flex-1 relative">
                  <ReactFlow 
                    nodes={nodes} 
                    edges={edges} 
                    onNodesChange={(c) => setNodes(n => applyNodeChanges(c, n))}
                    onEdgesChange={(c) => setEdges(e => applyEdgeChanges(c, e))}
                    fitView 
                    fitViewOptions={{ padding: 0.2 }}
                    proOptions={{ hideAttribution: true }}
                  >
                    <Background color="#334155" gap={20} size={1.5} />
                    <Controls className="bg-slate-800 border-slate-700 fill-slate-300" />
                  </ReactFlow>

                  {/* AI Thinking Overlay */}
                  <AnimatePresence>
                    {storyStage === 'thinking' && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-10"
                      >
                        <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}>
                            <Bot className="w-10 h-10 text-indigo-600" />
                          </motion.div>
                          <p className="text-slate-900 font-bold text-lg">AI is mapping your request...</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Magic Chat Input */}
                <div className="p-6 bg-[#0f172a] border-t border-slate-800 shadow-2xl z-20 shrink-0">
                  <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a business requirement in plain English..."
                      disabled={storyStage !== 'idle'}
                      className="w-full bg-[#1e293b] border-2 border-[#334155] text-white pl-6 pr-32 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none text-lg shadow-inner disabled:opacity-50"
                    />
                    <button 
                      type="submit" 
                      disabled={storyStage !== 'idle' || !input.trim()}
                      className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      {storyStage === 'idle' ? 'Apply Magic' : 'Processing...'} <Sparkles className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Panel: Business Impact & AI Worker */}
              <div className="w-[400px] bg-[#0f172a] flex flex-col shrink-0">
                
                {/* Cost Dashboard */}
                <div className="p-6 border-b border-slate-800">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" /> Business Impact
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700/50">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1"><GitBranch className="w-3 h-3"/> New Steps</p>
                      <p className="text-2xl font-black text-white">{metrics.added}</p>
                    </div>
                    <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700/50">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1"><GitBranch className="w-3 h-3"/> Test Paths</p>
                      <p className="text-2xl font-black text-indigo-400">{metrics.paths}</p>
                    </div>
                    <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700/50">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Est. Time</p>
                      <p className="text-2xl font-black text-amber-400">{metrics.hours} <span className="text-sm">hrs</span></p>
                    </div>
                    <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700/50">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3"/> Est. Cost</p>
                      <p className="text-2xl font-black text-rose-400">${metrics.cost}</p>
                    </div>
                  </div>
                </div>

                {/* AI Worker Live Feed */}
                <div className="flex-1 flex flex-col overflow-hidden p-6">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-indigo-400" /> AI Worker Live Feed
                  </h2>
                  <div className="flex-1 bg-[#020617] rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-y-auto space-y-3 shadow-inner">
                    {storyStage === 'idle' || storyStage === 'thinking' || storyStage === 'updating_canvas' ? (
                      <div className="text-slate-600 flex items-center justify-center h-full italic">Waiting for workflow updates...</div>
                    ) : (
                      <>
                        {aiLogs.map(log => (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} 
                            key={log.id} 
                            className={`flex gap-3 leading-relaxed ${
                              log.type === 'warn' ? 'text-amber-400' : 
                              log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'
                            }`}
                          >
                            <span className="shrink-0 mt-0.5">{log.type === 'success' ? '✓' : log.type === 'warn' ? '!' : '>'}</span>
                            <span>{log.text}</span>
                          </motion.div>
                        ))}
                        {storyStage === 'running_agent' && (
                          <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }} className="text-slate-500">
                            Testing in progress...
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          ) : (
            <motion.div key="hr" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center p-8 overflow-y-auto">
              
              {/* PMS Scorecard UI */}
              <div className="max-w-4xl w-full bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                
                {/* Header Profile */}
                <div className="bg-indigo-900 p-10 text-white flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-indigo-500 border-4 border-indigo-400 shadow-xl flex items-center justify-center text-4xl font-black">
                      JS
                    </div>
                    <div>
                      <h2 className="text-3xl font-black mb-1">Jane Smith</h2>
                      <p className="text-indigo-200 font-medium text-lg">Senior QA Strategist</p>
                      <div className="flex items-center gap-2 mt-3 text-sm bg-indigo-800/50 px-3 py-1.5 rounded-full border border-indigo-700/50 w-fit">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span>Top 5% Performer this quarter</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-2">Total Value Created</p>
                    <p className="text-5xl font-black text-emerald-400">$12,450</p>
                  </div>
                </div>

                {/* Metrics Area */}
                <div className="p-10 grid grid-cols-3 gap-8 bg-slate-50">
                  
                  {/* Coverage Score */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Map Coverage</h3>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                        <motion.circle 
                          cx="50" cy="50" r="45" fill="none" stroke="#4f46e5" strokeWidth="10" strokeLinecap="round"
                          initial={{ strokeDasharray: "0 1000" }}
                          animate={{ strokeDasharray: "260 1000" }} /* ~92% of 283 perimeter */
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-800">92%</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-4 font-medium">Tested complex paths AI missed</p>
                  </div>

                  {/* Discovery Bonus */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-1">Discovery Bonus</h3>
                    <p className="text-sm text-slate-500 mb-4">Points awarded for finding unmapped hidden errors.</p>
                    <div className="text-3xl font-black text-amber-500">+450 <span className="text-lg text-slate-400">pts</span></div>
                  </div>

                  {/* Badges */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-1">High-Risk Resolution</h3>
                    <p className="text-sm text-slate-500 mb-4">Badges earned for securing payment workflows.</p>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md"><Award className="w-4 h-4"/></div>
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md"><Award className="w-4 h-4"/></div>
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md"><Award className="w-4 h-4"/></div>
                    </div>
                  </div>

                </div>

                {/* Footer Sync Button */}
                <div className="p-8 border-t border-slate-100 bg-white flex justify-end">
                  <SyncButton />
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}

// Sync Button with Interaction
function SyncButton() {
  const [state, setState] = useState<'idle' | 'syncing' | 'done'>('idle');

  const handleClick = () => {
    if (state !== 'idle') { return; }
    setState('syncing');
    setTimeout(() => {
      setState('done');
      setTimeout(() => setState('idle'), 4000);
    }, 2000);
  };

  return (
    <button 
      onClick={handleClick}
      disabled={state !== 'idle'}
      className={`px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all ${
        state === 'done' ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 
        'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20'
      }`}
    >
      {state === 'idle' && (
        <>Sync Performance to HR/Payroll System <ChevronRight className="w-5 h-5" /></>
      )}
      {state === 'syncing' && (
        <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Syncing Data securely...</>
      )}
      {state === 'done' && (
        <><CheckCircle className="w-5 h-5" /> Data Synced Successfully!</>
      )}
    </button>
  );
}
