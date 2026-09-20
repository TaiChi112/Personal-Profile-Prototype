"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  applyNodeChanges, 
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  MarkerType,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Send, Activity, Settings, Cpu, Bot, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialNodes: Node[] = [
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'Start: Order Placed' }, type: 'input', style: { color: '#0f172a', fontWeight: 'bold' } },
  { id: '2', position: { x: 250, y: 150 }, data: { label: 'Payment Processing' }, style: { color: '#0f172a', fontWeight: 'bold' } },
  { id: '3', position: { x: 250, y: 250 }, data: { label: 'Order Fulfilled' }, type: 'output', style: { color: '#0f172a', fontWeight: 'bold' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-3', source: '2', target: '3', markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function AgenticTestingPage() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<{id: string, text: string, type: 'info'|'mcp'|'success'}[]>([]);
  
  const [metrics, setMetrics] = useState({
    testCases: 8,
    complexity: 15,
    qaScore: 92
  });

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const addLog = (text: string, type: 'info'|'mcp'|'success' = 'info') => {
    setLogs(prev => [...prev, { id: Date.now().toString() + Math.random(), text, type }]);
  };

  const handleProcessIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userIntent = input;
    setInput('');
    setIsProcessing(true);
    addLog(`User Intent: "${userIntent}"`, 'info');

    // Simulate Agentic Thinking & MCP Execution
    setTimeout(() => {
      addLog('Call MCP Tool: [analyze_workflow_intent]', 'mcp');
    }, 800);

    setTimeout(() => {
      addLog('Call MCP Tool: [generate_state_node]', 'mcp');
    }, 1800);

    setTimeout(() => {
      addLog('Call MCP Tool: [calculate_impact_metric]', 'mcp');
      
      // Mutate diagram
      const newNodeId = (nodes.length + 1).toString();
      const newNode: Node = {
        id: newNodeId,
        position: { x: 250, y: 200 },
        data: { label: `Auto-Generated: ${userIntent.substring(0, 15)}...` },
        style: { border: '2px solid #3b82f6', background: '#eff6ff', color: '#0f172a', fontWeight: 'bold' }
      };

      // Adjust positions
      setNodes(nds => {
        const updated = nds.map(n => {
          if (n.id === '3') return { ...n, position: { x: n.position.x, y: n.position.y + 100 } };
          return n;
        });
        return [...updated, newNode];
      });

      setEdges(eds => {
        // Remove old edge 2->3, add 2->new and new->3
        const filtered = eds.filter(e => e.id !== 'e2-3');
        return [
          ...filtered,
          { id: `e2-${newNodeId}`, source: '2', target: newNodeId, markerEnd: { type: MarkerType.ArrowClosed }, animated: true },
          { id: `e${newNodeId}-3`, source: newNodeId, target: '3', markerEnd: { type: MarkerType.ArrowClosed }, animated: true }
        ];
      });

      // Update metrics
      setMetrics(prev => ({
        testCases: prev.testCases + 4,
        complexity: prev.complexity + 8,
        qaScore: Math.max(0, prev.qaScore - 2) // more complexity slightly drops raw score
      }));

      addLog('Successfully updated State Machine & Metrics', 'success');
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      
      {/* Left Panel: Diagram & Input */}
      <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-800">
        
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Bot className="text-blue-500" />
              Agentic Testing Simulator
            </h1>
            <p className="text-sm text-slate-500">State-Driven Testing & Impact System (PoC)</p>
          </div>
        </div>

        {/* React Flow Diagram */}
        <div className="flex-1 relative bg-slate-50 dark:bg-slate-900 h-96">
          <ReactFlow 
            nodes={nodes} 
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            colorMode="system"
          >
            <Background gap={12} size={1} />
            <Controls />
            <Panel position="top-right" className="bg-white/80 dark:bg-black/80 p-2 rounded shadow-sm text-xs backdrop-blur-sm">
              Live State Machine
            </Panel>
          </ReactFlow>
        </div>

        {/* Natural Language Input */}
        <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <form onSubmit={handleProcessIntent} className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 'Add a fraud check step before fulfilling order'"
              disabled={isProcessing}
              className="flex-1 p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={isProcessing || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Settings className="w-5 h-5" />
                </motion.div>
              ) : (
                <Send className="w-5 h-5" />
              )}
              Instruct AI
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel: Logs & Metrics */}
      <div className="w-full md:w-96 flex flex-col bg-white dark:bg-slate-950">
        
        {/* Business Impact Metrics */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Activity className="text-indigo-500 w-5 h-5" />
            Impact Metrics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="text-slate-500 text-xs font-medium uppercase mb-1">Generated Tests</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                <AnimatePresence mode="popLayout">
                  <motion.span key={metrics.testCases} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    {metrics.testCases}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="text-slate-500 text-xs font-medium uppercase mb-1">Complexity %</div>
              <div className="text-2xl font-bold text-amber-500">
                <AnimatePresence mode="popLayout">
                  <motion.span key={metrics.complexity} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    {metrics.complexity}%
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <div className="col-span-2 bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
              <div>
                <div className="text-indigo-700 dark:text-indigo-400 text-xs font-medium uppercase mb-1">System Health / QA Score</div>
                <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-300">
                  <AnimatePresence mode="popLayout">
                    <motion.span key={metrics.qaScore} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      {metrics.qaScore}/100
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              <ShieldAlert className="w-10 h-10 text-indigo-300 dark:text-indigo-700 opacity-50" />
            </div>
          </div>
        </div>

        {/* MCP Execution Logs */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">MCP Execution Panel</h2>
          <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-slate-400 text-center mt-10 italic">Awaiting instructions...</div>
            ) : (
              logs.map((log) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  key={log.id}
                  className={`p-3 rounded-lg border flex items-start gap-2 ${
                    log.type === 'mcp' 
                      ? 'bg-slate-800 text-green-400 border-slate-700' 
                      : log.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {log.type === 'mcp' && <Cpu className="w-4 h-4 shrink-0 mt-0.5" />}
                  {log.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
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
