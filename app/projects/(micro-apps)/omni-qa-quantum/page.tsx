"use client";

import { useState, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  type Node, 
  type Edge, 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Network, Globe, Smartphone, Hexagon, ShieldAlert,
  Bot, Database, CloudLightning,CheckCircle2, ChevronRight, Wand2, Orbit, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'swarm' | 'bridge' | 'generative';

function TabButton({ id, icon, label, active, set }: any) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => set(id)}
      className={`relative px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] transition-all duration-700 flex items-center gap-3 overflow-hidden ${
        isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      <span className="relative z-10 flex items-center gap-2">{icon} {label}</span>
      {isActive && (
        <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] z-0" />
      )}
    </button>
  );
}

export default function OmniQAQuantum() {
  const [activeTab, setActiveTab] = useState<Tab>('swarm');

  return (
    <div className="flex flex-col h-screen bg-[#000005] text-slate-200 font-sans overflow-hidden">
      
      {/* Quantum Navbar */}
      <header className="h-24 px-10 border-b border-indigo-500/20 bg-[#000005]/80 backdrop-blur-3xl flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-5 group">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} className="absolute inset-0 border border-indigo-500/30 rounded-full" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} className="absolute inset-2 border border-fuchsia-500/30 rounded-full" />
            <Orbit className="text-indigo-400 w-6 h-6 absolute" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-[0.2em] uppercase">OmniQA <span className="font-light text-slate-500">Phase 5</span></h1>
            <p className="text-[10px] text-fuchsia-500 font-mono tracking-[0.4em] uppercase mt-1 flex items-center gap-2">
              <Hexagon className="w-3 h-3" /> Ecosystem & Swarm Intelligence
            </p>
          </div>
        </div>
        
        <nav className="flex gap-4">
          <TabButton id="swarm" icon={<Network className="w-4 h-4"/>} label="Swarm Debugger" active={activeTab} set={setActiveTab} />
          <TabButton id="bridge" icon={<Globe className="w-4 h-4"/>} label="Omni-Bridge" active={activeTab} set={setActiveTab} />
          <TabButton id="generative" icon={<Smartphone className="w-4 h-4"/>} label="Generative Sandbox" active={activeTab} set={setActiveTab} />
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'swarm' && <SwarmDebugger key="sw" />}
          {activeTab === 'bridge' && <OmniBridge key="ob" />}
          {activeTab === 'generative' && <GenerativeSandbox key="gs" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ---------------------------------------------------------
// MODULE 13: THE SWARM DEBUGGER
// ---------------------------------------------------------
const swarmNodes: Node[] = [
  { id: 'ui', position: { x: 200, y: 150 }, data: { label: 'UI Gateway' }, style: { background: '#09090b', color: '#fff', border: '1px solid #27272a' } },
  { id: 'auth', position: { x: 400, y: 50 }, data: { label: 'Auth Service' }, style: { background: '#09090b', color: '#fff', border: '1px solid #27272a' } },
  { id: 'api', position: { x: 400, y: 250 }, data: { label: 'Payment API' }, style: { background: '#09090b', color: '#fff', border: '1px solid #27272a' } },
  { id: 'db1', position: { x: 600, y: 150 }, data: { label: 'User DB' }, style: { background: '#09090b', color: '#fff', border: '1px solid #27272a' } },
  { id: 'db2', position: { x: 600, y: 350 }, data: { label: 'Ledger DB' }, style: { background: '#09090b', color: '#fff', border: '1px solid #27272a' } },
];
const swarmEdges: Edge[] = [
  { id: 'e1', source: 'ui', target: 'auth', style: { stroke: '#3f3f46' } },
  { id: 'e2', source: 'ui', target: 'api', style: { stroke: '#3f3f46' } },
  { id: 'e3', source: 'auth', target: 'db1', style: { stroke: '#3f3f46' } },
  { id: 'e4', source: 'api', target: 'db2', style: { stroke: '#3f3f46' } },
  { id: 'e5', source: 'api', target: 'db1', style: { stroke: '#3f3f46' } },
];

function SwarmDebugger() {
  const [swarmState, setSwarmState] = useState<'idle' | 'deploying' | 'resolved'>('idle');
  const [logs, setLogs] = useState<{ id: number, agent: string, msg: string, color: string }[]>([]);

  const deploySwarm = () => {
    if (swarmState !== 'idle') { return; }
    setSwarmState('deploying');
    setLogs([]);

    const events = [
      { agent: 'Orchestrator', msg: 'Critical Outage detected at Payment API. Deploying swarm...', color: 'text-indigo-400', d: 500 },
      { agent: 'DB_Agent', msg: 'Analyzing Ledger DB locks... No deadlocks found.', color: 'text-emerald-400', d: 2000 },
      { agent: 'Auth_Agent', msg: 'JWT tokens are valid. Auth is nominal.', color: 'text-sky-400', d: 3500 },
      { agent: 'API_Agent', msg: '⚠️ Timeout triggered! Query to User DB is taking >5000ms.', color: 'text-rose-400', d: 5000 },
      { agent: 'DB_Agent', msg: 'Found it! Missing index on user_id column causing full table scan during payment validation.', color: 'text-amber-400', d: 6500 },
      { agent: 'Orchestrator', msg: 'Root cause isolated. Generating auto-patch migration script.', color: 'text-fuchsia-400', d: 8000 }
    ];

    events.forEach((ev, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, { id: i, agent: ev.agent, msg: ev.msg, color: ev.color }]);
        if (i === events.length - 1) { setSwarmState('resolved'); }
      }, ev.d);
    });
  };

  const getDynamicNodes = () => {
    if (swarmState === 'idle') { return swarmNodes; }
    return swarmNodes.map(n => {
      if (n.id === 'api') { return { ...n, style: { background: 'rgba(225, 29, 72, 0.2)', border: '1px solid #e11d48', boxShadow: '0 0 30px rgba(225,29,72,0.4)' } }; }
      if (n.id === 'db1' && swarmState === 'resolved') { return { ...n, style: { background: 'rgba(217, 119, 6, 0.2)', border: '1px solid #d97706', boxShadow: '0 0 30px rgba(217,119,6,0.4)' } }; }
      return n;
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex relative bg-[#000005]">
      
      {/* Network Map */}
      <div className="flex-1 relative border-r border-indigo-500/20">
        <ReactFlow nodes={getDynamicNodes()} edges={swarmEdges} fitView colorMode="dark" proOptions={{ hideAttribution: true }}>
          <Background color="rgba(255,255,255,0.05)" gap={30} size={1} />
        </ReactFlow>

        {/* Floating Action / Stats */}
        <div className="absolute top-8 left-8 flex flex-col gap-6 z-10">
          <button 
            onClick={deploySwarm} disabled={swarmState !== 'idle'}
            className="px-8 py-4 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900/50 disabled:text-rose-400/50 text-white font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(225,29,72,0.4)]"
          >
            <ShieldAlert className="w-5 h-5"/> {swarmState === 'idle' ? 'Deploy Agent Swarm' : 'Swarm Deployed'}
          </button>
          
          <AnimatePresence>
            {swarmState !== 'idle' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-black/60 border border-indigo-500/30 p-6 rounded-2xl backdrop-blur-xl">
                <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold mb-1">Swarm Status</p>
                <p className="text-xl font-black text-white mb-4">5 Specialized Agents Active</p>
                
                <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold mb-1">Root Cause Isolated</p>
                <p className="text-xl font-black text-white">{swarmState === 'resolved' ? '4.2 seconds' : 'Searching...'}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Swarm Agents Animation Layer */}
        {swarmState !== 'idle' && (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <motion.div 
              animate={{ x: [400, 600, 400], y: [50, 150, 50] }} transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute w-6 h-6 bg-emerald-500 rounded-full blur-[10px] mix-blend-screen"
            />
            <motion.div 
              animate={{ x: [200, 400, 200], y: [150, 250, 150] }} transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute w-6 h-6 bg-rose-500 rounded-full blur-[10px] mix-blend-screen"
            />
            <motion.div 
              animate={{ x: [400, 600, 400], y: [250, 150, 250] }} transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute w-6 h-6 bg-amber-500 rounded-full blur-[10px] mix-blend-screen"
            />
          </div>
        )}
      </div>

      {/* Mini Chat / Intelligence Panel */}
      <div className="w-[450px] bg-[#05050a] flex flex-col z-10">
        <div className="p-8 border-b border-indigo-500/20">
          <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-3">
            <Bot className="w-5 h-5"/> Swarm Intelligence Comm-Link
          </h2>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto space-y-4 font-mono text-sm">
          {logs.map(log => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={log.id} className="flex flex-col gap-1">
              <span className={`font-bold ${log.color}`}>[{log.agent}]</span>
              <span className="text-slate-300 pl-4 border-l border-white/10 ml-2">{log.msg}</span>
            </motion.div>
          ))}
          {swarmState === 'deploying' && (
            <div className="pl-4 ml-2 flex gap-1">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"/>
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}/>
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}/>
            </div>
          )}
        </div>

        {swarmState === 'resolved' && (
          <div className="p-6 bg-indigo-950/30 border-t border-indigo-500/30">
            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(79,70,229,0.4)]">
              <Database className="w-5 h-5" /> Apply Auto-Patch
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------
// MODULE 14: THE OMNI-BRIDGE
// ---------------------------------------------------------
const bridgeNodesInternal: Node[] = [
  { id: 'i1', position: { x: 100, y: 150 }, data: { label: 'Order Processing' }, style: { background: '#09090b', color: '#fff', border: '1px solid #3b82f6' } },
  { id: 'i2', position: { x: 100, y: 350 }, data: { label: 'Save for Later (Fallback)' }, style: { background: '#09090b', color: '#a1a1aa', border: '1px dashed #52525b' } },
];
const bridgeNodesExternal: Node[] = [
  { id: 'e1', position: { x: 500, y: 100 }, data: { label: 'Stripe API (Payment)' }, style: { background: '#312e81', color: '#fff', border: '1px solid #4f46e5' } },
  { id: 'e2', position: { x: 500, y: 250 }, data: { label: 'DHL API (Shipping)' }, style: { background: '#713f12', color: '#fff', border: '1px solid #ca8a04' } },
];
const bridgeEdges: Edge[] = [
  { id: 'edge1', source: 'i1', target: 'e1', animated: true, style: { stroke: '#4f46e5' } },
  { id: 'edge2', source: 'i1', target: 'e2', animated: true, style: { stroke: '#ca8a04' } },
];

function OmniBridge() {
  const [outage, setOutage] = useState(false);

  const getNodes = () => {
    const external = bridgeNodesExternal.map(n => {
      if (outage && n.id === 'e1') {
        return { ...n, style: { background: '#18181b', color: '#52525b', border: '1px solid #ef4444' } }; // Stripe Offline
      }
      return n;
    });
    
    const internal = bridgeNodesInternal.map(n => {
      if (outage && n.id === 'i2') {
        return { ...n, style: { background: '#064e3b', color: '#34d399', border: '1px solid #10b981', boxShadow: '0 0 20px rgba(16,185,129,0.3)' } }; // Fallback active
      }
      return n;
    });

    return [...internal, ...external];
  };

  const getEdges = () => {
    let edges = [...bridgeEdges];
    if (outage) {
      edges = edges.map(e => e.id === 'edge1' ? { ...e, animated: false, style: { stroke: '#ef4444', strokeDasharray: '5,5' } } : e);
      edges.push({ id: 'fallback-edge', source: 'i1', target: 'i2', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } });
    }
    return edges;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col bg-[#000005]">
      
      {/* Top Control Bar */}
      <div className="h-24 bg-[#05050a] border-b border-indigo-500/20 px-10 flex items-center justify-between z-10">
        <div>
          <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-3">
            <Globe className="w-5 h-5"/> Cross-Enterprise State Mapping
          </h2>
          <p className="text-slate-500 text-xs mt-1">Monitor external API dependencies and test internal resilience.</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setOutage(!outage)}
            className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-3 ${
              outage ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]' : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <CloudLightning className="w-4 h-4"/> {outage ? 'Restore Stripe API' : 'Simulate Stripe Outage'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Divided Canvas */}
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/10 z-0" />
        <div className="absolute top-4 left-1/4 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full border border-indigo-500/30 text-indigo-400 text-xs font-bold tracking-widest uppercase z-10 backdrop-blur-md">
          Internal Systems (OmniQA)
        </div>
        <div className="absolute top-4 left-3/4 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full border border-fuchsia-500/30 text-fuchsia-400 text-xs font-bold tracking-widest uppercase z-10 backdrop-blur-md">
          3rd Party Vendors
        </div>

        <ReactFlow nodes={getNodes()} edges={getEdges()} fitView colorMode="dark" proOptions={{ hideAttribution: true }}>
          <Background color="rgba(255,255,255,0.02)" gap={40} size={2} />
        </ReactFlow>

        {/* Resilience Metrics Overlay */}
        <AnimatePresence>
          {outage && (
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-rose-500/30 p-6 rounded-2xl flex gap-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-20">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Vendor Dependency Risk</p>
                <p className="text-xl font-black text-rose-400">Medium (Degraded)</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Fallback State Success</p>
                <p className="text-xl font-black text-emerald-400">100% Active</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">SLA Violation</p>
                <p className="text-xl font-black text-amber-400">Auto-Reported to Vendor</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------
// MODULE 15: THE GENERATIVE UI SANDBOX
// ---------------------------------------------------------
const genNodes: Node[] = [
  { id: 'g1', position: { x: 100, y: 50 }, data: { label: 'Cart Overview' }, style: { background: '#09090b', color: '#fff', border: '1px solid #3f3f46' } },
  { id: 'g2', position: { x: 100, y: 150 }, data: { label: 'Apply Promo Code' }, style: { background: '#1e1b4b', color: '#818cf8', border: '2px solid #6366f1', boxShadow: '0 0 30px rgba(99,102,241,0.3)' } },
  { id: 'g3', position: { x: 100, y: 250 }, data: { label: 'Secure Checkout' }, style: { background: '#09090b', color: '#fff', border: '1px solid #3f3f46' } },
];
const genEdges: Edge[] = [
  { id: 'eg1', source: 'g1', target: 'g2', style: { stroke: '#3f3f46' } },
  { id: 'eg2', source: 'g2', target: 'g3', style: { stroke: '#3f3f46' } },
];

function GenerativeSandbox() {
  const [promoCode, setPromoCode] = useState('');
  const [activeEdge, setActiveEdge] = useState(false);

  useEffect(() => {
    if (promoCode.length > 0) {
      setActiveEdge(true);
      const to = setTimeout(() => setActiveEdge(false), 500);
      return () => clearTimeout(to);
    }
  }, [promoCode]);

  const edges = genEdges.map(e => {
    if (e.id === 'eg2' && activeEdge) {
      return { ...e, animated: true, style: { stroke: '#6366f1', strokeWidth: 3 } };
    }
    return e;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex bg-[#000005]">
      
      {/* Left: Logic Map */}
      <div className="flex-1 relative border-r border-indigo-500/20 flex flex-col">
        <div className="p-6 bg-[#05050a] border-b border-indigo-500/20 z-10">
          <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-3">
            <Network className="w-5 h-5"/> Logical State Foundation
          </h2>
        </div>
        <div className="flex-1 relative">
          <ReactFlow nodes={genNodes} edges={edges} fitView colorMode="dark" proOptions={{ hideAttribution: true }}>
            <Background color="rgba(255,255,255,0.05)" gap={30} size={1} />
          </ReactFlow>
        </div>
      </div>

      {/* Right: Generative UI Mockup */}
      <div className="flex-1 bg-[#05050a] flex flex-col relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full z-0 pointer-events-none" />

        <div className="p-6 border-b border-indigo-500/20 z-10 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-fuchsia-400 uppercase tracking-widest flex items-center gap-3">
              <Wand2 className="w-5 h-5"/> Generative Manifestation
            </h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Live interaction directly syncs with State Logic</p>
          </div>
          <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-all flex items-center gap-2">
            Export to Figma <ChevronRight className="w-4 h-4"/>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 z-10">
          
          {/* Mobile Phone Mockup */}
          <div className="w-[320px] h-[600px] bg-white rounded-[40px] border-8 border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative">
            <div className="bg-slate-50 p-6 pt-12 border-b border-slate-200">
              <h3 className="text-slate-900 font-bold text-xl mb-1">Your Cart</h3>
              <p className="text-slate-500 text-sm">2 items • $140.00</p>
            </div>

            <div className="flex-1 p-6 flex flex-col gap-6 bg-white">
              {/* Product Mock */}
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-slate-200 rounded-xl" />
                <div>
                  <p className="text-slate-800 font-bold">Premium Wireless Earbuds</p>
                  <p className="text-indigo-600 font-bold mt-1">$140.00</p>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* The Highlighted State UI Component */}
              <div className="relative">
                <div className="absolute -inset-2 bg-indigo-50 border border-indigo-200 rounded-xl pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Auto-Generated Promo State
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code..."
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold">Apply</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200">
              <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30">
                Proceed to Checkout
              </button>
            </div>
          </div>

        </div>
        
        {/* Analytics Footer */}
        <div className="h-24 bg-[#020205] border-t border-indigo-500/20 px-8 flex items-center justify-between z-10">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Generative UI Confidence</p>
            <p className="text-lg font-black text-emerald-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> High (98.4%)</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">A/B Test Variations Auto-Generated</p>
            <p className="text-lg font-black text-fuchsia-400">3 Ready for Deployment</p>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
