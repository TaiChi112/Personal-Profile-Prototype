"use client";

import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  Plus,
  Rocket,
  Sparkles,
  Square,
  Zap,
} from "lucide-react";
import { WORKFLOW_PRESETS } from "../store/presets";
import { useStateFlowStore } from "../store/useStateFlowStore";

interface LeftOrchestratorSidebarProps {
  onOpenCustomModal: () => void;
}

export function LeftOrchestratorSidebar({
  onOpenCustomModal,
}: LeftOrchestratorSidebarProps) {
  const state = useStateFlowStore();
  const preset = WORKFLOW_PRESETS[state.presetId];
  const [promptInput, setPromptInput] = useState("");

  const handleRunIntent = () => {
    const text = promptInput.trim() || preset.samplePrompts[0]?.prompt || "";
    if (!promptInput.trim() && text) {
      setPromptInput(text);
    }
    state.executeAiIntention(text);
  };

  return (
    <aside className="w-full lg:w-80 bg-slate-900/95 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col z-10 overflow-y-auto shrink-0">
      {/* Section 0: AI Intention Orchestrator */}
      <div className="p-4 border-b border-slate-800 bg-gradient-to-b from-indigo-950/40 to-slate-900">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Intention Orchestrator</span>
          </h2>
          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono">
            NL -&gt; JSON
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mb-2">
          พิมพ์สั่งด้วยภาษามนุษย์เพื่อให้ AI Agent แปลงเป็น JSON State และคำนวณราคาอัตโนมัติ
        </p>

        <textarea
          rows={2}
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          placeholder="เช่น: แทรกขั้นตอนตรวจเครดิตบูโรหลังสร้างออเดอร์ ถ้าไม่ผ่านให้เด้งกลับไปเริ่มต้นใหม่..."
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
        />

        <div className="flex gap-1.5 mt-1.5 mb-2 overflow-x-auto pb-1">
          {preset.samplePrompts.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => setPromptInput(sample.prompt)}
              className="shrink-0 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md border border-slate-700 cursor-pointer"
            >
              {sample.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleRunIntent}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Bot className="w-4 h-4" />
          <span>สั่ง AI Agent อัปเดต State SSOT</span>
        </button>

        {state.aiIntentStatus && (
          <div className="mt-2 text-[11px] text-cyan-300 font-mono bg-slate-950/90 p-2 rounded-lg border border-cyan-500/30">
            {state.aiIntentStatus}
          </div>
        )}
      </div>

      {/* Section 1: Scope Creep Simulator */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            1. จำลองลูกค้าขอเพิ่มเงื่อนไข
          </h2>
          <span className="text-[10px] text-slate-400">Scope Creep</span>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          ลองเปิด/ปิด Feature ด้านล่างเพื่อดูการแตกแขนงแบบ N x N และผลกระทบต่อราคา
        </p>

        <div className="space-y-2.5">
          {preset.addons.map((addon) => {
            const isActive = state.activeAddons.includes(addon.id);
            return (
              <div
                key={addon.id}
                onClick={() => state.toggleAddon(addon.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isActive
                    ? "border-indigo-500 bg-indigo-950/20"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-slate-200">
                      {addon.title}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {addon.description}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isActive}
                    readOnly
                    className="mt-1 accent-indigo-500 pointer-events-none"
                  />
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex justify-between text-[11px] font-mono">
                  <span className="text-amber-400">{addon.summaryTag}</span>
                  <span className="text-emerald-400">{addon.impactLabel}</span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onOpenCustomModal}
          className="mt-3 w-full py-2 px-3 rounded-xl border border-dashed border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>เพิ่ม Custom State / Condition เอง</span>
        </button>
      </div>

      {/* Section 2: AI Agent Auto-MBT Simulation */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400">
            2. AI Agent วิ่งจำลอง Test Case
          </h2>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
            Auto-MBT
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          ไม่ต้องเทสต์แบบ Manual ให้ AI วิ่งสำรวจเส้นทางในกราฟ
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => state.startSimulation("best")}
            className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
              state.simMode === "best"
                ? "bg-emerald-500/25 border-emerald-400 text-emerald-200"
                : "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300"
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold">
              <Rocket className="w-3.5 h-3.5" />
              <span>Best Case</span>
            </div>
            <span className="text-[10px] text-emerald-400/80">
              Shortest Happy Path
            </span>
          </button>

          <button
            type="button"
            onClick={() => state.startSimulation("worst")}
            className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
              state.simMode === "worst"
                ? "bg-rose-500/25 border-rose-400 text-rose-200"
                : "bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/20 text-rose-300"
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Worst Case</span>
            </div>
            <span className="text-[10px] text-rose-400/80">
              Loop &amp; Fallback Hell
            </span>
          </button>

          <button
            type="button"
            onClick={() => state.startSimulation("leapfrog")}
            className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
              state.simMode === "leapfrog"
                ? "bg-amber-500/25 border-amber-400 text-amber-200"
                : "bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 text-amber-300"
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Leapfrog</span>
            </div>
            <span className="text-[10px] text-amber-400/80">
              Bypass / Critical Reset
            </span>
          </button>

          <button
            type="button"
            onClick={() => state.startSimulation("mining")}
            className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
              state.simMode === "mining"
                ? "bg-cyan-500/25 border-cyan-400 text-cyan-200"
                : "bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300"
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>Live Traffic</span>
            </div>
            <span className="text-[10px] text-cyan-400/80">Process Mining</span>
          </button>
        </div>

        {state.simMode && (
          <button
            type="button"
            onClick={() => state.stopSimulation()}
            className="mt-2 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Square className="w-3 h-3" />
            <span>หยุดการจำลอง (Reset View)</span>
          </button>
        )}
      </div>

      {/* Section 3: Graph Legend */}
      <div className="p-4 mt-auto bg-slate-950/50">
        <div className="text-[11px] font-semibold text-slate-400 mb-2">
          สัญลักษณ์เส้นทาง (Data Flow Types):
        </div>
        <div className="grid grid-cols-2 gap-y-1.5 text-[11px] text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
            เงื่อนไขผ่าน (Forward)
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-amber-400 inline-block" />
            วนซ้ำที่เดิม (Retry)
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-rose-500 inline-block" />
            ย้อนกลับ (Fallback)
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-purple-400 inline-block" />
            ข้ามขั้น (Leapfrog)
          </div>
        </div>
      </div>
    </aside>
  );
}
