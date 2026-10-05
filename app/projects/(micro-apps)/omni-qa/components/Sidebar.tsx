
import type { ActiveModule } from '../types';
import { GitCompare, MessageSquare, Terminal, AlertTriangle, Users } from 'lucide-react';

interface SidebarProps {
  activeModule: ActiveModule;
  setActiveModule: (m: ActiveModule) => void;
}

export function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  const menu = [
    { id: 'intent', icon: MessageSquare, label: 'Intent-to-State' },
    { id: 'diff', icon: GitCompare, label: 'Visual Diff Audit' },
    { id: 'mcp', icon: Terminal, label: 'MCP Self-Healing' },
    { id: 'risk', icon: AlertTriangle, label: 'Risk & Tech Debt' },
    { id: 'pms', icon: Users, label: 'QA PMS Sync' },
  ] as const;

  return (
    <div className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <span className="text-indigo-500">Omni</span>QA
        </h1>
        <p className="text-xs text-slate-500 mt-1">Autonomous Ecosystem</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menu.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeModule === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
