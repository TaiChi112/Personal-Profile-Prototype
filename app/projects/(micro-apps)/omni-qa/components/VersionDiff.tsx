
import { ReactFlow, Background, type Node, type Edge, } from '@xyflow/react';
import { GitCompare, } from 'lucide-react';

export function VersionDiff() {
  const diffNodes: Node[] = [
    { id: '1', position: { x: 250, y: 50 }, data: { label: 'Start' }, style: { background: '#1e293b', color: '#f8fafc', opacity: 0.5 } },
    { id: '2', position: { x: 250, y: 150 }, data: { label: 'Process Payment' }, style: { background: '#1e293b', color: '#f8fafc', opacity: 0.5 } },
    { id: 'new-1', position: { x: 250, y: 250 }, data: { label: '+ Verify Cashback' }, style: { background: '#059669', color: '#ffffff', border: '2px solid #10b981' } },
    { id: 'del-1', position: { x: 450, y: 250 }, data: { label: '- Legacy Check' }, style: { background: '#991b1b', color: '#ffffff', border: '2px dashed #ef4444', textDecoration: 'line-through' } },
    { id: '3', position: { x: 250, y: 350 }, data: { label: 'Generate Receipt' }, style: { background: '#1e293b', color: '#f8fafc', opacity: 0.5 } },
  ];

  const diffEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', style: { stroke: '#475569' } },
    { id: 'e2-del', source: '2', target: 'del-1', style: { stroke: '#ef4444', strokeDasharray: '5,5' }, animated: true },
    { id: 'e2-new', source: '2', target: 'new-1', style: { stroke: '#10b981', strokeWidth: 2 }, animated: true },
    { id: 'enew-3', source: 'new-1', target: '3', style: { stroke: '#10b981', strokeWidth: 2 } },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GitCompare className="text-amber-400" /> Visual Audit Diff
          </h2>
          <p className="text-slate-400 text-sm mt-1">Comparing main branch with AI proposed changes</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 text-xs bg-emerald-950/50 text-emerald-400 px-3 py-1.5 rounded-md border border-emerald-900">
            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Added
          </div>
          <div className="flex items-center gap-2 text-xs bg-rose-950/50 text-rose-400 px-3 py-1.5 rounded-md border border-rose-900">
            <div className="w-2 h-2 rounded-full bg-rose-500" /> Removed
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex">
        <div className="flex-1 relative border-r border-slate-800">
          <ReactFlow nodes={diffNodes} edges={diffEdges} fitView colorMode="dark" nodesDraggable={false}>
            <Background color="#334155" gap={16} />
          </ReactFlow>
        </div>
        <div className="w-80 bg-slate-900 p-6 overflow-y-auto">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6">Commit History</h3>
          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-indigo-500">
              <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1" />
              <p className="text-sm text-white font-medium">AI Agent (OmniQA)</p>
              <p className="text-xs text-slate-400 mt-1">Added Cashback verification state to prevent refund loops.</p>
              <p className="text-[10px] text-slate-500 mt-2">Just now • Impact: +12% Test Suite</p>
            </div>
            <div className="relative pl-6 border-l-2 border-slate-700">
              <div className="absolute w-3 h-3 bg-slate-700 rounded-full -left-[7px] top-1" />
              <p className="text-sm text-slate-300 font-medium">Dev Team</p>
              <p className="text-xs text-slate-500 mt-1">Initial state machine setup.</p>
              <p className="text-[10px] text-slate-600 mt-2">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
