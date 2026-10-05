"use client";

import { useState, } from 'react';
import { 
  ReactFlow, 
  Background, 
  type Node, 
  type Edge, 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  ShieldCheck, FileKey, Fingerprint, Lock,
  ScanSearch, FileCode2, GitMerge, Combine, Network, ScanLine, AlertTriangle, ScrollText, CheckCircle2, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'auditor' | 'reverse' | 'coder';

function TabButton({ id, icon, label, active, set }: any) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => set(id)}
      className={`relative px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-3 overflow-hidden ${
        isActive ? 'text-slate-900 bg-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
      }`}
    >
      <span className="relative z-10 flex items-center gap-2">{icon} {label}</span>
      {isActive && (
        <div className="absolute inset-0 bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)] z-0" />
      )}
    </button>
  );
}

export default function OmniQAGodMode() {
  const [activeTab, setActiveTab] = useState<Tab>('auditor');

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-slate-200 font-sans overflow-hidden border-t-4 border-amber-500/80">
      
      {/* God Mode Navbar */}
      <header className="h-28 px-10 border-b border-white/10 bg-[#09090b]/90 backdrop-blur-3xl flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <Combine className="text-slate-900 w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-widest uppercase">OmniQA <span className="font-light text-slate-400">Phase 4</span></h1>
            <p className="text-xs text-amber-500 font-mono tracking-[0.4em] uppercase mt-1 flex items-center gap-2">
              <Lock className="w-3 h-3" /> Enterprise Authority Level
            </p>
          </div>
        </div>
        
        <nav className="flex gap-2">
          <TabButton id="auditor" icon={<ShieldCheck className="w-4 h-4"/>} label="Compliance Auditor" active={activeTab} set={setActiveTab} />
          <TabButton id="reverse" icon={<ScanSearch className="w-4 h-4"/>} label="Reverse Engineer" active={activeTab} set={setActiveTab} />
          <TabButton id="coder" icon={<FileCode2 className="w-4 h-4"/>} label="Autonomous Coder" active={activeTab} set={setActiveTab} />
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'auditor' && <ComplianceAuditor key="aud" />}
          {activeTab === 'reverse' && <ReverseEngineer key="rev" />}
          {activeTab === 'coder' && <AutonomousCoder key="cod" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ---------------------------------------------------------
// MODULE 10: COMPLIANCE & SECURITY AUDITOR
// ---------------------------------------------------------
const baseAuditNodes: Node[] = [
  { id: '1', position: { x: 300, y: 50 }, data: { label: 'User Registration' }, type: 'input', style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px' } },
  { id: '2', position: { x: 300, y: 150 }, data: { label: 'Address Input (PII)' }, style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px' } },
  { id: '3', position: { x: 300, y: 250 }, data: { label: 'Payment Gateway (PCI)' }, style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px' } },
  { id: '4', position: { x: 300, y: 350 }, data: { label: 'Order Confirmation' }, type: 'output', style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px' } },
];
const baseAuditEdges: Edge[] = [
  { id: 'e1', source: '1', target: '2', style: { stroke: '#52525b' } },
  { id: 'e2', source: '2', target: '3', style: { stroke: '#52525b' } },
  { id: 'e3', source: '3', target: '4', style: { stroke: '#52525b' } },
];

function ComplianceAuditor() {
  const [isAuditing, setIsAuditing] = useState(false);
  const [reportReady, setReportReady] = useState(false);

  const handleAudit = () => {
    setIsAuditing(true);
    setReportReady(false);
    setTimeout(() => {
      setIsAuditing(false);
      setReportReady(true);
    }, 2500);
  };

  const nodes = baseAuditNodes.map(n => {
    if (reportReady && (n.id === '2' || n.id === '3')) {
      return { 
        ...n, 
        style: { 
          background: '#082f49', 
          color: '#38bdf8', 
          border: '2px solid #0ea5e9', 
          borderRadius: '4px',
          boxShadow: '0 0 40px rgba(14, 165, 233, 0.4)' 
        } 
      };
    }
    return n;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex relative bg-[#09090b]">
      {/* Diagram Area */}
      <div className="flex-1 relative border-r border-white/10">
        <ReactFlow nodes={nodes} edges={baseAuditEdges} fitView colorMode="dark" proOptions={{ hideAttribution: true }}>
          <Background color="rgba(255,255,255,0.02)" gap={40} size={1} />
        </ReactFlow>

        {reportReady && (
          <div className="absolute top-8 left-8 bg-sky-950/80 border border-sky-500/50 p-4 rounded-xl backdrop-blur-xl flex items-center gap-4 shadow-[0_0_30px_rgba(14,165,233,0.3)]">
            <ShieldCheck className="w-8 h-8 text-sky-400" />
            <div>
              <p className="text-sky-400 font-bold tracking-widest uppercase text-sm">PII / PCI Data Secured</p>
              <p className="text-xs text-sky-200/70">Nodes successfully encrypted via TLS 1.3</p>
            </div>
          </div>
        )}
      </div>

      {/* Control Terminal */}
      <div className="w-[450px] bg-[#121214] p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <Fingerprint className="text-slate-400 w-6 h-6" />
          <h2 className="text-xl font-bold text-white uppercase tracking-widest">Compliance Terminal</h2>
        </div>

        <button 
          onClick={handleAudit}
          disabled={isAuditing}
          className="w-full py-4 bg-white text-slate-900 font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isAuditing ? <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"/> : <FileKey className="w-5 h-5"/>}
          Generate SOC2 Audit Report
        </button>

        <AnimatePresence>
          {reportReady && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
              
              <div className="bg-emerald-950/30 border border-emerald-900 p-5 rounded-lg">
                <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-1">Data Privacy Traceability</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-xl font-black text-white">100% Compliant</span>
                </div>
              </div>

              <div className="bg-amber-950/30 border border-amber-900 p-5 rounded-lg">
                <p className="text-[10px] text-amber-500 uppercase tracking-widest font-bold mb-1">Security Guard Conditions</p>
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <span className="text-lg font-bold text-white">3 missing encryption states detected.</span>
                    <p className="text-xs text-amber-500/80 mt-1">Auto-blocking release pipeline to prevent compliance breach.</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 py-3 bg-transparent border border-white/20 text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                <ScrollText className="w-4 h-4"/> Export Audit Log (PDF/JSON)
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------
// MODULE 11: THE REVERSE ENGINEER
// ---------------------------------------------------------
function ReverseEngineer() {
  const [scanning, setScanning] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  const startScan = () => {
    if (scanning) { return; }
    setScanning(true);
    setNodes([]);
    setEdges([]);
    setScanProgress(0);

    const steps = [
      { n: { id: 'l1', position: { x: 250, y: 50 }, data: { label: 'Legacy Login' } }, delay: 1000 },
      { n: { id: 'l2', position: { x: 250, y: 150 }, data: { label: 'Main Menu (Undocumented)' }, style: { background: '#4c1d95' } }, e: { id: 'e1', source: 'l1', target: 'l2' }, delay: 2500 },
      { n: { id: 'l3', position: { x: 250, y: 250 }, data: { label: 'Record Entry' } }, e: { id: 'e2', source: 'l2', target: 'l3' }, delay: 4000 },
      { n: { id: 'l4', position: { x: 450, y: 150 }, data: { label: 'Admin Override (Hidden)' }, style: { background: '#9f1239' } }, e: { id: 'e3', source: 'l2', target: 'l4' }, delay: 5500 },
    ];

    let timer = 0;
    steps.forEach((step, i) => {
      timer = step.delay;
      setTimeout(() => {
        setNodes(prev => [...prev, { ...step.n, type: i===0?'input':'default', style: { ...step.n.style, borderRadius: 0, border: '1px solid #52525b' } }]);
        if (step.e) { setEdges(prev => [...prev, { ...step.e, animated: true, style: { stroke: '#a1a1aa' } }]); }
        setScanProgress(Math.floor(((i + 1) / steps.length) * 100));
        
        if (i === steps.length - 1) { setTimeout(() => setScanning(false), 1000); }
      }, timer);
    });
  };

  return (
    <div className="h-full flex bg-[#09090b]">
      
      {/* Left: Legacy System Mock */}
      <div className="flex-1 border-r border-white/10 relative overflow-hidden bg-slate-900 p-12">
        <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 text-[10px] text-green-500 font-mono border border-green-900">TARGET: http://internal-legacy.corp/v1/app.jsp</div>
        
        {/* Fake Ugly UI */}
        <div className="w-full max-w-md mx-auto mt-20 bg-gray-300 p-2 border-2 border-gray-400 shadow-[inset_2px_2px_0px_white,inset_-2px_-2px_0px_#888]">
          <div className="bg-blue-800 text-white font-bold px-2 py-1 text-sm flex justify-between">
            <span>Corporate System V2.1 (1998)</span>
            <span>_ X</span>
          </div>
          <div className="bg-gray-200 p-4 border-2 border-gray-100 shadow-[inset_-1px_-1px_0px_#888,inset_1px_1px_0px_white] mt-1 space-y-4">
            <p className="text-black text-sm">Please enter credentials to access Mainframe:</p>
            <div className="flex gap-2 items-center"><span className="text-black text-sm w-20">User ID:</span><input type="text" className="border border-gray-400 bg-white w-full" /></div>
            <div className="flex gap-2 items-center"><span className="text-black text-sm w-20">Password:</span><input type="password" className="border border-gray-400 bg-white w-full" /></div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="bg-gray-300 text-black border-2 border-gray-400 shadow-[inset_1px_1px_0px_white,inset_-1px_-1px_0px_#888] px-4 py-1 text-sm">Submit</button>
              <button className="bg-gray-300 text-black border-2 border-gray-400 shadow-[inset_1px_1px_0px_white,inset_-1px_-1px_0px_#888] px-4 py-1 text-sm">Cancel</button>
            </div>
          </div>
        </div>

        {/* Scanning Laser Overlay */}
        <AnimatePresence>
          {scanning && (
            <motion.div 
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_#22c55e] z-20 pointer-events-none"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-t from-green-500/20 to-transparent -translate-y-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: AI Canvas */}
      <div className="flex-1 relative flex flex-col">
        <div className="h-20 border-b border-white/10 bg-[#121214] flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <ScanLine className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Architecture Reconstruction</h2>
          </div>
          <button 
            onClick={startScan} disabled={scanning || nodes.length > 0}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-md transition-all"
          >
            {scanning ? `Scanning... ${scanProgress}%` : 'Init Reverse Engineering'}
          </button>
        </div>
        
        <div className="flex-1 relative bg-[#09090b]">
          {nodes.length === 0 && !scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 z-10 pointer-events-none">
              <Network className="w-16 h-16 mb-4 opacity-50" />
              <p className="font-mono text-sm uppercase tracking-widest">Awaiting System Target</p>
            </div>
          )}
          <ReactFlow nodes={nodes} edges={edges} fitView colorMode="dark" proOptions={{ hideAttribution: true }}>
            <Background color="rgba(255,255,255,0.05)" gap={20} size={1} />
          </ReactFlow>
        </div>

        {/* Dynamic Metrics */}
        <AnimatePresence>
          {nodes.length > 0 && (
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="h-32 bg-[#121214] border-t border-white/10 p-6 flex items-center justify-between z-10">
              <div className="flex gap-12">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Discovered States</p>
                  <p className="text-2xl font-black text-white">{nodes.length}</p>
                </div>
                <div>
                  <p className="text-[10px] text-amber-500 uppercase tracking-widest font-bold mb-1">Hidden Workflows Found</p>
                  <p className="text-2xl font-black text-amber-400">2 <span className="text-xs font-normal text-amber-500/70 ml-2">(Undocumented)</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-1">Test Coverage Generated</p>
                  <p className="text-2xl font-black text-emerald-400">100% <span className="text-xs font-normal text-emerald-500/70 ml-2">(Ready for Migration)</span></p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

// ---------------------------------------------------------
// MODULE 12: AUTONOMOUS FEATURE CODER
// ---------------------------------------------------------
const baseCoderNodes: Node[] = [
  { id: '1', position: { x: 50, y: 150 }, data: { label: 'Cart' }, type: 'input', style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px' } },
  { id: '2', position: { x: 250, y: 150 }, data: { label: 'Checkout' }, type: 'output', style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46', borderRadius: '4px' } },
];
const baseCoderEdges: Edge[] = [
  { id: 'e1', source: '1', target: '2', style: { stroke: '#52525b' } },
];

function AutonomousCoder() {
  const [coderState, setCoderState] = useState<'idle' | 'generating' | 'done'>('idle');
  const [nodes, setNodes] = useState(baseCoderNodes);
  const [edges, setEdges] = useState(baseCoderEdges);
  const [code, setCode] = useState('');

  const triggerCoding = () => {
    if (coderState !== 'idle') { return; }
    setCoderState('generating');
    
    // Add Node
    setNodes([
      nodes[0],
      { id: 'promo', position: { x: 150, y: 250 }, data: { label: 'Apply Promo Code' }, style: { background: '#0f172a', color: '#818cf8', border: '2px solid #6366f1', borderRadius: '4px' } },
      { ...nodes[1], position: { x: 300, y: 150 } }
    ]);
    setEdges([
      { id: 'e1-p', source: '1', target: 'promo', animated: true, style: { stroke: '#6366f1' } },
      { id: 'ep-2', source: 'promo', target: '2', animated: true, style: { stroke: '#6366f1' } }
    ]);

    // Typewriter effect for code
    const snippet = `// AUTO-GENERATED BY OMNIQA AGENT
import { applyDiscount } from '@/services/pricing';
import { validateCode } from '@/services/promos';

export async function applyPromoCode(cartId: string, code: string) {
  console.log('[Agentic Logger] Validating promo state');
  
  const isValid = await validateCode(code);
  if (!isValid) throw new Error("Invalid Code");

  const newTotal = await applyDiscount(cartId, code);
  return { success: true, newTotal };
}

// ✅ TDD Auto-Test Passed: 
// applyPromoCode('cart_123', 'SUMMER20') -> returns 20% off
`;
    let i = 0;
    const interval = setInterval(() => {
      setCode(snippet.slice(0, i));
      i+=3;
      if (i > snippet.length + 5) {
        clearInterval(interval);
        setCoderState('done');
      }
    }, 10);
  };

  return (
    <div className="h-full flex bg-[#09090b]">
      
      {/* Left: Workflow Map */}
      <div className="flex-1 relative flex flex-col border-r border-white/10">
        <div className="p-6 border-b border-white/10 flex justify-between items-center z-10 bg-[#09090b]">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2"><Network className="w-4 h-4"/> Business Intent Map</h2>
          <button 
            onClick={triggerCoding} disabled={coderState !== 'idle'}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Plus className="w-3 h-3" /> Add State: Promo Code
          </button>
        </div>
        
        <div className="flex-1 relative">
          <ReactFlow nodes={nodes} edges={edges} fitView colorMode="dark" proOptions={{ hideAttribution: true }}>
            <Background color="rgba(255,255,255,0.05)" gap={20} size={1} />
          </ReactFlow>
        </div>
      </div>

      {/* Right: Autonomous IDE */}
      <div className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden">
        {/* IDE Header */}
        <div className="h-14 border-b border-white/10 bg-[#121214] flex items-center px-4 gap-2 z-10 shrink-0">
          <div className="w-3 h-3 rounded-full bg-rose-500/50" />
          <div className="w-3 h-3 rounded-full bg-amber-500/50" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
          <div className="w-px h-6 bg-white/10 mx-2" />
          <span className="text-xs text-slate-500 font-mono">promoService.ts</span>
        </div>

        {/* Code Area */}
        <div className="flex-1 p-6 font-mono text-sm text-indigo-300 whitespace-pre-wrap overflow-y-auto">
          {coderState === 'idle' && <span className="text-slate-600 italic">// Waiting for intent injection...</span>}
          {code}
          {coderState === 'generating' && <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse ml-1 align-middle" />}
        </div>

        {/* Status & Merge Footer */}
        <div className="bg-[#121214] border-t border-white/10 p-6 z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Agent Status</p>
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                {coderState === 'idle' ? <span className="text-slate-400">Idle</span> : 
                 coderState === 'generating' ? <><div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"/> Writing backend logic...</> : 
                 <><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Compilation Successful</>}
              </div>
            </div>
            
            <div className="space-y-1 text-right">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">TDD Check</p>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-2 justify-end">
                {coderState === 'done' ? 'Code passed all auto-tests' : 'Awaiting compilation'}
              </div>
            </div>
          </div>

          <button 
            disabled={coderState !== 'done'}
            className="w-full py-4 bg-white text-slate-900 hover:bg-slate-200 disabled:bg-white/5 disabled:text-slate-600 disabled:cursor-not-allowed font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-3"
          >
            <GitMerge className="w-5 h-5"/> Merge Feature to Production
          </button>
        </div>
      </div>

    </div>
  );
}
