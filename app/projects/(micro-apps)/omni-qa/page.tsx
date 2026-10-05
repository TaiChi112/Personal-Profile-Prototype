"use client";

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { IntentEngine } from './components/IntentEngine';
import { VersionDiff } from './components/VersionDiff';
import { MCPSimulator } from './components/MCPSimulator';
import { RiskCalculator } from './components/RiskCalculator';
import { QAScorecard } from './components/QAScorecard';
import type { ActiveModule } from './types';

export default function OmniQAApp() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('intent');

  return (
    <div className="flex h-screen w-full bg-slate-950 font-sans overflow-hidden">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      
      <main className="flex-1 h-full overflow-hidden relative">
        {activeModule === 'intent' && <IntentEngine />}
        {activeModule === 'diff' && <VersionDiff />}
        {activeModule === 'mcp' && <MCPSimulator />}
        {activeModule === 'risk' && <RiskCalculator />}
        {activeModule === 'pms' && <QAScorecard />}
      </main>
    </div>
  );
}
