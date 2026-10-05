"use client";

import { useState, } from 'react';
import { 
  ReactFlow, 
  Background, 
  type Node, 
  type Edge, 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Zap, Compass, LayoutGrid, Eye, Radio, 
  AlertOctagon, CheckCircle2, RotateCw, GitPullRequest, 
  DownloadCloud, Star, Network, Sparkles, TrendingUp, Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'sentinel' | 'optimizer' | 'hub';

// --- Shared Components ---
function TabButton({ id, icon, label, active, set }: any) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => set(id)}
      className={`relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-500 flex items-center gap-3 overflow-hidden ${
        isActive ? 'text-white' : 'text-slate-400 hover:text-indigo-300'
      }`}
    >
      {isActive && (
        <motion.div layoutId="nav-pill-p3" className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/20 border border-indigo-500/30 rounded-2xl backdrop-blur-md" />
      )}
      <span className="relative z-10 flex items-center gap-2">{icon} {label}</span>
      {isActive && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent blur-[1px]" />
      )}
    </button>
  );
}

export default function OmniQASentient() {
  const [activeTab, setActiveTab] = useState<Tab>('sentinel');

  return (
    <div className="flex flex-col h-screen bg-[#030014] text-slate-200 font-sans overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030014] to-black">
      
      {/* Sentient Navbar */}
      <header className="h-24 px-8 border-b border-indigo-900/30 bg-black/40 backdrop-blur-2xl flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-4 group">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 bg-fuchsia-600 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-700 animate-pulse" />
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-700 flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(192,38,211,0.5)]">
              <Network className="text-white w-5 h-5" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-fuchsia-300 tracking-wider">OmniQA <span className="font-light">Evolution</span></h1>
            <p className="text-[10px] text-fuchsia-400 font-mono tracking-[0.3em] uppercase mt-0.5">Sentient Architecture</p>
          </div>
        </div>
        
        <nav className="flex gap-2">
          <TabButton id="sentinel" icon={<Radio className="w-4 h-4"/>} label="The Live Sentinel" active={activeTab} set={setActiveTab} />
          <TabButton id="optimizer" icon={<Zap className="w-4 h-4"/>} label="Self-Optimizer" active={activeTab} set={setActiveTab} />
          <TabButton id="hub" icon={<LayoutGrid className="w-4 h-4"/>} label="Agentic Hub" active={activeTab} set={setActiveTab} />
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'sentinel' && <LiveSentinel key="sen" />}
          {activeTab === 'optimizer' && <SelfOptimizer key="opt" />}
          {activeTab === 'hub' && <AgenticHub key="hub" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ---------------------------------------------------------
// MODULE 7: THE LIVE SENTINEL
// ---------------------------------------------------------
const baseSentinelNodes: Node[] = [
  { id: '1', position: { x: 300, y: 50 }, data: { label: 'Home Page' }, type: 'input', style: { background: 'rgba(15, 23, 42, 0.7)', color: '#fff', border: '1px solid rgba(99, 102, 241, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '12px' } },
  { id: '2', position: { x: 300, y: 150 }, data: { label: 'Product Details' }, style: { background: 'rgba(15, 23, 42, 0.7)', color: '#fff', border: '1px solid rgba(99, 102, 241, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '12px' } },
  { id: '3', position: { x: 300, y: 250 }, data: { label: 'Add to Cart' }, style: { background: 'rgba(15, 23, 42, 0.7)', color: '#fff', border: '1px solid rgba(99, 102, 241, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '12px' } },
  { id: '4', position: { x: 300, y: 350 }, data: { label: 'Shipping Method' }, style: { background: 'rgba(15, 23, 42, 0.7)', color: '#fff', border: '1px solid rgba(99, 102, 241, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '12px' } },
  { id: '5', position: { x: 300, y: 450 }, data: { label: 'Payment' }, type: 'output', style: { background: 'rgba(15, 23, 42, 0.7)', color: '#fff', border: '1px solid rgba(99, 102, 241, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '12px' } },
];
const baseSentinelEdges: Edge[] = [
  { id: 'e1', source: '1', target: '2', style: { stroke: '#4f46e5' } },
  { id: 'e2', source: '2', target: '3', style: { stroke: '#4f46e5' } },
  { id: 'e3', source: '3', target: '4', style: { stroke: '#4f46e5' } },
  { id: 'e4', source: '4', target: '5', style: { stroke: '#4f46e5' } },
];

function LiveSentinel() {
  const [isLive, setIsLive] = useState(false);

  // Apply Live Traffic Heatmap Styling
  const nodes = baseSentinelNodes.map(n => {
    if (isLive && n.id === '4') { // Shipping Method (Drop-off)
      return { 
        ...n, 
        style: { ...n.style, background: 'rgba(239, 68, 68, 0.2)', border: '2px solid #ef4444', boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)' } 
      };
    }
    if (isLive && (n.id === '2' || n.id === '3')) { // High Traffic
      return {
        ...n,
        style: { ...n.style, background: 'rgba(249, 115, 22, 0.2)', border: '2px solid #f97316', boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)' }
      }
    }
    return n;
  });

  const edges = baseSentinelEdges.map(e => {
    if (isLive && (e.id === 'e1' || e.id === 'e2')) {
      return { ...e, animated: true, style: { stroke: '#f97316', strokeWidth: 3, filter: 'drop-shadow(0 0 5px #f97316)' } };
    }
    if (isLive && e.id === 'e3') {
      return { ...e, animated: true, style: { stroke: '#ef4444', strokeWidth: 3, filter: 'drop-shadow(0 0 5px #ef4444)' } };
    }
    return e;
  });

  // Unmapped Ghost Node
  if (isLive) {
    nodes.push({
      id: 'ghost', position: { x: 500, y: 300 }, data: { label: 'Unknown: Browser Back' },
      style: { background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '2px dashed #a855f7', borderRadius: '12px', boxShadow: '0 0 20px rgba(168,85,247,0.4)' }
    });
    edges.push({
      id: 'e-ghost', source: '4', target: 'ghost', animated: true, style: { stroke: '#a855f7', strokeDasharray: '5,5', strokeWidth: 2 }
    });
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex relative">
      
      {/* Radar Animation Background */}
      {isLive && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-indigo-500/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-indigo-500/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-indigo-500/30" />
          <motion.div 
            animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] origin-top-left bg-gradient-to-br from-indigo-500/10 to-transparent rounded-br-full"
          />
        </div>
      )}

      {/* Diagram Area */}
      <div className="flex-1 relative z-10">
        <ReactFlow nodes={nodes} edges={edges} fitView colorMode="dark" proOptions={{ hideAttribution: true }}>
          <Background color="rgba(99,102,241,0.05)" gap={30} size={2} />
        </ReactFlow>

        {/* Floating Toggle */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl border border-indigo-500/30 p-2 rounded-full flex items-center shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <button 
            onClick={() => setIsLive(!isLive)}
            className={`px-8 py-3 rounded-full text-sm font-bold flex items-center gap-3 transition-all duration-500 ${
              isLive ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)]' : 'bg-transparent text-slate-400 hover:text-white'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-white animate-pulse' : 'bg-slate-600'}`} />
            {isLive ? 'LIVE TELEMETRY ACTIVE' : 'ENABLE LIVE TRAFFIC'}
          </button>
        </div>
      </div>

      {/* Analytics Panel */}
      <AnimatePresence>
        {isLive && (
          <motion.div 
            initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="w-96 border-l border-indigo-500/20 bg-black/80 backdrop-blur-2xl p-8 flex flex-col shadow-[-30px_0_50px_rgba(0,0,0,0.8)] z-20"
          >
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <Eye className="text-indigo-400"/> Production Insights
            </h2>
            
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/20 blur-2xl rounded-full" />
                <div className="flex items-center gap-2 text-rose-400 font-bold mb-2">
                  <AlertOctagon className="w-5 h-5" /> Live Drop-off Detection
                </div>
                <p className="text-3xl font-black text-white mb-2">45%</p>
                <p className="text-sm text-slate-300">Users abandon cart at the <span className="text-rose-300 font-bold">'Shipping Method'</span> state. Critical bottleneck identified.</p>
              </div>

              <div className="p-5 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-fuchsia-500/20 blur-2xl rounded-full" />
                <div className="flex items-center gap-2 text-fuchsia-400 font-bold mb-2">
                  <Compass className="w-5 h-5" /> Unmapped Behavior Alert
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Users are clicking the 'Back' button to edit addresses, a path not present in the SSOT.
                </p>
                <div className="mt-4 flex items-center gap-2 bg-fuchsia-500/20 text-fuchsia-300 text-xs px-3 py-2 rounded-lg border border-fuchsia-500/30">
                  <Bot className="w-4 h-4" /> New edge case auto-generated
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

// ---------------------------------------------------------
// MODULE 8: THE SELF-OPTIMIZER
// ---------------------------------------------------------
function ParticleBackground() {
  const particles = Array.from({ length: 40 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-fuchsia-500/40 rounded-full blur-[1px]"
          initial={{
            x: Math.random() * (typeof window === 'undefined' ? 1000 : window.innerWidth),
            y: Math.random() * (typeof window === 'undefined' ? 1000 : window.innerHeight),
          }}
          animate={{
            y: [null, Math.random() * -500],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

function SelfOptimizer() {
  const [approved, setApproved] = useState(false);

  return (
    <div className="h-full flex flex-col relative bg-[#02000a]">
      <ParticleBackground />
      
      <div className="relative z-10 flex-1 flex flex-col p-10 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white flex items-center justify-center gap-3 mb-3">
            <RotateCw className="text-fuchsia-500 w-8 h-8" /> Autonomous Maintenance
          </h2>
          <p className="text-slate-400">The AI Engine Room is actively cleaning technical debt.</p>
        </div>

        {/* Split Screen Diagram Comparison Mock */}
        <div className="flex-1 flex gap-8 items-center justify-center mb-10">
          
          {/* Old Cluttered Diagram */}
          <div className="flex-1 h-full bg-slate-900/30 border border-slate-800 rounded-3xl p-6 flex flex-col relative overflow-hidden backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Current Architecture (50 Steps)</h3>
            <div className="flex-1 flex flex-col items-center justify-center opacity-40">
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-12 bg-slate-800 rounded-lg" />
                <div className="w-16 h-12 bg-slate-800 rounded-lg" />
                <div className="w-16 h-12 bg-rose-900/50 border border-rose-500/50 rounded-lg" />
              </div>
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-12 bg-slate-800 rounded-lg" />
                <div className="w-16 h-12 bg-rose-900/50 border border-rose-500/50 rounded-lg" />
              </div>
              <div className="flex gap-4">
                <div className="w-16 h-12 bg-slate-800 rounded-lg" />
                <div className="w-16 h-12 bg-slate-800 rounded-lg" />
                <div className="w-16 h-12 bg-slate-800 rounded-lg" />
                <div className="w-16 h-12 bg-slate-800 rounded-lg" />
              </div>
            </div>
            {/* Warning Overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-center">
              <p className="text-rose-400 text-sm font-bold">Redundancy Detected: High Tech Debt</p>
            </div>
          </div>

          <div className="w-12 h-12 rounded-full bg-black border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-500 shadow-[0_0_30px_rgba(192,38,211,0.4)] shrink-0 z-10">
            <GitPullRequest className="w-5 h-5" />
          </div>

          {/* New Optimized Diagram */}
          <div className="flex-1 h-full bg-indigo-900/10 border border-indigo-500/30 rounded-3xl p-6 flex flex-col relative overflow-hidden backdrop-blur-md shadow-[0_0_50px_rgba(99,102,241,0.1)]">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-6">AI Optimized Architecture (35 Steps)</h3>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="flex gap-6 mb-6">
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }} className="w-24 h-14 bg-indigo-600 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400" />
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.5 }} className="w-24 h-14 bg-indigo-600 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400" />
              </div>
              <div className="flex gap-6">
                <div className="w-24 h-14 bg-indigo-900/50 rounded-xl border border-indigo-500/50" />
                <div className="w-24 h-14 bg-indigo-900/50 rounded-xl border border-indigo-500/50" />
                <div className="w-24 h-14 bg-indigo-900/50 rounded-xl border border-indigo-500/50" />
              </div>
            </div>
            
            <AnimatePresence>
              {approved && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-0 bg-emerald-900/90 backdrop-blur-sm flex flex-col items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-16 h-16 mb-4" />
                  <p className="text-xl font-bold text-white">Refactoring Applied Successfully</p>
                  <p className="text-emerald-300 mt-2">Test suite pruned. Codebase optimized.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* AI Proposal Metrics & Action */}
        <div className="bg-black/60 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex items-center justify-between">
          <div className="space-y-3">
            <p className="text-white text-lg font-bold flex items-center gap-3">
              <AlertOctagon className="text-fuchsia-400 w-5 h-5" /> Redundant State Identified: 'Verify Email' is checked twice.
            </p>
            <p className="text-slate-400 flex items-center gap-3">
              <Sparkles className="text-indigo-400 w-5 h-5" /> Test Suite Auto-Pruning: Removing 20 outdated test cases to save 3 hours of run time.
            </p>
          </div>
          <button 
            onClick={() => setApproved(true)}
            disabled={approved}
            className="px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(192,38,211,0.4)] transition-all disabled:opacity-50 disabled:grayscale"
          >
            {approved ? 'Optimization Complete' : 'Approve Architecture Refactoring'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// MODULE 9: THE AGENTIC HUB
// ---------------------------------------------------------
const hubItems = [
  { id: 1, title: 'Enterprise OAuth Login', creator: 'Sarah (Senior QA)', uses: 14, score: 99.8, type: 'Auth' },
  { id: 2, title: 'Stripe Secure Checkout', creator: 'AI System Agent', uses: 42, score: 99.9, type: 'Payment' },
  { id: 3, title: 'GDPR Data Deletion Flow', creator: 'Marcus (Compliance)', uses: 8, score: 100, type: 'Legal' },
  { id: 4, title: 'Multi-step Onboarding', creator: 'Jane (UX Research)', uses: 23, score: 98.5, type: 'User Journey' },
];

function AgenticHub() {
  return (
    <div className="h-full bg-[#050510] overflow-y-auto p-10">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-white flex items-center gap-3 mb-2">
              <LayoutGrid className="text-blue-500 w-10 h-10" /> Agentic Hub
            </h2>
            <p className="text-slate-400 text-lg">Cross-Team Marketplace for Reusable State Machines</p>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/30 px-6 py-3 rounded-xl flex items-center gap-4 text-blue-300">
            <span className="font-bold">Your PMS Hub Score:</span>
            <span className="text-2xl font-black text-white">4,250</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {hubItems.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={item.id} 
              className="bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(59,130,246,0.15)] group relative overflow-hidden"
            >
              {/* Card BG Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all" />
              
              <div className="inline-block px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg mb-6 border border-slate-700">
                {item.type}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">{item.title}</h3>
              <p className="text-sm text-slate-400 flex items-center gap-2 mb-8">
                Created by: <span className="text-blue-400 font-medium">{item.creator}</span>
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><Network className="w-4 h-4"/> Adopted</span>
                  <span className="text-white font-bold">{item.uses} projects</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><Star className="w-4 h-4"/> Reliability</span>
                  <span className="text-emerald-400 font-bold">{item.score}%</span>
                </div>
              </div>

              <button className="w-full mt-6 py-3 bg-white/5 hover:bg-blue-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10 group-hover:border-transparent">
                <DownloadCloud className="w-4 h-4" /> Install Block
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
