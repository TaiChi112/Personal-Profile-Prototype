"use client";

import React, { useMemo, useState } from "react";
import {
  Briefcase,
  Code2,
  Cpu,
  Layers,
  Plug,
  RotateCcw,
  SearchCheck,
} from "lucide-react";
import { CustomStateModal } from "./components/CustomStateModal";
import { LeftOrchestratorSidebar } from "./components/LeftOrchestratorSidebar";
import { RightInspectorSidebar } from "./components/RightInspectorSidebar";
import { StateCanvasSvg } from "./components/StateCanvasSvg";
import { calculateComplexityMetrics } from "./engine/complexityEngine";
import type { RolePerspective, WorkflowPresetId } from "./engine/types";
import { WORKFLOW_PRESETS } from "./store/presets";
import { composeGraph, useStateFlowStore } from "./store/useStateFlowStore";

const ROLE_OPTIONS: {
  id: RolePerspective;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "client", label: "Client ROI", Icon: Briefcase },
  { id: "qa", label: "QA Tests", Icon: SearchCheck },
  { id: "dev", label: "Dev JSON AST", Icon: Code2 },
  { id: "mcp", label: "MCP Tools", Icon: Plug },
];

const PRESET_ORDER: WorkflowPresetId[] = ["ecommerce", "pms", "fintech"];

export default function StateFlowAiPage() {
  const state = useStateFlowStore();
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const preset = WORKFLOW_PRESETS[state.presetId];
  const { nodes, edges } = useMemo(
    () => composeGraph(state),
    [
      state.presetId,
      state.activeAddons,
      state.baseNodes,
      state.baseEdges,
      state.customNodes,
      state.customEdges,
    ],
  );

  const metrics = useMemo(
    () =>
      calculateComplexityMetrics(
        nodes,
        edges,
        preset.quotaLimit,
        preset.baseCost,
      ),
    [nodes, edges, preset.quotaLimit, preset.baseCost],
  );

  const quotaPct = Math.min(
    100,
    Math.round((metrics.points / preset.quotaLimit) * 100),
  );

  const costDeltaLabel =
    metrics.costDeltaFromBase === 0
      ? "ฐานราคาเริ่มต้น"
      : metrics.costDeltaFromBase > 0
        ? `+${metrics.costDeltaFromBase.toLocaleString()} THB`
        : `${metrics.costDeltaFromBase.toLocaleString()} THB`;

  return (
    <div className="min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] w-full flex flex-col bg-slate-950 text-slate-200 overflow-x-hidden lg:overflow-hidden">
      {/* Executive Dashboard Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-20">
        {/* Left: Brand & Workflow Preset Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">
                StateFlow AI
              </h1>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">
                Living SSOT &amp; Cost Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Multi-Perspective N x N State Machine (Prototype Mode: Local SSOT)
            </p>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1 ml-0 sm:ml-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <label htmlFor="preset-select" className="sr-only">
              Workflow Preset
            </label>
            <select
              id="preset-select"
              value={state.presetId}
              onChange={(e) =>
                state.setPreset(e.target.value as WorkflowPresetId)
              }
              className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {PRESET_ORDER.map((id) => (
                <option key={id} value={id} className="bg-slate-900 text-white">
                  {WORKFLOW_PRESETS[id].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: 4-Role Perspective Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 overflow-x-auto max-w-full">
          {ROLE_OPTIONS.map(({ id, label, Icon }) => {
            const isActive = state.activeRole === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => state.setRole(id)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Real-Time Cost & Complexity Quota Engine */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col">
            <div className="flex justify-between items-center text-[11px] mb-1 gap-3">
              <span className="text-slate-400">Complexity Quota</span>
              <span
                className={`font-mono font-bold ${
                  metrics.overQuota ? "text-rose-400" : "text-cyan-400"
                }`}
              >
                {metrics.points} / {preset.quotaLimit} Pts
              </span>
            </div>
            <div className="w-36 sm:w-44 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-300 ${
                  metrics.overQuota
                    ? "bg-rose-500"
                    : "bg-gradient-to-r from-cyan-400 to-indigo-500"
                }`}
                style={{ width: `${quotaPct}%` }}
              />
            </div>
          </div>

          <div className="border-l border-slate-800 pl-4 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              Estimated Project Cost
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                {metrics.cost.toLocaleString()} THB
              </span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${
                  metrics.costDeltaFromBase === 0
                    ? "bg-slate-800 text-slate-300"
                    : metrics.costDeltaFromBase > 0
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-emerald-500/20 text-emerald-300"
                }`}
              >
                {costDeltaLabel}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => state.resetWorkflow()}
            title="รีเซ็ต Workflow เป็นค่าเริ่มต้นของ Preset ปัจจุบัน"
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </header>

      {/* Main 3-Column Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden min-h-0">
        <LeftOrchestratorSidebar
          onOpenCustomModal={() => setIsCustomModalOpen(true)}
        />
        <StateCanvasSvg />
        <RightInspectorSidebar />
      </div>

      {/* Add Custom State Modal */}
      <CustomStateModal
        open={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
      />
    </div>
  );
}
