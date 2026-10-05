import type React from 'react';
import { useState } from 'react';
import { ReactFlow, Background, Controls, type Node, type Edge, MarkerType } from '@xyflow/react';
import { Send, Sparkles } from 'lucide-react';

const initialNodes: Node[] = [
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'Start' }, style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' } },
  { id: '2', position: { x: 250, y: 150 }, data: { label: 'Process Payment' }, style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' } },
  { id: '3', position: { x: 250, y: 250 }, data: { label: 'Generate Receipt' }, style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' } },
];
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }, style: { stroke: '#64748b' } },
  { id: 'e2-3', source: '2', target: '3', markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }, style: { stroke: '#64748b' } },
];

export function IntentEngine() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) { return; }
    setIsTyping(true);
    
    // Mock AI Processing
    setTimeout(() => {
      const newNode: Node = {
        id: 'new-1',
        position: { x: 250, y: 200 },
        data: { label: 'Verify Cashback' },
        style: { background: '#059669', color: '#ffffff', border: '2px dashed #34d399', boxShadow: '0 0 15px rgba(52, 211, 153, 0.4)' }
      };
      
      setNodes([
        initialNodes[0],
        initialNodes[1],
        newNode,
        { ...initialNodes[2], position: { x: 250, y: 300 } }
      ]);

      setEdges([
        initialEdges[0],
        { id: 'e2-new', source: '2', target: 'new-1', animated: true, style: { stroke: '#10b981' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
        { id: 'enew-3', source: 'new-1', target: '3', animated: true, style: { stroke: '#10b981' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } }
      ]);
      
      setIsTyping(false);
      setInput('');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-indigo-400" /> Intent-to-State Engine
          </h2>
          <p className="text-slate-400 text-sm mt-1">Translate natural language to state machine architecture</p>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <ReactFlow nodes={nodes} edges={edges} fitView colorMode="dark">
          <Background color="#334155" gap={16} />
          <Controls className="bg-slate-800 border-slate-700 fill-slate-300" />
        </ReactFlow>
      </div>

      <div className="p-6 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 'เพิ่มระบบตรวจสอบย้อนกลับเครดิตเงินคืนก่อนย้ายไปสถานะออกใบเสร็จ'"
            className="flex-1 bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button disabled={isTyping} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all">
            {isTyping ? <span className="animate-pulse">Thinking...</span> : <><Send className="w-4 h-4" /> Generate State</>}
          </button>
        </form>
      </div>
    </div>
  );
}
