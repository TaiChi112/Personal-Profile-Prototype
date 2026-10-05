"use client";

import { useState } from 'react';
import { 
  ReactFlow, 
  Background, 
  type Node, 
  type Edge, 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Clock, Users, BarChart3, Plus, 
  Briefcase, Activity, Target, Zap, MessageSquare,
  Bot, CheckCircle2, TrendingUp, TrendingDown,BrainCircuit, Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

type Tab = 'time_machine' | 'war_room' | 'executive';

// --- Shared Data ---
const baseNodes: Node[] = [
  { id: 'start', position: { x: 250, y: 50 }, data: { label: 'Start: Browse' }, type: 'input', style: { background: 'rgba(15, 23, 42, 0.7)', color: '#fff', border: '1px solid rgba(148, 163, 184, 0.2)', backdropFilter: 'blur(8px)', borderRadius: '12px', padding: '16px' } },
  { id: 'cart', position: { x: 250, y: 150 }, data: { label: 'Add to Cart' }, style: { background: 'rgba(15, 23, 42, 0.7)', color: '#fff', border: '1px solid rgba(148, 163, 184, 0.2)', backdropFilter: 'blur(8px)', borderRadius: '12px', padding: '16px' } },
  { id: 'checkout', position: { x: 250, y: 250 }, data: { label: 'Checkout' }, style: { background: 'rgba(15, 23, 42, 0.7)', color: '#fff', border: '1px solid rgba(148, 163, 184, 0.2)', backdropFilter: 'blur(8px)', borderRadius: '12px', padding: '16px' } },
];
const baseEdges: Edge[] = [
  { id: 'e1', source: 'start', target: 'cart', style: { stroke: '#475569' } },
  { id: 'e2', source: 'cart', target: 'checkout', style: { stroke: '#475569' } },
];

export default function OmniQAExecutive() {
  const [activeTab, setActiveTab] = useState<Tab>('time_machine');

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-slate-200 font-sans overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#050505] to-black">
      
      {/* Executive Navbar */}
      <header className="h-20 px-8 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wider">OmniQA <span className="font-light text-slate-400">Phase 2</span></h1>
            <p className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase">Strategic Command</p>
          </div>
        </div>
        
        <nav className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
          <TabButton id="time_machine" icon={<Clock className="w-4 h-4"/>} label="The Time Machine" active={activeTab} set={setActiveTab} />
          <TabButton id="war_room" icon={<Users className="w-4 h-4"/>} label="The War Room" active={activeTab} set={setActiveTab} />
          <TabButton id="executive" icon={<BarChart3 className="w-4 h-4"/>} label="Command Center" active={activeTab} set={setActiveTab} />
        </nav>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">CTO</div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'time_machine' && <TimeMachine key="tm" />}
          {activeTab === 'war_room' && <WarRoom key="wr" />}
          {activeTab === 'executive' && <CommandCenter key="ex" />}
        </AnimatePresence>
      </main>

    </div>
  );
}

// --- Components ---

function TabButton({ id, icon, label, active, set }: any) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => set(id)}
      className={`relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
        isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      {isActive && (
        <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white/10 border border-white/20 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
      )}
      <span className="relative z-10 flex items-center gap-2">{icon} {label}</span>
    </button>
  );
}

// ---------------------------------------------------------
// MODULE 4: THE TIME MACHINE
// ---------------------------------------------------------
function TimeMachine() {
  const [forecastState, setForecastState] = useState<'idle' | 'forecasting' | 'result'>('idle');
  const [nodes, setNodes] = useState(baseNodes);
  const [edges, setEdges] = useState(baseEdges);

  const simulateDragDrop = () => {
    if (forecastState !== 'idle') { return; }
    setForecastState('forecasting');
    
    setTimeout(() => {
      // Add Ghost Node
      setNodes(prev => [
        ...prev,
        { 
          id: 'apple-pay', 
          position: { x: 450, y: 250 }, 
          data: { label: 'Apple Pay Gateway' }, 
          style: { 
            background: 'rgba(56, 189, 248, 0.1)', 
            color: '#38bdf8', 
            border: '2px dashed #38bdf8',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)'
          } 
        }
      ]);
      setEdges(prev => [
        ...prev,
        { id: 'e-ghost', source: 'cart', target: 'apple-pay', style: { stroke: '#38bdf8', strokeDasharray: '5,5', strokeWidth: 2 }, animated: true }
      ]);
      setForecastState('result');
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex">
      {/* Left: Feature Wishlist */}
      <div className="w-80 border-r border-white/5 bg-black/40 backdrop-blur-md p-6 flex flex-col">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Plus className="text-indigo-400"/> Feature Wishlist</h2>
        <p className="text-xs text-slate-400 mb-6">Click a card to simulate drag-and-drop forecasting.</p>
        
        <div className="space-y-4">
          <div 
            onClick={simulateDragDrop}
            className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/10 to-sky-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <h3 className="font-bold text-white text-sm mb-1">Add Apple Pay Integration</h3>
            <p className="text-xs text-slate-400">Alternative checkout method for iOS users.</p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-white/5 opacity-50 cursor-not-allowed">
            <h3 className="font-bold text-white text-sm mb-1">Loyalty Points System</h3>
            <p className="text-xs text-slate-400">Allow users to redeem points at checkout.</p>
          </div>
        </div>
      </div>

      {/* Center: Workflow Map */}
      <div className="flex-1 relative bg-[#0a0a0a]">
        <ReactFlow nodes={nodes} edges={edges} fitView colorMode="dark" proOptions={{ hideAttribution: true }}>
          <Background color="rgba(255,255,255,0.05)" gap={20} size={2} />
          {forecastState === 'forecasting' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase">Simulating Quantum Scenario...</p>
              </div>
            </div>
          )}
        </ReactFlow>
      </div>

      {/* Right: Projection Panel */}
      <AnimatePresence>
        {forecastState === 'result' && (
          <motion.div 
            initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="w-96 border-l border-white/5 bg-black/60 backdrop-blur-xl p-6 flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.5)]"
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Target className="text-sky-400"/> AI Forecast Projection</h2>
            
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <p className="text-[10px] uppercase tracking-widest text-rose-400 font-bold mb-1">Risk Level</p>
                <p className="text-lg font-black text-rose-100">High <span className="text-sm font-normal text-rose-300">(Touches Payment Gateway)</span></p>
              </div>

              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <p className="text-[10px] uppercase tracking-widest text-sky-400 font-bold mb-1">Predicted QA Workload</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-black text-sky-100">+12</p>
                  <p className="text-sm font-medium text-sky-300 mb-1">Hours</p>
                </div>
                <p className="text-xs text-sky-400/70 mt-1">36 new synthetic test cases generated</p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1">HR Impact</p>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-indigo-400" />
                  <p className="text-sm font-medium text-indigo-100">Requires 1 Senior Financial Tester</p>
                </div>
              </div>

              <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full mix-blend-screen" />
                <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-2">Strategic Recommendation</p>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  Approve for Q3. Highly recommended to simplify the legacy credit card flow first to offset the tech debt introduced by Apple Pay.
                </p>
                <button className="mt-4 w-full py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all">
                  Generate Executive Report
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------------------------------------------------------
// MODULE 5: THE WAR ROOM
// ---------------------------------------------------------
function WarRoom() {
  const warNodes = [
    ...baseNodes,
    { 
      id: 'comment-1', 
      position: { x: 480, y: 220 }, 
      data: { 
        label: (
          <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-[10px] text-white">PM</div>
              <span className="text-xs font-bold text-slate-200">Sarah (Product)</span>
            </div>
            <p className="text-xs text-slate-300">"Users are dropping off here. Can we test a 1-click checkout?"</p>
            <div className="mt-2 p-2 bg-indigo-500/20 border border-indigo-500/30 rounded flex gap-2">
              <Bot className="w-4 h-4 text-indigo-400 shrink-0" />
              <p className="text-[10px] text-indigo-200">AI Summary: Product requests 1-click checkout testing. Assigned to Jane (QA).</p>
            </div>
          </div>
        )
      },
      style: { background: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(244, 63, 94, 0.5)', width: 250, backdropFilter: 'blur(10px)', borderRadius: '12px' }
    }
  ];
  
  const warEdges = [
    ...baseEdges,
    { id: 'e-comment', source: 'checkout', target: 'comment-1', style: { stroke: '#f43f5e', strokeDasharray: '4,4' }, animated: true }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex">
      <div className="flex-1 relative bg-[#0a0a0a]">
        <ReactFlow nodes={warNodes} edges={warEdges} fitView colorMode="dark" proOptions={{ hideAttribution: true }}>
          <Background color="rgba(255,255,255,0.05)" gap={20} size={2} />
          
          {/* Action Bar overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex gap-2 shadow-2xl">
            <button className="px-4 py-2 hover:bg-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all"><MessageSquare className="w-4 h-4"/> Add Comment</button>
            <button className="px-4 py-2 hover:bg-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all"><Mic className="w-4 h-4"/> Voice Note</button>
            <div className="w-px bg-white/10 my-2 mx-1" />
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)]">
              <Bot className="w-4 h-4"/> AI Summarize Map
            </button>
          </div>
        </ReactFlow>
      </div>

      <div className="w-80 border-l border-white/5 bg-black/40 backdrop-blur-xl flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Activity className="text-emerald-400"/> HR Activity Feed</h2>
          <p className="text-xs text-slate-400 mt-1">Cross-department resolution tracking.</p>
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          <div className="relative pl-6 border-l-2 border-emerald-500/50">
            <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-1 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            <p className="text-sm font-bold text-white">Jane (Senior QA)</p>
            <p className="text-xs text-slate-300 mt-1">Successfully deployed 1-click checkout automated test suite. Bottleneck resolved.</p>
            <div className="mt-2 inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-1 rounded-md border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3"/> Performance Sync +50 pts
            </div>
            <p className="text-[10px] text-slate-500 mt-2">10 mins ago</p>
          </div>

          <div className="relative pl-6 border-l-2 border-indigo-500/50">
            <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1" />
            <p className="text-sm font-bold text-white">AI Agent</p>
            <p className="text-xs text-slate-300 mt-1">Converted Sarah's voice note into 3 actionable test specifications.</p>
            <p className="text-[10px] text-slate-500 mt-2">1 hour ago</p>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------
// MODULE 6: THE COMMAND CENTER
// ---------------------------------------------------------
const mockLineData = [
  { name: 'Jan', value: 14 },
  { name: 'Feb', value: 12 },
  { name: 'Mar', value: 10 },
  { name: 'Apr', value: 7 },
  { name: 'May', value: 4 },
  { name: 'Jun', value: 2 }, // Days to market
];

function CommandCenter() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Executive Summary</h1>
          <p className="text-slate-400 mt-2 text-sm">Real-time ROI and Ecosystem Health</p>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/30 transition-all" />
            <div className="flex items-center gap-3 text-indigo-400 mb-4">
              <Zap className="w-5 h-5" /> <span className="font-bold text-xs uppercase tracking-widest">Time-to-Market</span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-white">2.4</span>
              <span className="text-lg text-slate-400 mb-1">Days</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <TrendingDown className="w-4 h-4" /> -82% from Q1 (14 days)
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full group-hover:bg-emerald-500/30 transition-all" />
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <Briefcase className="w-5 h-5" /> <span className="font-bold text-xs uppercase tracking-widest">Testing ROI</span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-white">$142k</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <TrendingUp className="w-4 h-4" /> Saved via AI automation
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-sky-500/20 blur-3xl rounded-full group-hover:bg-sky-500/30 transition-all" />
            <div className="flex items-center gap-3 text-sky-400 mb-4">
              <Users className="w-5 h-5" /> <span className="font-bold text-xs uppercase tracking-widest">QA Team Health</span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-white">96</span>
              <span className="text-lg text-slate-400 mb-1">/ 100</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sky-400 text-sm font-medium">
              Based on PMS Discovery Bonuses
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6 h-[400px]">
          
          {/* Release Acceleration Chart */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6">Release Cycle Acceleration</h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockLineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI vs Human Efficiency Donut */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest absolute top-6 left-6">AI vs Human Workload</h3>
            
            <div className="relative w-64 h-64 flex items-center justify-center mt-8">
              {/* Glowing background behind chart */}
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
              
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl z-10 transform -rotate-90">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                
                {/* AI Portion (85%) */}
                <motion.circle 
                  cx="50" cy="50" r="40" fill="none" stroke="#6366f1" strokeWidth="12" strokeLinecap="round"
                  initial={{ strokeDasharray: "0 1000" }}
                  animate={{ strokeDasharray: "213 1000" }} // 85% of 251.2
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                />
                
                {/* Human Portion (15%) - offset to start after AI */}
                <motion.circle 
                  cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="12" strokeLinecap="round"
                  strokeDashoffset="-213"
                  initial={{ strokeDasharray: "0 1000" }}
                  animate={{ strokeDasharray: "38 1000" }} // 15% of 251.2
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <span className="text-4xl font-black text-white">85%</span>
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-1">Automated</span>
              </div>
            </div>

            <div className="absolute bottom-6 w-full px-12 flex justify-between text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"/> AI Agent</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"/> Human QA</div>
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
