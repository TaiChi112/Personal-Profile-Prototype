"use client";

import type React from 'react';
import { useState, useCallback } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  applyNodeChanges, 
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  MarkerType,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Activity, Settings, Cpu, Bot, GitBranch, ArrowRight, Download, 
  AlertTriangle, CheckSquare, Target
} from 'lucide-react';
import { motion, } from 'framer-motion';

const baseNodes: Node[] = [
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'Start: Order Placed' }, type: 'input', style: { color: '#0f172a', fontWeight: 'bold' } },
  { id: '2', position: { x: 250, y: 150 }, data: { label: 'Payment Processing' }, style: { color: '#0f172a', fontWeight: 'bold' } },
  { id: '3', position: { x: 250, y: 250 }, data: { label: 'Order Fulfilled' }, type: 'output', style: { color: '#0f172a', fontWeight: 'bold' } },
];

const baseEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-3', source: '2', target: '3', markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function AgenticTestingPage() {
  const [nodes, setNodes] = useState<Node[]>(baseNodes);
  const [edges, setEdges] = useState<Edge[]>(baseEdges);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<{id: string, text: string, type: 'info'|'mcp'|'success'}[]>([]);
  
  // Version Control State
  const [version, setVersion] = useState<'v1.0' | 'v2.0'>('v1.0');
  const [v2Nodes, setV2Nodes] = useState<Node[]>([]);
  const [v2Edges, setV2Edges] = useState<Edge[]>([]);

  // Enterprise Metrics
  const [metrics, setMetrics] = useState({
    testCases: 8,
    complexity: 15,
    qaScore: 92,
    coverage: 85,
    edgeCasesFound: 12,
    highRiskNodes: 1,
    medRiskNodes: 2,
    lowRiskNodes: 0
  });

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (version === 'v1.0') { setNodes((nds) => applyNodeChanges(changes, nds)); }
      else { setV2Nodes((nds) => applyNodeChanges(changes, nds)); }
    },
    [version]
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (version === 'v1.0') { setEdges((eds) => applyEdgeChanges(changes, eds)); }
      else { setV2Edges((eds) => applyEdgeChanges(changes, eds)); }
    },
    [version]
  );

  const addLog = (text: string, type: 'info'|'mcp'|'success' = 'info') => {
    setLogs(prev => [...prev, { id: Date.now().toString() + Math.random(), text, type }]);
  };

  const handleProcessIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) { return; }
    
    const userIntent = input;
    setInput('');
    setIsProcessing(true);
    addLog(`User Intent: "${userIntent}"`, 'info');

    try {
      const response = await fetch('/api/agentic-testing/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userIntent, currentNodes: nodes, currentEdges: edges })
      });

      if (!response.ok) { throw new Error('API Error'); }
      const data = await response.json();

      addLog(`AI Action: ${data.impact.logMessage}`, 'success');

      // Create V2 proposed state
      let updatedNodes = [...nodes];
      let updatedEdges = [...edges];

      if (data.nodesToAdd && data.nodesToAdd.length > 0) {
        // Adjust existing nodes downward
        updatedNodes = updatedNodes.map(n => ({
          ...n,
          position: { x: n.position.x, y: n.position.y + (data.nodesToAdd.length * 100) },
          style: { ...n.style, opacity: 0.6 } // Dim old nodes in diff view
        }));
        
        // Add new nodes with highlight
        const newNodes: Node[] = data.nodesToAdd.map((n: any, index: number) => ({
          id: n.id,
          position: { x: 250, y: 150 + (index * 100) },
          data: { label: n.label + ' ✨' },
          style: { 
            border: '2px dashed #10b981', 
            background: '#ecfdf5', 
            color: '#047857', 
            fontWeight: 'bold',
            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1)'
          }
        }));
        updatedNodes = [...updatedNodes, ...newNodes];
      }

      if (data.edgesToRemove && data.edgesToRemove.length > 0) {
        // Mark removed edges as red dashed
        updatedEdges = updatedEdges.map(e => {
          if (data.edgesToRemove.includes(e.id)) {
            return { ...e, style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5 5' }, animated: false };
          }
          return e;
        });
      }

      if (data.edgesToAdd && data.edgesToAdd.length > 0) {
        const addedEdges = data.edgesToAdd.map((e: any) => ({
          id: e.id || `e-${e.source}-${e.target}`,
          source: e.source,
          target: e.target,
          markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
          style: { stroke: '#10b981', strokeWidth: 2 },
          animated: true
        }));
        updatedEdges = [...updatedEdges, ...addedEdges];
      }

      setV2Nodes(updatedNodes);
      setV2Edges(updatedEdges);
      setVersion('v2.0'); // Auto-switch to V2

      // Update Enterprise Metrics
      setMetrics(prev => ({
        ...prev,
        testCases: prev.testCases + data.impact.testCasesAdded,
        complexity: prev.complexity + data.impact.complexityIncrease,
        qaScore: Math.min(100, prev.qaScore + 3), // Positive reinforcement
        coverage: Math.min(100, prev.coverage + 2),
        edgeCasesFound: prev.edgeCasesFound + Math.floor(Math.random() * 3) + 1,
        highRiskNodes: prev.highRiskNodes + 1,
        medRiskNodes: prev.medRiskNodes + (data.nodesToAdd.length - 1 > 0 ? 1 : 0)
      }));

    } catch (err) {
      addLog('Error communicating with AI Backend', 'info');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportPMS = () => {
    alert("Exporting QA Performance Data to HR/PMS System...");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      
      {/* LEFT SIDEBAR: QA Scorecard & Risk Panel */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col overflow-y-auto">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" /> QA Performance
          </h2>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <div className="flex justify-between items-end mb-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">Sprint Score</span>
              <span className="text-3xl font-black text-indigo-700 dark:text-indigo-300">{metrics.qaScore}</span>
            </div>
            <div className="w-full bg-indigo-200 dark:bg-indigo-900/50 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full" style={{ width: `${metrics.qaScore}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="flex flex-col">
                <span className="text-slate-500">Coverage</span>
                <span className="font-bold">{metrics.coverage}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500">Edge Cases</span>
                <span className="font-bold">{metrics.edgeCasesFound}</span>
              </div>
            </div>
          </div>
          
          <button onClick={handleExportPMS} className="mt-4 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
            <Download className="w-4 h-4" /> Export to PMS
          </button>
        </div>

        <div className="p-5 flex-1">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Risk-Based Weighting
          </h2>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-red-700 dark:text-red-400">High Risk Nodes</span>
                <span className="px-2 py-0.5 bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300 rounded text-xs font-bold">{metrics.highRiskNodes}</span>
              </div>
              <p className="text-xs text-red-600/80 dark:text-red-400/80">Requires exhaustive path testing. (+{metrics.highRiskNodes * 5} TC)</p>
            </div>
            
            <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-amber-700 dark:text-amber-400">Medium Risk Nodes</span>
                <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 rounded text-xs font-bold">{metrics.medRiskNodes}</span>
              </div>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80">Requires positive & negative testing. (+{metrics.medRiskNodes * 3} TC)</p>
            </div>

            <div className="p-3 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900/30">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-green-700 dark:text-green-400">Low Risk Nodes</span>
                <span className="px-2 py-0.5 bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded text-xs font-bold">{metrics.lowRiskNodes}</span>
              </div>
              <p className="text-xs text-green-600/80 dark:text-green-400/80">Happy path testing only. (+{metrics.lowRiskNodes * 1} TC)</p>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER PANEL: Visual Diff Diagram */}
      <div className="flex-1 flex flex-col">
        {/* Header & Version Control */}
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="text-blue-600 w-6 h-6" />
            <h1 className="text-lg font-bold">Agentic Testing Simulator</h1>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-md text-xs font-bold ml-2">ENTERPRISE</span>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
            <button 
              onClick={() => setVersion('v1.0')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${version === 'v1.0' ? 'bg-white dark:bg-slate-800 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
            >
              v1.0 Current
            </button>
            <button 
              onClick={() => setVersion('v2.0')}
              disabled={v2Nodes.length === 0}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${version === 'v2.0' ? 'bg-blue-600 shadow text-white' : 'text-slate-500 hover:text-slate-700 disabled:opacity-30'}`}
            >
              <GitBranch className="w-4 h-4" /> v2.0 Proposed
            </button>
          </div>
        </div>

        {/* Diagram Canvas */}
        <div className="flex-1 relative bg-slate-50/50 dark:bg-slate-900/50">
          <ReactFlow 
            nodes={version === 'v1.0' ? nodes : v2Nodes} 
            edges={version === 'v1.0' ? edges : v2Edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            colorMode="system"
          >
            <Background gap={16} size={1.5} color="#cbd5e1" />
            <Controls />
            {version === 'v2.0' && (
              <Panel position="top-center" className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-full font-semibold text-sm shadow-sm flex items-center gap-2 mt-4 border border-emerald-200 dark:border-emerald-800">
                <CheckSquare className="w-4 h-4" /> Visual Diff: Highlighted changes generated by AI
              </Panel>
            )}
          </ReactFlow>
        </div>

        {/* NLP Input Bar */}
        <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <form onSubmit={handleProcessIntent} className="flex gap-3 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Settings className={`w-5 h-5 ${isProcessing ? 'text-blue-500 animate-spin' : 'text-slate-400'}`} />
              </div>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Instruct AI to modify workflow (e.g., 'Add a manual review step before order fulfillment')"
                disabled={isProcessing}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 text-sm shadow-sm"
              />
            </div>
            <button 
              type="submit" 
              disabled={isProcessing || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {isProcessing ? 'Processing...' : 'Execute'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDEBAR: MCP Logs & Global Metrics */}
      <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col">
        
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Global Impact
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
              <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">Total Test Cases</div>
              <div className="text-xl font-black text-slate-800 dark:text-slate-100">{metrics.testCases}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
              <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">Complexity</div>
              <div className="text-xl font-black text-slate-800 dark:text-slate-100">{metrics.complexity}%</div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider p-5 pb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4" /> MCP Execution Log
          </h2>
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 font-mono text-[11px]">
            {logs.length === 0 ? (
              <div className="text-slate-400 text-center mt-10 italic border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6">Awaiting AI execution...</div>
            ) : (
              logs.map((log) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  key={log.id}
                  className={`p-2.5 rounded-md border flex items-start gap-2 ${
                    log.type === 'mcp' 
                      ? 'bg-slate-900 text-green-400 border-slate-800 shadow-inner' 
                      : log.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="mt-0.5 opacity-50">{'>'}</span>
                  <span className="break-all">{log.text}</span>
                </motion.div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
